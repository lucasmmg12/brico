// ============================================
// SELECCIÓN DE TURNO - CLIENTE
// ============================================

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

const BUILDERBOT_CONFIG = {
    API_URL: 'https://app.builderbot.cloud/api/v2/c13bbb6b-c2e5-4595-b5eb-7278b6139699/messages',
    API_KEY: '' // Completar con tu API key
};

const CONFIG = {
    HORAS_ANTICIPACION: 4,
    HORA_APERTURA: 9,
    HORA_CIERRE: 23,
    INTERVALO_MINUTOS: 10,
    DIAS_MOSTRAR: 7
};

const appState = {
    nombre: '',
    telefono: '',
    unidadNegocio: 'Mayorista', // Se puede obtener de URL params
    turnoSeleccionado: null,
    horaMinima: null
};

const elements = {
    stepForm: document.getElementById('step-form'),
    stepCalendar: document.getElementById('step-calendar'),
    stepSuccess: document.getElementById('step-success'),
    formDatos: document.getElementById('form-datos'),
    nombre: document.getElementById('nombre'),
    telefono: document.getElementById('telefono'),
    calendarContainer: document.getElementById('calendar-container'),
    btnConfirmar: document.getElementById('btn-confirmar'),
    turnoConfirmado: document.getElementById('turno-confirmado'),
    errorMessage: document.getElementById('error-message')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('📅 Selección de turno inicializada');

    // Obtener unidad de negocio de URL params
    const params = new URLSearchParams(window.location.search);
    appState.unidadNegocio = params.get('unidad') || 'Mayorista';

    calcularHoraMinima();
    initEventListeners();
});

function initEventListeners() {
    elements.formDatos.addEventListener('submit', handleFormSubmit);
    elements.btnConfirmar.addEventListener('click', confirmarTurno);
}

function handleFormSubmit(e) {
    e.preventDefault();

    appState.nombre = elements.nombre.value.trim();
    appState.telefono = elements.telefono.value.trim();

    // Validar teléfono
    if (appState.telefono.length < 10) {
        showError('Por favor ingresa un teléfono válido');
        return;
    }

    // Pasar al calendario
    elements.stepForm.classList.add('hidden');
    elements.stepCalendar.classList.remove('hidden');

    cargarTurnos();
}

function calcularHoraMinima() {
    const ahora = new Date();
    const horaMinima = new Date(ahora.getTime() + CONFIG.HORAS_ANTICIPACION * 60 * 60 * 1000);
    appState.horaMinima = horaMinima;
}

async function cargarTurnos() {
    try {
        // Generar fechas (próximos 7 días)
        const fechas = [];
        for (let i = 0; i < CONFIG.DIAS_MOSTRAR; i++) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + i);
            fechas.push(fecha.toISOString().split('T')[0]);
        }

        // Cargar pedidos existentes
        const { data: pedidos, error } = await supabaseClient
            .from('pedidos')
            .select('turno_fecha, turno_hora')
            .eq('unidad_negocio', appState.unidadNegocio)
            .in('turno_fecha', fechas)
            .not('turno_fecha', 'is', null);

        if (error) throw error;

        // Organizar pedidos por fecha y hora
        const turnosOcupados = new Set();
        (pedidos || []).forEach(p => {
            turnosOcupados.add(`${p.turno_fecha}_${p.turno_hora}`);
        });

        // Renderizar calendario
        renderizarCalendario(fechas, turnosOcupados);

    } catch (error) {
        console.error('Error al cargar turnos:', error);
        showError('Error al cargar turnos disponibles');
    }
}

function renderizarCalendario(fechas, turnosOcupados) {
    const html = fechas.map(fechaStr => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        const esHoy = fechaStr === new Date().toISOString().split('T')[0];

        // Generar turnos del día
        const turnos = generarTurnosDia(fechaStr, turnosOcupados);

        if (turnos.length === 0) {
            return ''; // No mostrar días sin turnos
        }

        return `
            <div class="dia-card">
                <div class="dia-header">
                    <div class="dia-fecha">
                        ${fecha.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </div>
                    ${esHoy ? '<div class="dia-badge">Hoy</div>' : ''}
                </div>
                <div class="turnos-disponibles">
                    ${turnos.map(turno => `
                        <button class="turno-btn" 
                                data-fecha="${turno.fecha}" 
                                data-hora="${turno.hora}"
                                ${!turno.disponible ? 'disabled' : ''}>
                            ${turno.horaDisplay}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }).filter(html => html).join('');

    elements.calendarContainer.innerHTML = html || '<p class="error">No hay turnos disponibles en los próximos días</p>';

    // Agregar event listeners
    document.querySelectorAll('.turno-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => seleccionarTurno(btn));
    });
}

