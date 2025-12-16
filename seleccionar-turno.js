// ============================================
// SELECCIÓN DE TURNO V2 - MEJORADO
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
    DIAS_MOSTRAR: 7,
    TURNOS_POR_PAGINA: 12 // Mostrar solo 12 turnos a la vez
};

const appState = {
    nombre: '',
    telefono: '',
    unidadNegocio: 'Mayorista',
    diaSeleccionado: null,
    turnoSeleccionado: null,
    horaMinima: null,
    diasDisponibles: []
};

const elements = {
    stepForm: document.getElementById('step-form'),
    stepDia: document.getElementById('step-dia'),
    stepHora: document.getElementById('step-hora'),
    stepSuccess: document.getElementById('step-success'),
    formDatos: document.getElementById('form-datos'),
    nombre: document.getElementById('nombre'),
    telefono: document.getElementById('telefono'),
    diasContainer: document.getElementById('dias-container'),
    horasContainer: document.getElementById('horas-container'),
    diaSeleccionadoText: document.getElementById('dia-seleccionado-text'),
    btnConfirmar: document.getElementById('btn-confirmar'),
    btnVolverDias: document.getElementById('btn-volver-dias'),
    turnoConfirmado: document.getElementById('turno-confirmado'),
    errorMessage: document.getElementById('error-message')
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('📅 Selección de turno V2 inicializada');

    const params = new URLSearchParams(window.location.search);
    appState.unidadNegocio = params.get('unidad') || 'Mayorista';

    calcularHoraMinima();
    initEventListeners();
});

function initEventListeners() {
    elements.formDatos.addEventListener('submit', handleFormSubmit);
    elements.btnConfirmar.addEventListener('click', confirmarTurno);
    if (elements.btnVolverDias) {
        elements.btnVolverDias.addEventListener('click', volverADias);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    appState.nombre = elements.nombre.value.trim();
    let telefono = elements.telefono.value.trim();

    telefono = telefono.replace(/\D/g, '');

    if (telefono.length !== 10) {
        showError('El teléfono debe tener 10 dígitos (código de área + número, sin 0 ni 15)');
        return;
    }

    appState.telefono = '549' + telefono;

    console.log(`📱 Teléfono normalizado: ${telefono} → ${appState.telefono}`);

    elements.stepForm.classList.add('hidden');
    elements.stepDia.classList.remove('hidden');

    cargarDias();
}

function calcularHoraMinima() {
    const ahora = new Date();
    const horaMinima = new Date(ahora.getTime() + CONFIG.HORAS_ANTICIPACION * 60 * 60 * 1000);
    appState.horaMinima = horaMinima;
}

async function cargarDias() {
    try {
        const fechas = [];
        for (let i = 0; i < CONFIG.DIAS_MOSTRAR; i++) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + i);
            fechas.push(fecha.toISOString().split('T')[0]);
        }

        const { data: pedidos, error } = await supabaseClient
            .from('pedidos')
            .select('turno_fecha, turno_hora')
            .eq('unidad_negocio', appState.unidadNegocio)
            .in('turno_fecha', fechas)
            .not('turno_fecha', 'is', null);

        if (error) throw error;

        const turnosOcupados = new Set();
        (pedidos || []).forEach(p => {
            turnosOcupados.add(`${p.turno_fecha}_${p.turno_hora}`);
        });

        appState.diasDisponibles = fechas.map(fechaStr => {
            const turnos = generarTurnosDia(fechaStr, turnosOcupados);
            return {
                fecha: fechaStr,
                turnosDisponibles: turnos.length
            };
        }).filter(dia => dia.turnosDisponibles > 0);

        renderizarDias();

    } catch (error) {
        console.error('Error al cargar días:', error);
        showError('Error al cargar días disponibles');
    }
}

function renderizarDias() {
    if (appState.diasDisponibles.length === 0) {
        elements.diasContainer.innerHTML = '<p class="error">No hay turnos disponibles en los próximos días</p>';
        return;
    }

    elements.diasContainer.innerHTML = appState.diasDisponibles.map(dia => {
        const fecha = new Date(dia.fecha + 'T00:00:00');
        const esHoy = dia.fecha === new Date().toISOString().split('T')[0];

        return `
            <button class="dia-btn" data-fecha="${dia.fecha}">
                <div class="dia-nombre">${fecha.toLocaleDateString('es-AR', { weekday: 'long' })}</div>
                <div class="dia-numero">${fecha.getDate()}</div>
                <div class="dia-mes">${fecha.toLocaleDateString('es-AR', { month: 'short' })}</div>
                ${esHoy ? '<div class="dia-badge-small">Hoy</div>' : ''}
                <div class="dia-disponibles">${dia.turnosDisponibles} turnos</div>
            </button>
        `;
    }).join('');

    document.querySelectorAll('.dia-btn').forEach(btn => {
        btn.addEventListener('click', () => seleccionarDia(btn.dataset.fecha));
    });
}

