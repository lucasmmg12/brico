// ============================================
// GRUPO BRICO - Dashboard V2 con Estadísticas y Exportación
// ============================================

// === Función para obtener fecha de hoy ===
function getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// === Datos Mock Actualizados ===
const PEDIDOS_MOCK = [
    {
        id: '1',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Juan Pérez',
        cliente_dni: '12345678',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 1 - Almacén Completo',
        monto: 15000.00,
        comprobante_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        fecha_entrega: getToday(),
        notas_internas: 'Cliente habitual, prioridad alta'
    },
    {
        id: '2',
        created_at: new Date().toISOString(),
        cliente_nombre: 'María González',
        cliente_dni: '87654321',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 2 - Bebidas y Snacks',
        monto: 8500.50,
        comprobante_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'armado',
        fecha_entrega: getToday(),
        notas_internas: null
    },
    {
        id: '3',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Ayer
        cliente_nombre: 'Carlos Rodríguez',
        cliente_dni: '11223344',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 4 - Carnes Premium',
        monto: 25000.00,
        comprobante_url: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'entregado',
        fecha_entrega: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
        notas_internas: 'Solicita entrega antes de las 18hs'
    },
    {
        id: '4',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Ana Martínez',
        cliente_dni: '44332211',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 3 - Limpieza y Hogar',
        monto: 6200.00,
        comprobante_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'nuevo',
        fecha_entrega: getToday(),
        notas_internas: null
    },
    {
        id: '5',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // Hace 2 días
        cliente_nombre: 'Luis Fernández',
        cliente_dni: '55667788',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 5 - Verduras y Frutas',
        monto: 12000.00,
        comprobante_url: null,
        estado_pago: 'rechazado',
        estado_pedido: 'no_vino',
        fecha_entrega: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
        notas_internas: 'Comprobante inválido'
    },
    {
        id: '6',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Patricia Silva',
        cliente_dni: '99887766',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 6 - Desayuno Completo',
        monto: 4500.00,
        comprobante_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'entregado',
        fecha_entrega: getToday(),
        notas_internas: 'Retira en local'
    },
    {
        id: '7',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Roberto Gómez',
        cliente_dni: '22334455',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 7 - Panadería y Fiambrería',
        monto: 18500.00,
        comprobante_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        fecha_entrega: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0], // Mañana
        notas_internas: null
    },
    {
        id: '8',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // Hace 12 horas
        cliente_nombre: 'Sofía Ramírez',
        cliente_dni: '66778899',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 8 - Congelados',
        monto: 7800.00,
        comprobante_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'armado',
        fecha_entrega: getToday(),
        notas_internas: 'Incluir bolsas térmicas'
    },
    {
        id: '9',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Ayer
        cliente_nombre: 'Diego Torres',
        cliente_dni: '33445566',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 9 - Bebidas Alcohólicas',
        monto: 32000.00,
        comprobante_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'entregado',
        fecha_entrega: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
        notas_internas: 'Verificar DNI al entregar'
    },
    {
        id: '10',
        created_at: new Date().toISOString(),
        cliente_nombre: 'Valentina López',
        cliente_dni: '77889900',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 10 - Mascotas',
        monto: 5600.00,
        comprobante_url: null,
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        fecha_entrega: getToday(),
        notas_internas: 'Esperando confirmación de pago'
    }
];

// === Estado de la Aplicación ===
const appState = {
    unidadActual: 'Mayorista',
    pedidos: [],
    filtros: {
        estadoPago: '',
        estadoPedido: '',
        fecha: ''
    },
    editandoPedido: null
};

