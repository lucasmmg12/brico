// ============================================
// CALENDARIO DE ENTREGAS - GRUPO BRICO
// ============================================

// Inicializar Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

const appState = {
    unidadActual: 'Mayorista',
    fechaSeleccionada: new Date().toISOString().split('T')[0],
    turnos: [],
    pedidos: []
};

const elements = {
    tabs: document.querySelectorAll('.tab-modern'),
    fechaInput: document.getElementById('fecha-seleccionada'),
    btnPrevDay: document.getElementById('btn-prev-day'),
    btnNextDay: document.getElementById('btn-next-day'),
    btnHoy: document.getElementById('btn-hoy'),
    fechaDisplay: document.getElementById('fecha-display'),
    turnosGrid: document.getElementById('turnos-grid'),
    emptyCalendar: document.getElementById('empty-calendar'),
    statTurnosTotales: document.getElementById('stat-turnos-totales'),
    statTurnosOcupados: document.getElementById('stat-turnos-ocupados'),
    statTurnosDisponibles: document.getElementById('stat-turnos-disponibles'),
    statPedidosEntregar: document.getElementById('stat-pedidos-entregar'),
    modalTurno: document.getElementById('modal-turno'),
    modalTurnoTitle: document.getElementById('modal-turno-title'),
    turnoPedidosList: document.getElementById('turno-pedidos-list'),
    closeTurno: document.getElementById('close-turno'),
    toastContainer: document.getElementById('toast-container')
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('📅 Calendario de Entregas inicializado');
    initEventListeners();
    elements.fechaInput.value = appState.fechaSeleccionada;
    actualizarFechaDisplay();
    cargarCalendario();
});