function generarTurnosDia(fechaStr, turnosOcupados) {
    const turnos = [];
    const fecha = new Date(fechaStr + 'T00:00:00');

    for (let hora = CONFIG.HORA_APERTURA; hora <= CONFIG.HORA_CIERRE; hora++) {
        for (let minuto = 0; minuto < 60; minuto += CONFIG.INTERVALO_MINUTOS) {
            if (hora === CONFIG.HORA_CIERRE && minuto > 0) break;

            const horaStr = String(hora).padStart(2, '0');
            const minutoStr = String(minuto).padStart(2, '0');
            const turnoHora = `${horaStr}:${minutoStr}:00`;

            // Crear fecha/hora completa
            const fechaHoraTurno = new Date(`${fechaStr}T${turnoHora}`);

            // Verificar disponibilidad
            const disponible = fechaHoraTurno >= appState.horaMinima &&
                !turnosOcupados.has(`${fechaStr}_${turnoHora}`);

            if (disponible) {
                turnos.push({
                    fecha: fechaStr,
                    hora: turnoHora,
                    horaDisplay: `${horaStr}:${minutoStr}`,
                    disponible: true
                });
            }
        }
    }

    return turnos;
}

function seleccionarTurno(btn) {
    // Deseleccionar todos
    document.querySelectorAll('.turno-btn').forEach(b => b.classList.remove('selected'));

    // Seleccionar este
    btn.classList.add('selected');

    appState.turnoSeleccionado = {
        fecha: btn.dataset.fecha,
        hora: btn.dataset.hora
    };

    elements.btnConfirmar.classList.remove('hidden');
}

async function confirmarTurno() {
    if (!appState.turnoSeleccionado) {
        showError('Por favor selecciona un turno');
        return;
    }

    elements.btnConfirmar.disabled = true;
    elements.btnConfirmar.textContent = 'Confirmando...';

    try {
        // Crear pedido en Supabase
        const { data, error } = await supabaseClient
            .from('pedidos')
            .insert([{
                cliente_nombre: appState.nombre,
                cliente_telefono: appState.telefono,
                unidad_negocio: appState.unidadNegocio,
                turno_fecha: appState.turnoSeleccionado.fecha,
                turno_hora: appState.turnoSeleccionado.hora,
                turno_confirmado: true,
                estado_pedido: 'nuevo',
                estado_pago: 'pendiente',
                promo_seleccionada: 'Pedido desde web',
                monto: 0,
                notas_internas: 'Turno seleccionado por el cliente desde web'
            }])
            .select();

        if (error) throw error;

        // Enviar confirmación por WhatsApp
        await enviarConfirmacionWhatsApp();

        // Mostrar éxito
        mostrarExito();

    } catch (error) {
        console.error('Error al confirmar turno:', error);
        showError('Error al confirmar el turno. Por favor intenta nuevamente.');
        elements.btnConfirmar.disabled = false;
        elements.btnConfirmar.textContent = 'Confirmar Turno';
    }
}

async function enviarConfirmacionWhatsApp() {
    const fecha = new Date(appState.turnoSeleccionado.fecha + 'T' + appState.turnoSeleccionado.hora);
    const fechaFormateada = fecha.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });

    const mensaje = `✅ *Turno Confirmado - Grupo Brico*\n\n` +
        `Hola ${appState.nombre}! 👋\n\n` +
        `Tu turno para retirar tu compra es:\n` +
        `📅 *${fechaFormateada}*\n\n` +
        `📍 Sucursal: ${appState.unidadNegocio}\n` +
        `🆔 *Recordá traer tu DNI*\n\n` +
        `¡Te esperamos! 🎉`;

    try {
        const response = await fetch(BUILDERBOT_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-builderbot': BUILDERBOT_CONFIG.API_KEY
            },
            body: JSON.stringify({
                messages: {
                    content: mensaje
                },
                number: appState.telefono,
                checkIfExists: false
            })
        });

        if (!response.ok) {
            console.error('Error al enviar WhatsApp:', await response.text());
        }
    } catch (error) {
        console.error('Error al enviar WhatsApp:', error);
        // No fallar si el WhatsApp falla
    }
}

function mostrarExito() {
    const fecha = new Date(appState.turnoSeleccionado.fecha + 'T' + appState.turnoSeleccionado.hora);
    const fechaFormateada = fecha.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });

    elements.turnoConfirmado.textContent = fechaFormateada;
    elements.stepCalendar.classList.add('hidden');
    elements.stepSuccess.classList.remove('hidden');
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');

    setTimeout(() => {
        elements.errorMessage.classList.add('hidden');
    }, 5000);
}

console.log('📅 Sistema de selección de turno cargado');