// === Elementos del DOM ===
const elements = {
    tabs: document.querySelectorAll('.tab'),
    statTotal: document.getElementById('stat-total'),
    statMonto: document.getElementById('stat-monto'),
    statsUnidad: document.getElementById('stats-unidad'),
    statPedidosTomados: document.getElementById('stat-pedidos-tomados'),
    statPedidosEntregados: document.getElementById('stat-pedidos-entregados'),
    statImporteFacturado: document.getElementById('stat-importe-facturado'),
    statPedidosHoy: document.getElementById('stat-pedidos-hoy'),
    statEntregasHoy: document.getElementById('stat-entregas-hoy'),
    statPendientesPago: document.getElementById('stat-pendientes-pago'),
    btnRefresh: document.getElementById('btn-refresh'),
    btnNuevoPedido: document.getElementById('btn-nuevo-pedido'),
    btnNuevoPedidoEmpty: document.getElementById('btn-nuevo-pedido-empty'),
    btnExportExcel: document.getElementById('btn-export-excel'),
    btnExportPdf: document.getElementById('btn-export-pdf'),
    filterEstadoPago: document.getElementById('filter-estado-pago'),
    filterEstadoPedido: document.getElementById('filter-estado-pedido'),
    filterFecha: document.getElementById('filter-fecha'),
    pedidosGrid: document.getElementById('pedidos-grid'),
    emptyState: document.getElementById('empty-state'),
    modalComprobante: document.getElementById('modal-comprobante'),
    modalPedido: document.getElementById('modal-pedido'),
    comprobanteImage: document.getElementById('comprobante-image'),
    closeComprobante: document.getElementById('close-comprobante'),
    closePedido: document.getElementById('close-pedido'),
    modalPedidoTitle: document.getElementById('modal-pedido-title'),
    formPedido: document.getElementById('form-pedido'),
    inputNombre: document.getElementById('input-nombre'),
    inputDni: document.getElementById('input-dni'),
    inputUnidad: document.getElementById('input-unidad'),
    inputPromo: document.getElementById('input-promo'),
    inputMonto: document.getElementById('input-monto'),
    inputFechaEntrega: document.getElementById('input-fecha-entrega'),
    inputComprobante: document.getElementById('input-comprobante'),
    inputNotas: document.getElementById('input-notas'),
    btnCancelar: document.getElementById('btn-cancelar'),
    toastContainer: document.getElementById('toast-container')
};

// === Inicialización ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard Brico V2 inicializado');
    showToast('Modo DEMO V2 - Con estadísticas y exportación', 'info');
    initEventListeners();
    cargarPedidos();
});

// === Event Listeners ===
function initEventListeners() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => cambiarUnidad(tab.dataset.unidad));
    });

    elements.btnRefresh.addEventListener('click', () => {
        showToast('Pedidos actualizados', 'success');
        cargarPedidos();
    });

    elements.btnNuevoPedido.addEventListener('click', abrirModalNuevoPedido);
    elements.btnNuevoPedidoEmpty.addEventListener('click', abrirModalNuevoPedido);
    elements.btnExportExcel.addEventListener('click', exportarExcel);
    elements.btnExportPdf.addEventListener('click', exportarPDF);

    elements.filterEstadoPago.addEventListener('change', (e) => {
        appState.filtros.estadoPago = e.target.value;
        renderizarPedidos();
    });

    elements.filterEstadoPedido.addEventListener('change', (e) => {
        appState.filtros.estadoPedido = e.target.value;
        renderizarPedidos();
    });

    elements.filterFecha.addEventListener('change', (e) => {
        appState.filtros.fecha = e.target.value;
        renderizarPedidos();
    });

    elements.closeComprobante.addEventListener('click', cerrarModalComprobante);
    elements.closePedido.addEventListener('click', cerrarModalPedido);
    elements.btnCancelar.addEventListener('click', cerrarModalPedido);

    elements.modalComprobante.querySelector('.modal-overlay').addEventListener('click', cerrarModalComprobante);
    elements.modalPedido.querySelector('.modal-overlay').addEventListener('click', cerrarModalPedido);

    elements.formPedido.addEventListener('submit', guardarPedido);
}

// === Funciones de Datos ===
function cargarPedidos() {
    mostrarCargando();

    setTimeout(() => {
        appState.pedidos = PEDIDOS_MOCK.filter(p => p.unidad_negocio === appState.unidadActual);
        renderizarPedidos();
        actualizarEstadisticas();
        console.log(`✅ Cargados ${appState.pedidos.length} pedidos para ${appState.unidadActual}`);
    }, 500);
}

function actualizarEstadoPago(pedidoId, nuevoEstado) {
    const pedido = PEDIDOS_MOCK.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.estado_pago = nuevoEstado;
        const pedidoLocal = appState.pedidos.find(p => p.id === pedidoId);
        if (pedidoLocal) {
            pedidoLocal.estado_pago = nuevoEstado;
            renderizarPedidos();
            actualizarEstadisticas();
        }
        showToast(`Estado de pago actualizado a: ${nuevoEstado}`, 'success');
    }
}

