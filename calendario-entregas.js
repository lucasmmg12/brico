// ============================================
// CALENDARIO DE ENTREGAS V2 - GRUPO BRICO
// Diseño moderno inspirado en Calendly
// ============================================

// Inicializar Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

const appState = {
    unidadActual: 'Mayorista',
    fechaInicio: new Date(),
    diasMostrados: 7,
    turnosPorDia: {},
    pedidosPorDia: {},
    horaMinima: null // Se calculará dinámicamente (+4 horas desde ahora)
};

const CONFIG = {
    HORAS_ANTICIPACION: 4,
    HORA_APERTURA: 9,
    HORA_CIERRE: 23,
    INTERVALO_MINUTOS: 10
};

const elements = {
    tabs: document.querySelectorAll('.tab-modern'),
    calendarioGrid: document.getElementById('calendario-grid'),
    btnPrevWeek: document.getElementById('btn-prev-week'),
    btnNextWeek: document.getElementById('btn-next-week'),
    btnHoy: document.getElementById('btn-hoy'),
    rangoFechas: document.getElementById('rango-fechas'),
    statTurnosDisponibles: document.getElementById('stat-turnos-disponibles'),
    statTurnosOcupados: document.getElementById('stat-turnos-ocupados'),
    statProximoTurno: document.getElementById('stat-proximo-turno'),
    modalTurno: document.getElementById('modal-turno'),
    modalTurnoTitle: document.getElementById('modal-turno-title'),
    turnoPedidosList: document.getElementById('turno-pedidos-list'),
    closeTurno: document.getElementById('close-turno'),
    toastContainer: document.getElementById('toast-container')
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('📅 Calendario V2 inicializado');
    calcularHoraMinima();
    initEventListeners();
    cargarCalendario();
});

function initEventListeners() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => cambiarUnidad(tab.dataset.unidad));
    });

    elements.btnPrevWeek.addEventListener('click', () => cambiarSemana(-7));
    elements.btnNextWeek.addEventListener('click', () => cambiarSemana(7));
    elements.btnHoy.addEventListener('click', () => {
        appState.fechaInicio = new Date();
        calcularHoraMinima();
        cargarCalendario();
    });

    elements.closeTurno.addEventListener('click', cerrarModalTurno);
    elements.modalTurno.querySelector('.modal-overlay').addEventListener('click', cerrarModalTurno);
}

function cambiarUnidad(unidad) {
    appState.unidadActual = unidad;

    elements.tabs.forEach(tab => {
        if (tab.dataset.unidad === unidad) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    cargarCalendario();
}

function cambiarSemana(dias) {
    const nuevaFecha = new Date(appState.fechaInicio);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);

    // No permitir ir al pasado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (nuevaFecha >= hoy) {
        appState.fechaInicio = nuevaFecha;
        calcularHoraMinima();
        cargarCalendario();
    }
}

function calcularHoraMinima() {
    const ahora = new Date();
    const horaMinima = new Date(ahora.getTime() + CONFIG.HORAS_ANTICIPACION * 60 * 60 * 1000);
    appState.horaMinima = horaMinima;

    console.log(`⏰ Hora mínima para turnos: ${horaMinima.toLocaleString('es-AR')}`);
}

async function cargarCalendario() {
    try {
        mostrarCargando();

        // Calcular rango de fechas
        const fechas = [];
        for (let i = 0; i < appState.diasMostrados; i++) {
            const fecha = new Date(appState.fechaInicio);
            fecha.setDate(fecha.getDate() + i);
            fechas.push(fecha.toISOString().split('T')[0]);
        }

        // Cargar pedidos de toda la semana
        const { data: pedidos, error } = await supabaseClient
            .from('pedidos')
            .select('*')
            .eq('unidad_negocio', appState.unidadActual)
            .in('turno_fecha', fechas)
            .not('turno_fecha', 'is', null)
            .order('turno_fecha', { ascending: true })
            .order('turno_hora', { ascending: true });

        if (error) throw error;

        // Organizar pedidos por día
        appState.pedidosPorDia = {};
        (pedidos || []).forEach(pedido => {
            if (!appState.pedidosPorDia[pedido.turno_fecha]) {
                appState.pedidosPorDia[pedido.turno_fecha] = [];
            }
            appState.pedidosPorDia[pedido.turno_fecha].push(pedido);
        });

        // Generar turnos para cada día
        generarTurnosSemana(fechas);
        renderizarCalendario();
        actualizarEstadisticas();
        actualizarRangoFechas();

        console.log(`✅ Calendario cargado: ${pedidos?.length || 0} pedidos`);
    } catch (error) {
        console.error('❌ Error al cargar calendario:', error);
        showToast('Error al cargar calendario', 'error');
    }
}

