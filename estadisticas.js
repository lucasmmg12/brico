// ============================================
// GRUPO BRICO - Página de Estadísticas
// Conectado con Supabase (Datos Reales)
// ============================================

function getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// === Inicializar Supabase ===
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

console.log('✅ Supabase inicializado:', SUPABASE_CONFIG.url);

const appState = {
    unidadActual: 'Mayorista',
    pedidos: []
};

const elements = {
    tabs: document.querySelectorAll('.tab-modern'),
    statsUnidad: document.getElementById('stats-unidad'),
    statPedidosTomados: document.getElementById('stat-pedidos-tomados'),
    statPedidosEntregados: document.getElementById('stat-pedidos-entregados'),
    statImporteFacturado: document.getElementById('stat-importe-facturado'),
    statPedidosHoy: document.getElementById('stat-pedidos-hoy'),
    statEntregasHoy: document.getElementById('stat-entregas-hoy'),
    statPendientesPago: document.getElementById('stat-pendientes-pago')
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Estadísticas Brico inicializadas');
    initEventListeners();
    cargarEstadisticas();
});

function initEventListeners() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => cambiarUnidad(tab.dataset.unidad));
    });
}

function cambiarUnidad(unidad) {
    appState.unidadActual = unidad;
    elements.statsUnidad.textContent = unidad;

    elements.tabs.forEach(tab => {
        if (tab.dataset.unidad === unidad) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    cargarEstadisticas();
}

async function cargarEstadisticas() {
    try {
        console.log(`📊 Cargando estadísticas para ${appState.unidadActual}...`);

        // Mostrar loading en las métricas
        mostrarLoading();

        // Cargar pedidos desde Supabase
        const { data, error } = await supabaseClient
            .from('pedidos')
            .select('*')
            .eq('unidad_negocio', appState.unidadActual)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error al cargar pedidos:', error);
            throw error;
        }

        appState.pedidos = data || [];
        console.log(`✅ Cargados ${appState.pedidos.length} pedidos para ${appState.unidadActual}`);

        actualizarEstadisticas();

        // Actualizar gráficos si existe la función
        if (typeof actualizarGraficos === 'function') {
            actualizarGraficos();
        }
    } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error);
        mostrarError();
    }
}

function mostrarLoading() {
    elements.statPedidosTomados.innerHTML = '<div class="spinner-small"></div>';
    elements.statPedidosEntregados.innerHTML = '<div class="spinner-small"></div>';
    elements.statImporteFacturado.innerHTML = '<div class="spinner-small"></div>';
    elements.statPedidosHoy.innerHTML = '<div class="spinner-small"></div>';
    elements.statEntregasHoy.innerHTML = '<div class="spinner-small"></div>';
    elements.statPendientesPago.innerHTML = '<div class="spinner-small"></div>';
}

function mostrarError() {
    const errorText = 'Error';
    elements.statPedidosTomados.textContent = errorText;
    elements.statPedidosEntregados.textContent = errorText;
    elements.statImporteFacturado.textContent = errorText;
    elements.statPedidosHoy.textContent = errorText;
    elements.statEntregasHoy.textContent = errorText;
    elements.statPendientesPago.textContent = errorText;
}

function actualizarEstadisticas() {
    const total = appState.pedidos.length;

    // Pedidos tomados (total)
    elements.statPedidosTomados.textContent = total;

    // Pedidos entregados
    const entregados = appState.pedidos.filter(p => p.estado_pedido === 'entregado').length;
    elements.statPedidosEntregados.textContent = entregados;

    // Importe facturado (solo pedidos pagados)
    const facturado = appState.pedidos
        .filter(p => p.estado_pago === 'pagado')
        .reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);

    elements.statImporteFacturado.textContent = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(facturado);

    // Pedidos de hoy
    const today = getToday();
    const pedidosHoy = appState.pedidos.filter(p => p.created_at && p.created_at.startsWith(today)).length;
    elements.statPedidosHoy.textContent = pedidosHoy;

    // Entregas de hoy
    const entregasHoy = appState.pedidos.filter(p => p.fecha_entrega === today).length;
    elements.statEntregasHoy.textContent = entregasHoy;

    // Pendientes de pago
    const pendientesPago = appState.pedidos.filter(p => p.estado_pago === 'pendiente').length;
    elements.statPendientesPago.textContent = pendientesPago;

    console.log(`📊 Estadísticas actualizadas para ${appState.unidadActual}:`, {
        total,
        entregados,
        facturado,
        pedidosHoy,
        entregasHoy,
        pendientesPago
    });
}

console.log('📊 Módulo de estadísticas cargado');
