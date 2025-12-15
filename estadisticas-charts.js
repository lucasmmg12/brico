// ============================================
// GRUPO BRICO - Estadísticas con Gráficos
// ============================================

function getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// === DATOS MOCK (listos para reemplazar con datos de Supabase) ===
const PEDIDOS_MOCK = [
    {
        id: '1',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Juan Pérez',
        cliente_dni: '12345678',
        cliente_telefono: '1123456789',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 1 Clásica',
        monto: 19499.00,
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
        promo_seleccionada: 'Promo 2 Clásica',
        monto: 19950.00,
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
        promo_seleccionada: 'Promo 3 Clásica',
        monto: 20450.00,
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
        promo_seleccionada: 'Promo 1 XL',
        monto: 20399.00,
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
        promo_seleccionada: 'Promo 4 Clásica',
        monto: 21390.00,
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
        promo_seleccionada: 'Promo 2 XL',
        monto: 20950.00,
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
        promo_seleccionada: 'Promo 5 Clásica',
        monto: 20650.00,
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
        promo_seleccionada: 'Promo 3 XL',
        monto: 21550.00,
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
        promo_seleccionada: 'Promo 1 Clásica',
        monto: 19499.00,
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
        promo_seleccionada: 'Promo 4 XL',
        monto: 22640.00,
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        fecha_entrega: getToday()
    }
];

const appState = {
    unidadActual: 'Mayorista',
    pedidos: [],
    charts: {}
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
    inicializarGraficos();
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
    actualizarGraficos();
}

// === FUNCIÓN PARA CARGAR DATOS (LISTA PARA SUPABASE) ===
async function cargarEstadisticas() {
    // TODO: Reemplazar con llamada a Supabase
    // const { data, error } = await supabase
    //     .from('pedidos')
    //     .select('*')
    //     .eq('unidad_negocio', appState.unidadActual);

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

    console.log(`📊 Estadísticas actualizadas para ${appState.unidadActual}`);
}

// === GRÁFICOS CON CHART.JS ===
function inicializarGraficos() {
    // Gráfico de Pedidos por Estado
    const ctxEstado = document.getElementById('chart-pedidos-estado');
    appState.charts.pedidosEstado = new Chart(ctxEstado, {
        type: 'doughnut',
        data: {
            labels: ['Nuevo', 'Armado', 'Entregado', 'No vino'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#3498DB', '#F39C12', '#28B463', '#E74C3C'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Poppins', size: 12 },
                        padding: 15
                    }
                }
            }
        }
    });

    // Gráfico de Ventas por Día
    const ctxVentas = document.getElementById('chart-ventas-semana');
    appState.charts.ventasSemana = new Chart(ctxVentas, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Ventas',
                data: [0, 0, 0, 0, 0, 0, 0],
                borderColor: '#FF6700',
                backgroundColor: 'rgba(255, 103, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { family: 'Poppins' }
                    }
                },
                x: {
                    ticks: {
                        font: { family: 'Poppins' }
                    }
                }
            }
        }
    });

    // Gráfico de Estado de Pago
    const ctxPago = document.getElementById('chart-estado-pago');
    appState.charts.estadoPago = new Chart(ctxPago, {
        type: 'pie',
        data: {
            labels: ['Pendiente', 'Pagado', 'Rechazado'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#F39C12', '#28B463', '#E74C3C'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Poppins', size: 12 },
                        padding: 15
                    }
                }
            }
        }
    });

    // Gráfico de Top Promociones
    const ctxPromos = document.getElementById('chart-top-promos');
    appState.charts.topPromos = new Chart(ctxPromos, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Cantidad vendida',
                data: [],
                backgroundColor: '#FF6700',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { family: 'Poppins' },
                        stepSize: 1
                    }
                },
                x: {
                    ticks: {
                        font: { family: 'Poppins', size: 10 }
                    }
                }
            }
        }
    });

    actualizarGraficos();
}

function actualizarGraficos() {
    // Actualizar gráfico de pedidos por estado
    const estadoCounts = {
        nuevo: appState.pedidos.filter(p => p.estado_pedido === 'nuevo').length,
        armado: appState.pedidos.filter(p => p.estado_pedido === 'armado').length,
        entregado: appState.pedidos.filter(p => p.estado_pedido === 'entregado').length,
        no_vino: appState.pedidos.filter(p => p.estado_pedido === 'no_vino').length
    };
    appState.charts.pedidosEstado.data.datasets[0].data = [
        estadoCounts.nuevo,
        estadoCounts.armado,
        estadoCounts.entregado,
        estadoCounts.no_vino
    ];
    appState.charts.pedidosEstado.update();

    // Actualizar gráfico de ventas por día (mock data - listo para datos reales)
    // TODO: Calcular ventas reales por día desde Supabase
    const ventasMock = [12, 19, 15, 22, 18, 25, 20];
    appState.charts.ventasSemana.data.datasets[0].data = ventasMock;
    appState.charts.ventasSemana.update();

    // Actualizar gráfico de estado de pago
    const pagoCounts = {
        pendiente: appState.pedidos.filter(p => p.estado_pago === 'pendiente').length,
        pagado: appState.pedidos.filter(p => p.estado_pago === 'pagado').length,
        rechazado: appState.pedidos.filter(p => p.estado_pago === 'rechazado').length
    };
    appState.charts.estadoPago.data.datasets[0].data = [
        pagoCounts.pendiente,
        pagoCounts.pagado,
        pagoCounts.rechazado
    ];
    appState.charts.estadoPago.update();

    // Actualizar gráfico de top promociones
    const promoCounts = {};
    appState.pedidos.forEach(p => {
        promoCounts[p.promo_seleccionada] = (promoCounts[p.promo_seleccionada] || 0) + 1;
    });

    const topPromos = Object.entries(promoCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    appState.charts.topPromos.data.labels = topPromos.map(p => p[0]);
    appState.charts.topPromos.data.datasets[0].data = topPromos.map(p => p[1]);
    appState.charts.topPromos.update();
}

console.log('📊 Módulo de estadísticas con gráficos cargado');