function generarTurnosSemana(fechas) {
    appState.turnosPorDia = {};

    fechas.forEach(fechaStr => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        const turnos = [];
        const pedidosDia = appState.pedidosPorDia[fechaStr] || [];

        for (let hora = CONFIG.HORA_APERTURA; hora <= CONFIG.HORA_CIERRE; hora++) {
            for (let minuto = 0; minuto < 60; minuto += CONFIG.INTERVALO_MINUTOS) {
                if (hora === CONFIG.HORA_CIERRE && minuto > 0) break;

                const horaStr = String(hora).padStart(2, '0');
                const minutoStr = String(minuto).padStart(2, '0');
                const turnoHora = `${horaStr}:${minutoStr}:00`;

                // Crear fecha/hora completa del turno
                const fechaHoraTurno = new Date(`${fechaStr}T${turnoHora}`);

                // Verificar si el turno está disponible (+4 horas)
                const disponible = fechaHoraTurno >= appState.horaMinima;

                // Buscar pedido asignado
                const pedido = pedidosDia.find(p => p.turno_hora === turnoHora);

                turnos.push({
                    hora: turnoHora,
                    horaDisplay: `${horaStr}:${minutoStr}`,
                    fecha: fechaStr,
                    fechaHora: fechaHoraTurno,
                    disponible: disponible,
                    ocupado: !!pedido,
                    pedido: pedido || null
                });
            }
        }

        appState.turnosPorDia[fechaStr] = turnos;
    });
}

function renderizarCalendario() {
    const fechas = Object.keys(appState.turnosPorDia).sort();

    elements.calendarioGrid.innerHTML = fechas.map(fecha => {
        const turnos = appState.turnosPorDia[fecha];
        const fechaObj = new Date(fecha + 'T00:00:00');
        const esHoy = fecha === new Date().toISOString().split('T')[0];

        return `
            <div class="dia-columna ${esHoy ? 'dia-hoy' : ''}">
                <div class="dia-header">
                    <div class="dia-nombre">${fechaObj.toLocaleDateString('es-AR', { weekday: 'short' })}</div>
                    <div class="dia-numero">${fechaObj.getDate()}</div>
                    <div class="dia-mes">${fechaObj.toLocaleDateString('es-AR', { month: 'short' })}</div>
                    ${esHoy ? '<div class="dia-badge">Hoy</div>' : ''}
                </div>
                <div class="turnos-lista">
                    ${renderizarTurnosDia(turnos)}
                </div>
            </div>
        `;
    }).join('');

    // Agregar event listeners
    document.querySelectorAll('.turno-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            const fecha = slot.dataset.fecha;
            const hora = slot.dataset.hora;
            const disponible = slot.dataset.disponible === 'true';
            const ocupado = slot.dataset.ocupado === 'true';

            if (disponible && !ocupado) {
                // Turno disponible - podría abrir modal para asignar
                showToast('Turno disponible para asignar', 'info');
            } else if (ocupado) {
                // Turno ocupado - mostrar detalles
                abrirModalTurno(fecha, hora);
            } else {
                // Turno no disponible (menos de 4 horas)
                showToast('Turno no disponible (mínimo 4 horas de anticipación)', 'warning');
            }
        });
    });

    ocultarCargando();
}