function actualizarEstadoPedido(pedidoId, nuevoEstado) {
    const pedido = PEDIDOS_MOCK.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.estado_pedido = nuevoEstado;
        const pedidoLocal = appState.pedidos.find(p => p.id === pedidoId);
        if (pedidoLocal) {
            pedidoLocal.estado_pedido = nuevoEstado;
            renderizarPedidos();
            actualizarEstadisticas();
        }
        showToast(`Pedido marcado como: ${nuevoEstado}`, 'success');
    }
}

function marcarPedidoListo(pedidoId) {
    actualizarEstadoPedido(pedidoId, 'armado');
}

function guardarPedido(e) {
    e.preventDefault();

    const pedidoData = {
        id: appState.editandoPedido || String(PEDIDOS_MOCK.length + 1),
        created_at: new Date().toISOString(),
        cliente_nombre: elements.inputNombre.value.trim(),
        cliente_dni: elements.inputDni.value.trim(),
        unidad_negocio: elements.inputUnidad.value,
        promo_seleccionada: elements.inputPromo.value.trim(),
        monto: parseFloat(elements.inputMonto.value),
        comprobante_url: elements.inputComprobante.value.trim() || null,
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        fecha_entrega: elements.inputFechaEntrega.value || null,
        notas_internas: elements.inputNotas.value.trim() || null
    };

    if (appState.editandoPedido) {
        const index = PEDIDOS_MOCK.findIndex(p => p.id === appState.editandoPedido);
        if (index !== -1) {
            PEDIDOS_MOCK[index] = { ...PEDIDOS_MOCK[index], ...pedidoData };
        }
        showToast('Pedido actualizado correctamente', 'success');
    } else {
        PEDIDOS_MOCK.unshift(pedidoData);
        showToast('Pedido creado correctamente', 'success');
    }

    cerrarModalPedido();
    cargarPedidos();
}

// === Funciones de UI ===
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

    cargarPedidos();
}

function renderizarPedidos() {
    let pedidosFiltrados = [...appState.pedidos];

    if (appState.filtros.estadoPago) {
        pedidosFiltrados = pedidosFiltrados.filter(p => p.estado_pago === appState.filtros.estadoPago);
    }

    if (appState.filtros.estadoPedido) {
        pedidosFiltrados = pedidosFiltrados.filter(p => p.estado_pedido === appState.filtros.estadoPedido);
    }

    if (appState.filtros.fecha === 'hoy') {
        const today = getToday();
        pedidosFiltrados = pedidosFiltrados.filter(p => p.created_at.startsWith(today));
    } else if (appState.filtros.fecha === 'entrega-hoy') {
        const today = getToday();
        pedidosFiltrados = pedidosFiltrados.filter(p => p.fecha_entrega === today);
    }

    if (pedidosFiltrados.length === 0) {
        elements.pedidosGrid.style.display = 'none';
        elements.emptyState.style.display = 'block';
        return;
    }

    elements.pedidosGrid.style.display = 'grid';
    elements.emptyState.style.display = 'none';

    elements.pedidosGrid.innerHTML = pedidosFiltrados.map(pedido => crearTarjetaPedido(pedido)).join('');
    agregarEventListenersTarjetas();
}