async function seleccionarDia(fecha) {
    appState.diaSeleccionado = fecha;

    elements.stepDia.classList.add('hidden');
    elements.stepHora.classList.remove('hidden');

    const fechaObj = new Date(fecha + 'T00:00:00');
    elements.diaSeleccionadoText.textContent = fechaObj.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    await cargarHoras(fecha);
}

async function cargarHoras(fecha) {
    try {
        elements.horasContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando turnos...</p></div>';

        const { data: pedidos, error } = await supabaseClient
            .from('pedidos')
            .select('turno_hora')
            .eq('unidad_negocio', appState.unidadNegocio)
            .eq('turno_fecha', fecha);

        if (error) throw error;

        const turnosOcupados = new Set();
        (pedidos || []).forEach(p => turnosOcupados.add(p.turno_hora));

        const turnos = generarTurnosDia(fecha, new Set(
            Array.from(turnosOcupados).map(h => `${fecha}_${h}`)
        ));

        renderizarHoras(turnos);

    } catch (error) {
        console.error('Error al cargar horas:', error);
        showError('Error al cargar turnos');
    }
}

function generarTurnosDia(fechaStr, turnosOcupados) {
    const turnos = [];

    for (let hora = CONFIG.HORA_APERTURA; hora <= CONFIG.HORA_CIERRE; hora++) {
        for (let minuto = 0; minuto < 60; minuto += CONFIG.INTERVALO_MINUTOS) {
            if (hora === CONFIG.HORA_CIERRE && minuto > 0) break;

            const horaStr = String(hora).padStart(2, '0');
            const minutoStr = String(minuto).padStart(2, '0');
            const turnoHora = `${horaStr}:${minutoStr}:00`;

            const fechaHoraTurno = new Date(`${fechaStr}T${turnoHora}`);

            const disponible = fechaHoraTurno >= appState.horaMinima &&
                !turnosOcupados.has(`${fechaStr}_${turnoHora}`);

            if (disponible) {
                turnos.push({
                    fecha: fechaStr,
                    hora: turnoHora,
                    horaDisplay: `${horaStr}:${minutoStr}`
                });
            }
        }
    }

    return turnos;
}

function renderizarHoras(turnos) {
    if (turnos.length === 0) {
        elements.horasContainer.innerHTML = '<p class="error">No hay turnos disponibles para este día</p>';
        return;
    }

    elements.horasContainer.innerHTML = turnos.map(turno => `
        <button class="hora-btn" data-hora="${turno.hora}">
            ${turno.horaDisplay}
        </button>
    `).join('');

    document.querySelectorAll('.hora-btn').forEach(btn => {
        btn.addEventListener('click', () => seleccionarHora(btn.dataset.hora));
    });
}

function seleccionarHora(hora) {
    document.querySelectorAll('.hora-btn').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected');

    appState.turnoSeleccionado = {
        fecha: appState.diaSeleccionado,
        hora: hora
    };

    elements.btnConfirmar.classList.remove('hidden');
}

function volverADias() {
    elements.stepHora.classList.add('hidden');
    elements.stepDia.classList.remove('hidden');
    appState.diaSeleccionado = null;
    appState.turnoSeleccionado = null;
    elements.btnConfirmar.classList.add('hidden');
}

async function confirmarTurno() {
    if (!appState.turnoSeleccionado) {
        showError('Por favor selecciona un turno');
        return;
    }

    elements.btnConfirmar.disabled = true;
    elements.btnConfirmar.textContent = 'Confirmando...';

    try {
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
                cliente_dni: '00000000',
                notas_internas: 'Turno seleccionado por el cliente desde web'
            }])
            .select();

        if (error) {
            console.error('Error Supabase:', error);
            throw error;
        }

        await enviarConfirmacionWhatsApp();
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
    elements.stepHora.classList.add('hidden');
    elements.stepSuccess.classList.remove('hidden');
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');

    setTimeout(() => {
        elements.errorMessage.classList.add('hidden');
    }, 5000);
}

console.log('📅 Sistema de selección de turno V2 cargado');
