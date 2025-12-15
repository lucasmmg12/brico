// ============================================
// GRUPO BRICO - Página de Estadísticas
// ============================================

function getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Importar datos desde localStorage o usar mock
const PEDIDOS_MOCK = [
    {
        id: '1',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Juan Pérez',
        cliente_dni: '12345678',
        cliente_telefono: '1123456789',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 1 - Almacén Completo',
        monto: 15000.00,
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        fecha_entrega: getToday()
    },
    {
        id: '2',
        created_at: new Date().toISOString(),
        cliente_nombre: 'María González',
        cliente_dni: '87654321',
        cliente_telefono: '1198765432',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 2 - Bebidas y Snacks',
        monto: 8500.50,
        estado_pago: 'pagado',
        estado_pedido: 'armado',
        fecha_entrega: getToday()
    },
    {
        id: '3',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        cliente_nombre: 'Carlos Rodríguez',
        cliente_dni: '11223344',
        cliente_telefono: '1155443322',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 4 - Carnes Premium',
        monto: 25000.00,
        estado_pago: 'pagado',
        estado_pedido: 'entregado',
        fecha_entrega: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0]
    },
    {
        id: '4',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Ana Martínez',
        cliente_dni: '44332211',
        cliente_telefono: '1144556677',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 3 - Limpieza y Hogar',
        monto: 6200.00,
        estado_pago: 'pagado',
        estado_pedido: 'nuevo',
        fecha_entrega: getToday()
    },
    {
        id: '5',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        cliente_nombre: 'Luis Fernández',
        cliente_dni: '55667788',
        cliente_telefono: '1177889900',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 5 - Verduras y Frutas',
        monto: 12000.00,
        estado_pago: 'rechazado',
        estado_pedido: 'no_vino',
        fecha_entrega: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0]
    },
    {
        id: '6',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Patricia Silva',
        cliente_dni: '99887766',
        cliente_telefono: '1166778899',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 6 - Desayuno Completo',
        monto: 4500.00,
        estado_pago: 'pagado',
        estado_pedido: 'entregado',
        fecha_entrega: getToday()
    },
    {
        id: '7',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Roberto Gómez',
        cliente_dni: '22334455',
        cliente_telefono: '1133224455',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 7 - Panadería y Fiambrería',
        monto: 18500.00,
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        fecha_entrega: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0]
    },
    {
        id: '8',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        cliente_nombre: 'Sofía Ramírez',
        cliente_dni: '66778899',
        cliente_telefono: '1155667788',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 8 - Congelados',
        monto: 7800.00,
        estado_pago: 'pagado',
        estado_pedido: 'armado',
        fecha_entrega: getToday()
    },
    {
        id: '9',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        cliente_nombre: 'Diego Torres',
        cliente_dni: '33445566',
        cliente_telefono: '1199887766',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 9 - Bebidas Alcohólicas',
        monto: 32000.00,
        estado_pago: 'pagado',
        estado_pedido: 'entregado',
        fecha_entrega: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0]
    },
    {
        id: '10',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Valentina López',
        cliente_dni: '77889900',
        cliente_telefono: '1122334455',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 10 - Mascotas',
        monto: 5600.00,
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        fecha_entrega: getToday()
    }
];

const appState = {
    unidadActual: 'Mayorista',
    pedidos: []
};

const elements = {
    tabs: document.querySelectorAll('.tab'),
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

function cargarEstadisticas() {
    appState.pedidos = PEDIDOS_MOCK.filter(p => p.unidad_negocio === appState.unidadActual);
    actualizarEstadisticas();
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
        .reduce((sum, p) => sum + parseFloat(p.monto), 0);

    elements.statImporteFacturado.textContent = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(facturado);

    // Pedidos de hoy
    const today = getToday();
    const pedidosHoy = appState.pedidos.filter(p => p.created_at.startsWith(today)).length;
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