function crearTarjetaPedido(pedido) {
    const fechaCreacion = new Date(pedido.created_at).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const montoFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(pedido.monto);

    const badgeUnidad = pedido.unidad_negocio === 'Mayorista' ? 'badge-mayorista' : 'badge-express';

    // Verificar si es pedido de hoy
    const today = getToday();
    const esPedidoHoy = pedido.created_at.startsWith(today);
    const esEntregaHoy = pedido.fecha_entrega === today;

    // Clase de énfasis de pago
    const clasePago = `pago-${pedido.estado_pago}`;

    // Badge de estado de pago
    const badgePago = `
        <div class="card-payment-status">
            <span class="payment-status-badge payment-status-${pedido.estado_pago}">
                ${pedido.estado_pago === 'pendiente' ? '⏳' : pedido.estado_pago === 'pagado' ? '✅' : '❌'}
                ${pedido.estado_pago.toUpperCase()}
            </span>
        </div>
    `;

    return `
        <div class="pedido-card ${clasePago}" data-id="${pedido.id}">
            ${esPedidoHoy ? '<div class="badge-hoy">🆕 PEDIDO HOY</div>' : ''}
            ${esEntregaHoy && !esPedidoHoy ? '<div class="badge-hoy badge-entrega-hoy">🚚 ENTREGA HOY</div>' : ''}
            
            ${badgePago}
            
            <div class="card-header">
                <div class="card-cliente">
                    <div class="card-nombre">${pedido.cliente_nombre}</div>
                    <div class="card-dni">DNI: ${pedido.cliente_dni}</div>
                </div>
                <div class="card-badge ${badgeUnidad}">
                    ${pedido.unidad_negocio}
                </div>
            </div>
            
            <div class="card-body">
                <div class="card-promo">
                    <div class="card-promo-text">${pedido.promo_seleccionada}</div>
                </div>
                
                <div class="card-info-row">
                    <span class="card-label">Monto:</span>
                    <span class="card-monto">${montoFormateado}</span>
                </div>
                
                <div class="card-info-row">
                    <span class="card-label">Fecha Pedido:</span>
                    <span class="card-value">${fechaCreacion}</span>
                </div>
                
                ${pedido.fecha_entrega ? `
                    <div class="card-fecha-entrega">
                        <span class="card-fecha-entrega-icon">📅</span>
                        <span class="card-fecha-entrega-text">Entrega: ${new Date(pedido.fecha_entrega + 'T00:00:00').toLocaleDateString('es-AR')}</span>
                    </div>
                ` : ''}
                
                ${pedido.notas_internas ? `
                    <div class="card-info-row">
                        <span class="card-label">Notas:</span>
                        <span class="card-value">${pedido.notas_internas}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="card-controls">
                <div class="card-control-row">
                    <span class="card-control-label">Pago:</span>
                    <select class="select-estado ${pedido.estado_pago}" data-id="${pedido.id}" data-tipo="pago">
                        <option value="pendiente" ${pedido.estado_pago === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="pagado" ${pedido.estado_pago === 'pagado' ? 'selected' : ''}>Pagado</option>
                        <option value="rechazado" ${pedido.estado_pago === 'rechazado' ? 'selected' : ''}>Rechazado</option>
                    </select>
                </div>
                
                <div class="card-control-row">
                    <span class="card-control-label">Estado:</span>
                    <select class="select-estado" data-id="${pedido.id}" data-tipo="pedido">
                        <option value="nuevo" ${pedido.estado_pedido === 'nuevo' ? 'selected' : ''}>Nuevo</option>
                        <option value="armado" ${pedido.estado_pedido === 'armado' ? 'selected' : ''}>Armado</option>
                        <option value="entregado" ${pedido.estado_pedido === 'entregado' ? 'selected' : ''}>Entregado</option>
                        <option value="no_vino" ${pedido.estado_pedido === 'no_vino' ? 'selected' : ''}>No vino</option>
                    </select>
                </div>
            </div>
            
            <div class="card-actions">
                ${pedido.comprobante_url ? `
                    <button class="btn-card btn-ver-comprobante" data-url="${pedido.comprobante_url}">
                        📄 Ver Comprobante
                    </button>
                ` : ''}
                <button class="btn-card btn-pedido-listo" data-id="${pedido.id}" 
                    ${pedido.estado_pedido === 'armado' ? 'disabled' : ''}>
                    ✅ Marcar Listo
                </button>
            </div>
        </div>
    `;
}

function agregarEventListenersTarjetas() {
    document.querySelectorAll('.select-estado').forEach(select => {
        select.addEventListener('change', (e) => {
            const pedidoId = e.target.dataset.id;
            const tipo = e.target.dataset.tipo;
            const nuevoEstado = e.target.value;

            if (tipo === 'pago') {
                actualizarEstadoPago(pedidoId, nuevoEstado);
            } else if (tipo === 'pedido') {
                actualizarEstadoPedido(pedidoId, nuevoEstado);
            }
        });
    });

    document.querySelectorAll('.btn-ver-comprobante').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = e.currentTarget.dataset.url;
            abrirModalComprobante(url);
        });
    });

    document.querySelectorAll('.btn-pedido-listo').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pedidoId = e.currentTarget.dataset.id;
            marcarPedidoListo(pedidoId);
        });
    });
}

function actualizarEstadisticas() {
    const total = appState.pedidos.length;
    const montoTotal = appState.pedidos.reduce((sum, p) => sum + parseFloat(p.monto), 0);

    // Estadísticas básicas
    elements.statTotal.textContent = total;
    elements.statMonto.textContent = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(montoTotal);

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
        minimumFractionDigits: 0
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
}

function mostrarCargando() {
    elements.pedidosGrid.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando pedidos...</p>
        </div>
    `;
    elements.emptyState.style.display = 'none';
}

// === Modales ===
function abrirModalComprobante(url) {
    elements.comprobanteImage.src = url;
    elements.modalComprobante.classList.add('active');
}

function cerrarModalComprobante() {
    elements.modalComprobante.classList.remove('active');
    elements.comprobanteImage.src = '';
}

function abrirModalNuevoPedido() {
    appState.editandoPedido = null;
    elements.modalPedidoTitle.textContent = 'Nuevo Pedido';
    elements.formPedido.reset();
    elements.inputUnidad.value = appState.unidadActual;
    elements.inputFechaEntrega.value = getToday();
    elements.modalPedido.classList.add('active');
}

function cerrarModalPedido() {
    elements.modalPedido.classList.remove('active');
    elements.formPedido.reset();
    appState.editandoPedido = null;
}

// === Exportación a Excel ===
function exportarExcel() {
    try {
        const datos = appState.pedidos.map(p => ({
            'ID': p.id,
            'Fecha Pedido': new Date(p.created_at).toLocaleString('es-AR'),
            'Cliente': p.cliente_nombre,
            'DNI': p.cliente_dni,
            'Unidad': p.unidad_negocio,
            'Promo': p.promo_seleccionada,
            'Monto': p.monto,
            'Estado Pago': p.estado_pago,
            'Estado Pedido': p.estado_pedido,
            'Fecha Entrega': p.fecha_entrega || 'Sin fecha',
            'Notas': p.notas_internas || ''
        }));

        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, appState.unidadActual);

        const filename = `Pedidos_${appState.unidadActual}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);

        showToast('Excel exportado correctamente', 'success');
    } catch (error) {
        console.error('Error al exportar Excel:', error);
        showToast('Error al exportar Excel', 'error');
    }
}

// === Exportación a PDF ===
function exportarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título
        doc.setFontSize(18);
        doc.setTextColor(255, 103, 0); // Naranja Brico
        doc.text('GRUPO BRICO', 105, 15, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Reporte de Pedidos - ${appState.unidadActual}`, 105, 25, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 105, 32, { align: 'center' });

        // Tabla
        const datos = appState.pedidos.map(p => [
            p.cliente_nombre,
            p.cliente_dni,
            p.promo_seleccionada,
            `$${p.monto.toLocaleString('es-AR')}`,
            p.estado_pago,
            p.estado_pedido,
            p.fecha_entrega || 'Sin fecha'
        ]);

        doc.autoTable({
            startY: 40,
            head: [['Cliente', 'DNI', 'Promo', 'Monto', 'Pago', 'Estado', 'Entrega']],
            body: datos,
            theme: 'striped',
            headStyles: {
                fillColor: [255, 103, 0], // Naranja Brico
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                3: { halign: 'right' }
            }
        });

        // Estadísticas al final
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setTextColor(255, 103, 0);
        doc.text('Resumen:', 14, finalY);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Pedidos: ${appState.pedidos.length}`, 14, finalY + 7);

        const totalMonto = appState.pedidos.reduce((sum, p) => sum + p.monto, 0);
        doc.text(`Monto Total: $${totalMonto.toLocaleString('es-AR')}`, 14, finalY + 14);

        const filename = `Pedidos_${appState.unidadActual}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        showToast('PDF exportado correctamente', 'success');
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        showToast('Error al exportar PDF', 'error');
    }
}

// === Toast Notifications ===
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

console.log('🚀 Dashboard Brico V2 inicializado correctamente');
