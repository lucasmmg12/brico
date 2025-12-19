// ============================================
// GRUPO BRICO - Estadísticas con Gráficos
// Conectado con datos reales de Supabase
// ============================================

// Este archivo depende de estadisticas.js que ya carga los datos
// Solo nos encargamos de los gráficos

let charts = {};

// Función llamada desde estadisticas.js cuando los datos están listos
function actualizarGraficos() {
    if (!appState || !appState.pedidos) {
        console.warn('⚠️ appState no disponible aún');
        return;
    }

    // Si los gráficos no están inicializados, inicializarlos
    if (Object.keys(charts).length === 0) {
        inicializarGraficos();
    }

    // Actualizar gráfico de pedidos por estado
    const estadoCounts = {
        nuevo: appState.pedidos.filter(p => p.estado_pedido === 'nuevo').length,
        armado: appState.pedidos.filter(p => p.estado_pedido === 'armado').length,
        entregado: appState.pedidos.filter(p => p.estado_pedido === 'entregado').length,
        no_vino: appState.pedidos.filter(p => p.estado_pedido === 'no_vino').length
    };

    if (charts.pedidosEstado) {
        charts.pedidosEstado.data.datasets[0].data = [
            estadoCounts.nuevo,
            estadoCounts.armado,
            estadoCounts.entregado,
            estadoCounts.no_vino
        ];
        charts.pedidosEstado.update();
    }

    // Actualizar gráfico de ventas por día (últimos 7 días)
    const ventasPorDia = calcularVentasUltimos7Dias();
    if (charts.ventasSemana) {
        charts.ventasSemana.data.datasets[0].data = ventasPorDia.valores;
        charts.ventasSemana.data.labels = ventasPorDia.labels;
        charts.ventasSemana.update();
    }

    // Actualizar gráfico de estado de pago
    const pagoCounts = {
        pendiente: appState.pedidos.filter(p => p.estado_pago === 'pendiente').length,
        pagado: appState.pedidos.filter(p => p.estado_pago === 'pagado').length,
        rechazado: appState.pedidos.filter(p => p.estado_pago === 'rechazado').length
    };

    if (charts.estadoPago) {
        charts.estadoPago.data.datasets[0].data = [
            pagoCounts.pendiente,
            pagoCounts.pagado,
            pagoCounts.rechazado
        ];
        charts.estadoPago.update();
    }

    // Actualizar gráfico de top promociones
    const promoCounts = {};
    appState.pedidos.forEach(p => {
        if (p.promo_seleccionada) {
            promoCounts[p.promo_seleccionada] = (promoCounts[p.promo_seleccionada] || 0) + 1;
        }
    });

    const topPromos = Object.entries(promoCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (charts.topPromos) {
        charts.topPromos.data.labels = topPromos.map(p => p[0]);
        charts.topPromos.data.datasets[0].data = topPromos.map(p => p[1]);
        charts.topPromos.update();
    }

    console.log('📊 Gráficos actualizados con datos reales');
}

function calcularVentasUltimos7Dias() {
    const hoy = new Date();
    const labels = [];
    const valores = [];
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    // Generar últimos 7 días
    for (let i = 6; i >= 0; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - i);
        const fechaStr = fecha.toISOString().split('T')[0];

        // Contar pedidos de ese día
        const pedidosDia = appState.pedidos.filter(p =>
            p.created_at && p.created_at.startsWith(fechaStr)
        ).length;

        labels.push(diasSemana[fecha.getDay()]);
        valores.push(pedidosDia);
    }

    return { labels, valores };
}

function inicializarGraficos() {
    console.log('📊 Inicializando gráficos...');

    // Gráfico de Pedidos por Estado
    const ctxEstado = document.getElementById('chart-pedidos-estado');
    if (ctxEstado) {
        charts.pedidosEstado = new Chart(ctxEstado, {
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
    }

    // Gráfico de Ventas por Día
    const ctxVentas = document.getElementById('chart-ventas-semana');
    if (ctxVentas) {
        charts.ventasSemana = new Chart(ctxVentas, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Pedidos',
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
                            font: { family: 'Poppins' },
                            stepSize: 1
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
    }

    // Gráfico de Estado de Pago
    const ctxPago = document.getElementById('chart-estado-pago');
    if (ctxPago) {
        charts.estadoPago = new Chart(ctxPago, {
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
    }

    // Gráfico de Top Promociones
    const ctxPromos = document.getElementById('chart-top-promos');
    if (ctxPromos) {
        charts.topPromos = new Chart(ctxPromos, {
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
    }

    console.log('📊 Gráficos inicializados');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Módulo de gráficos cargado');
    // Los gráficos se inicializarán cuando se llame a actualizarGraficos()
});

console.log('📊 Módulo de estadísticas con gráficos cargado');