function renderizarTurnosDia(turnos) {
    // Filtrar solo turnos disponibles o ocupados
    const turnosMostrar = turnos.filter(t => t.disponible || t.ocupado);

    if (turnosMostrar.length === 0) {
        return '<div class="sin-turnos">Sin turnos disponibles</div>';
    }

    return turnosMostrar.map(turno => {
        let claseEstado = 'disponible';
        let icono = '✓';

        if (!turno.disponible) {
            claseEstado = 'no-disponible';
            icono = '🔒';
        } else if (turno.ocupado) {
            claseEstado = 'ocupado';
            icono = '✕';
        }

        return `
            <div class="turno-slot turno-${claseEstado}" 
                 data-fecha="${turno.fecha}" 
                 data-hora="${turno.hora}"
                 data-disponible="${turno.disponible}"
                 data-ocupado="${turno.ocupado}">
                <span class="turno-hora-text">${turno.horaDisplay}</span>
                <span class="turno-icono">${icono}</span>
                ${turno.ocupado ? `<span class="turno-cliente">${turno.pedido.cliente_nombre.split(' ')[0]}</span>` : ''}
            </div>
        `;
    }).join('');
}

function actualizarEstadisticas() {
    let totalDisponibles = 0;
    let totalOcupados = 0;
    let proximoTurno = null;

    Object.values(appState.turnosPorDia).forEach(turnos => {
        turnos.forEach(turno => {
            if (turno.disponible && !turno.ocupado) {
                totalDisponibles++;
                if (!proximoTurno) {
                    proximoTurno = turno;
                }
            }
            if (turno.ocupado) {
                totalOcupados++;
            }
        });
    });

    elements.statTurnosDisponibles.textContent = totalDisponibles;
    elements.statTurnosOcupados.textContent = totalOcupados;

    if (proximoTurno) {
        const fecha = new Date(proximoTurno.fechaHora);
        elements.statProximoTurno.textContent = fecha.toLocaleString('es-AR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        elements.statProximoTurno.textContent = 'No disponible';
    }
}

function actualizarRangoFechas() {
    const fechas = Object.keys(appState.turnosPorDia).sort();
    if (fechas.length > 0) {
        const inicio = new Date(fechas[0] + 'T00:00:00');
        const fin = new Date(fechas[fechas.length - 1] + 'T00:00:00');

        elements.rangoFechas.textContent = `${inicio.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} - ${fin.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
}

function abrirModalTurno(fecha, hora) {
    const turnos = appState.turnosPorDia[fecha];
    const turno = turnos.find(t => t.hora === hora);

    if (!turno || !turno.pedido) return;

    const pedido = turno.pedido;
    const fechaObj = new Date(turno.fechaHora);

    elements.modalTurnoTitle.textContent = `Turno ${fechaObj.toLocaleString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    })}`;

    elements.turnoPedidosList.innerHTML = `
        <div class="turno-pedido-card">
            <div class="pedido-header">
                <strong>${pedido.cliente_nombre}</strong>
                <span class="badge badge-${pedido.estado_pedido}">${pedido.estado_pedido}</span>
            </div>
            <div class="pedido-info">
                <p>📱 ${pedido.cliente_telefono}</p>
                <p>🆔 DNI: ${pedido.cliente_dni}</p>
                <p>📦 ${pedido.promo_seleccionada}</p>
                <p>💰 $${pedido.monto.toLocaleString('es-AR')}</p>
                <p>💳 Pago: <span class="badge badge-${pedido.estado_pago}">${pedido.estado_pago}</span></p>
            </div>
            ${pedido.notas_internas ? `<p class="pedido-notas">📝 ${pedido.notas_internas}</p>` : ''}
            <div class="pedido-acciones">
                <a href="https://wa.me/${pedido.cliente_telefono}" target="_blank" class="btn-whatsapp">
                    💬 WhatsApp
                </a>
            </div>
        </div>
    `;

    elements.modalTurno.classList.add('active');
}

function cerrarModalTurno() {
    elements.modalTurno.classList.remove('active');
}

function mostrarCargando() {
    elements.calendarioGrid.innerHTML = `
        <div class="loading-calendar">
            <div class="spinner"></div>
            <p>Cargando calendario...</p>
        </div>
    `;
}

function ocultarCargando() {
    // Ya se renderizó el calendario
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 250ms ease reverse';
        setTimeout(() => toast.remove(), 250);
    }, 4000);
}

console.log('📅 Calendario V2 cargado correctamente');