function initEventListeners() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => cambiarUnidad(tab.dataset.unidad));
    });

    elements.fechaInput.addEventListener('change', (e) => {
        appState.fechaSeleccionada = e.target.value;
        actualizarFechaDisplay();
        cargarCalendario();
    });

    elements.btnPrevDay.addEventListener('click', () => cambiarDia(-1));
    elements.btnNextDay.addEventListener('click', () => cambiarDia(1));
    elements.btnHoy.addEventListener('click', () => {
        appState.fechaSeleccionada = new Date().toISOString().split('T')[0];
        elements.fechaInput.value = appState.fechaSeleccionada;
        actualizarFechaDisplay();
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

function cambiarDia(dias) {
    const fecha = new Date(appState.fechaSeleccionada);
    fecha.setDate(fecha.getDate() + dias);
    appState.fechaSeleccionada = fecha.toISOString().split('T')[0];
    elements.fechaInput.value = appState.fechaSeleccionada;
    actualizarFechaDisplay();
    cargarCalendario();
}

function actualizarFechaDisplay() {
    const fecha = new Date(appState.fechaSeleccionada + 'T00:00:00');
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.fechaDisplay.textContent = fecha.toLocaleDateString('es-AR', opciones);
}

async function cargarCalendario() {
    try {
        // Cargar pedidos del día
        const { data: pedidos, error } = await supabaseClient
            .from('pedidos')
            .select('*')
            .eq('unidad_negocio', appState.unidadActual)
            .eq('turno_fecha', appState.fechaSeleccionada)
            .order('turno_hora', { ascending: true });

        if (error) throw error;

        appState.pedidos = pedidos || [];

        // Generar turnos del día (09:00 a 23:00, cada 10 minutos)
        generarTurnos();
        renderizarCalendario();
        actualizarEstadisticas();

        console.log(`✅ Calendario cargado: ${appState.pedidos.length} pedidos`);
    } catch (error) {
        console.error('❌ Error al cargar calendario:', error);
        showToast('Error al cargar calendario', 'error');
    }
}

function generarTurnos() {
    const turnos = [];
    const horaInicio = 9; // 09:00
    const horaFin = 23; // 23:00
    const intervalo = 10; // minutos

    for (let hora = horaInicio; hora <= horaFin; hora++) {
        for (let minuto = 0; minuto < 60; minuto += intervalo) {
            if (hora === horaFin && minuto > 0) break; // No pasar de 23:00

            const horaStr = String(hora).padStart(2, '0');
            const minutoStr = String(minuto).padStart(2, '0');
            const turnoHora = `${horaStr}:${minutoStr}:00`;

            // Contar pedidos en este turno
            const pedidosTurno = appState.pedidos.filter(p => p.turno_hora === turnoHora);

            turnos.push({
                hora: turnoHora,
                horaDisplay: `${horaStr}:${minutoStr}`,
                pedidos: pedidosTurno,
                ocupado: pedidosTurno.length > 0,
                cupos: 3, // Máximo 3 pedidos por turno
                disponibles: 3 - pedidosTurno.length
            });
        }
    }

    appState.turnos = turnos;
}

function renderizarCalendario() {
    if (appState.turnos.length === 0) {
        elements.turnosGrid.style.display = 'none';
        elements.emptyCalendar.style.display = 'block';
        return;
    }

    elements.turnosGrid.style.display = 'grid';
    elements.emptyCalendar.style.display = 'none';

    elements.turnosGrid.innerHTML = appState.turnos.map(turno => crearTarjetaTurno(turno)).join('');

    // Agregar event listeners
    document.querySelectorAll('.turno-card').forEach(card => {
        card.addEventListener('click', () => {
            const hora = card.dataset.hora;
            abrirModalTurno(hora);
        });
    });
}

function crearTarjetaTurno(turno) {
    const estado = turno.pedidos.length === 0 ? 'disponible' :
        turno.pedidos.length < turno.cupos ? 'parcial' : 'completo';

    return `
        <div class="turno-card turno-${estado}" data-hora="${turno.hora}">
            <div class="turno-hora">${turno.horaDisplay}</div>
            <div class="turno-info">
                <span class="turno-pedidos">${turno.pedidos.length}/${turno.cupos}</span>
                <span class="turno-estado">${estado === 'disponible' ? 'Libre' : estado === 'parcial' ? 'Parcial' : 'Completo'}</span>
            </div>
            ${turno.pedidos.length > 0 ? `
                <div class="turno-preview">
                    ${turno.pedidos.slice(0, 2).map(p => `
                        <div class="turno-pedido-mini">${p.cliente_nombre}</div>
                    `).join('')}
                    ${turno.pedidos.length > 2 ? `<div class="turno-mas">+${turno.pedidos.length - 2} más</div>` : ''}
                </div>
            ` : ''}
        </div>
    `;
}

function actualizarEstadisticas() {
    const turnosTotales = appState.turnos.length;
    const turnosOcupados = appState.turnos.filter(t => t.pedidos.length > 0).length;
    const turnosDisponibles = turnosTotales - turnosOcupados;
    const pedidosEntregar = appState.pedidos.length;

    elements.statTurnosTotales.textContent = turnosTotales;
    elements.statTurnosOcupados.textContent = turnosOcupados;
    elements.statTurnosDisponibles.textContent = turnosDisponibles;
    elements.statPedidosEntregar.textContent = pedidosEntregar;
}

function abrirModalTurno(hora) {
    const turno = appState.turnos.find(t => t.hora === hora);
    if (!turno) return;

    elements.modalTurnoTitle.textContent = `Turno ${turno.horaDisplay}`;

    if (turno.pedidos.length === 0) {
        elements.turnoPedidosList.innerHTML = `
            <div class="empty-turno">
                <p>No hay pedidos programados para este turno</p>
                <p class="turno-disponibles">Cupos disponibles: ${turno.disponibles}</p>
            </div>
        `;
    } else {
        elements.turnoPedidosList.innerHTML = `
            <div class="turno-pedidos-header">
                <p><strong>${turno.pedidos.length}</strong> pedido(s) programado(s)</p>
                <p class="turno-disponibles">Cupos disponibles: ${turno.disponibles}</p>
            </div>
            <div class="turno-pedidos-list">
                ${turno.pedidos.map(pedido => `
                    <div class="turno-pedido-card">
                        <div class="pedido-header">
                            <strong>${pedido.cliente_nombre}</strong>
                            <span class="badge badge-${pedido.estado_pedido}">${pedido.estado_pedido}</span>
                        </div>
                        <div class="pedido-info">
                            <p>📱 ${pedido.cliente_telefono}</p>
                            <p>📦 ${pedido.promo_seleccionada}</p>
                            <p>💰 $${pedido.monto.toLocaleString('es-AR')}</p>
                        </div>
                        ${pedido.notas_internas ? `<p class="pedido-notas">📝 ${pedido.notas_internas}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    elements.modalTurno.classList.add('active');
}

function cerrarModalTurno() {
    elements.modalTurno.classList.remove('active');
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

console.log('📅 Calendario de Entregas cargado correctamente');
