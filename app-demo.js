// ============================================
// GRUPO BRICO - Dashboard Administrativo
// VERSIÓN DEMO CON DATOS MOCK
// ============================================

// === Datos Mock ===
const PEDIDOS_MOCK = [
    {
        id: '1',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Hace 30 min
        cliente_nombre: 'Juan Pérez',
        cliente_dni: '12345678',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 1 - Almacén Completo',
        monto: 15000.00,
        comprobante_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        notas_internas: 'Cliente habitual, prioridad alta'
    },
    {
        id: '2',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // Hace 1 hora
        cliente_nombre: 'María González',
        cliente_dni: '87654321',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 2 - Bebidas y Snacks',
        monto: 8500.50,
        comprobante_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'armado',
        notas_internas: null
    },
    {
        id: '3',
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // Hace 1.5 horas
        cliente_nombre: 'Carlos Rodríguez',
        cliente_dni: '11223344',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 4 - Carnes Premium',
        monto: 25000.00,
        comprobante_url: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'nuevo',
        notas_internas: 'Solicita entrega antes de las 18hs'
    },
    {
        id: '4',
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // Hace 2 horas
        cliente_nombre: 'Ana Martínez',
        cliente_dni: '44332211',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 3 - Limpieza y Hogar',
        monto: 6200.00,
        comprobante_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'entregado',
        notas_internas: null
    },
    {
        id: '5',
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // Hace 3 horas
        cliente_nombre: 'Luis Fernández',
        cliente_dni: '55667788',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 5 - Verduras y Frutas',
        monto: 12000.00,
        comprobante_url: null,
        estado_pago: 'rechazado',
        estado_pedido: 'no_vino',
        notas_internas: 'Comprobante inválido'
    },
    {
        id: '6',
        created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // Hace 4 horas
        cliente_nombre: 'Patricia Silva',
        cliente_dni: '99887766',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 6 - Desayuno Completo',
        monto: 4500.00,
        comprobante_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'armado',
        notas_internas: 'Retira en local'
    },
    {
        id: '7',
        created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // Hace 5 horas
        cliente_nombre: 'Roberto Gómez',
        cliente_dni: '22334455',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 7 - Panadería y Fiambrería',
        monto: 18500.00,
        comprobante_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        notas_internas: null
    },
    {
        id: '8',
        created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // Hace 6 horas
        cliente_nombre: 'Sofía Ramírez',
        cliente_dni: '66778899',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 8 - Congelados',
        monto: 7800.00,
        comprobante_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'nuevo',
        notas_internas: 'Incluir bolsas térmicas'
    },
    {
        id: '9',
        created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(), // Hace 7 horas
        cliente_nombre: 'Diego Torres',
        cliente_dni: '33445566',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 9 - Bebidas Alcohólicas',
        monto: 32000.00,
        comprobante_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'armado',
        notas_internas: 'Verificar DNI al entregar'
    },
    {
        id: '10',
        created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(), // Hace 8 horas
        cliente_nombre: 'Valentina López',
        cliente_dni: '77889900',
        unidad_negocio: 'Express',
        promo_seleccionada: 'Promo 10 - Mascotas',
        monto: 5600.00,
        comprobante_url: null,
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        notas_internas: 'Esperando confirmación de pago'
    }
];

// === Estado de la Aplicación ===
const appState = {
    unidadActual: 'Mayorista',
    pedidos: [],
    filtros: {
        estadoPago: '',
        estadoPedido: ''
    },
    editandoPedido: null
};

// === Elementos del DOM ===
const elements = {
    // Tabs
    tabs: document.querySelectorAll('.tab'),

    // Estadísticas
    statTotal: document.getElementById('stat-total'),
    statMonto: document.getElementById('stat-monto'),

    // Controles
    btnRefresh: document.getElementById('btn-refresh'),
    btnNuevoPedido: document.getElementById('btn-nuevo-pedido'),
    btnNuevoPedidoEmpty: document.getElementById('btn-nuevo-pedido-empty'),
    filterEstadoPago: document.getElementById('filter-estado-pago'),
    filterEstadoPedido: document.getElementById('filter-estado-pedido'),

    // Grid
    pedidosGrid: document.getElementById('pedidos-grid'),
    emptyState: document.getElementById('empty-state'),

    // Modales
    modalComprobante: document.getElementById('modal-comprobante'),
    modalPedido: document.getElementById('modal-pedido'),
    comprobanteImage: document.getElementById('comprobante-image'),
    closeComprobante: document.getElementById('close-comprobante'),
    closePedido: document.getElementById('close-pedido'),
    modalPedidoTitle: document.getElementById('modal-pedido-title'),

    // Formulario
    formPedido: document.getElementById('form-pedido'),
    inputNombre: document.getElementById('input-nombre'),
    inputDni: document.getElementById('input-dni'),
    inputUnidad: document.getElementById('input-unidad'),
    inputPromo: document.getElementById('input-promo'),
    inputMonto: document.getElementById('input-monto'),
    inputComprobante: document.getElementById('input-comprobante'),
    inputNotas: document.getElementById('input-notas'),
    btnCancelar: document.getElementById('btn-cancelar'),

    // Toast
    toastContainer: document.getElementById('toast-container')
};

// === Inicialización ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard Brico DEMO inicializado');
    showToast('Modo DEMO activado - Usando datos de ejemplo', 'info');
    initEventListeners();
    cargarPedidos();
});

// === Event Listeners ===
function initEventListeners() {
    // Tabs
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => cambiarUnidad(tab.dataset.unidad));
    });

    // Controles
    elements.btnRefresh.addEventListener('click', () => {
        showToast('Pedidos actualizados', 'success');
        cargarPedidos();
    });
    elements.btnNuevoPedido.addEventListener('click', abrirModalNuevoPedido);
    elements.btnNuevoPedidoEmpty.addEventListener('click', abrirModalNuevoPedido);

    // Filtros
    elements.filterEstadoPago.addEventListener('change', (e) => {
        appState.filtros.estadoPago = e.target.value;
        renderizarPedidos();
    });

    elements.filterEstadoPedido.addEventListener('change', (e) => {
        appState.filtros.estadoPedido = e.target.value;
        renderizarPedidos();
    });

    // Modales
    elements.closeComprobante.addEventListener('click', cerrarModalComprobante);
    elements.closePedido.addEventListener('click', cerrarModalPedido);
    elements.btnCancelar.addEventListener('click', cerrarModalPedido);

    // Cerrar modal al hacer click en overlay
    elements.modalComprobante.querySelector('.modal-overlay').addEventListener('click', cerrarModalComprobante);
    elements.modalPedido.querySelector('.modal-overlay').addEventListener('click', cerrarModalPedido);

    // Formulario
    elements.formPedido.addEventListener('submit', guardarPedido);
}

// === Funciones de Datos (MOCK) ===
function cargarPedidos() {
    mostrarCargando();

    // Simular delay de red
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

        // Actualizar en el estado local
        const pedidoLocal = appState.pedidos.find(p => p.id === pedidoId);
        if (pedidoLocal) {
            pedidoLocal.estado_pago = nuevoEstado;
            renderizarPedidos();
        }

        showToast(`Estado de pago actualizado a: ${nuevoEstado}`, 'success');
    }
}

function actualizarEstadoPedido(pedidoId, nuevoEstado) {
    const pedido = PEDIDOS_MOCK.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.estado_pedido = nuevoEstado;

        // Actualizar en el estado local
        const pedidoLocal = appState.pedidos.find(p => p.id === pedidoId);
        if (pedidoLocal) {
            pedidoLocal.estado_pedido = nuevoEstado;
            renderizarPedidos();
        }

        showToast(`Pedido marcado como: ${nuevoEstado}`, 'success');
    }
}

function marcarPedidoListo(pedidoId) {
    actualizarEstadoPedido(pedidoId, 'armado');
}

function guardarPedido(e) {
    e.preventDefault();

    const monto = parseFloat(elements.inputMonto.value);

    // Si el monto es mayor a 0, automáticamente se marca como pagado
    const estadoPago = monto > 0 ? 'pagado' : 'pendiente';

    const pedidoData = {
        id: appState.editandoPedido || String(PEDIDOS_MOCK.length + 1),
        created_at: new Date().toISOString(),
        cliente_nombre: elements.inputNombre.value.trim(),
        cliente_dni: elements.inputDni.value.trim(),
        unidad_negocio: elements.inputUnidad.value,
        promo_seleccionada: elements.inputPromo.value.trim(),
        monto: monto,
        comprobante_url: elements.inputComprobante.value.trim() || null,
        estado_pago: estadoPago,
        estado_pedido: 'nuevo',
        notas_internas: elements.inputNotas.value.trim() || null
    };

    if (appState.editandoPedido) {
        // Actualizar pedido existente
        const index = PEDIDOS_MOCK.findIndex(p => p.id === appState.editandoPedido);
        if (index !== -1) {
            PEDIDOS_MOCK[index] = { ...PEDIDOS_MOCK[index], ...pedidoData };
        }
        showToast('Pedido actualizado correctamente', 'success');
    } else {
        // Crear nuevo pedido
        PEDIDOS_MOCK.unshift(pedidoData);
        showToast('Pedido creado correctamente', 'success');
    }

    cerrarModalPedido();
    cargarPedidos();
}

// === Funciones de UI ===
function cambiarUnidad(unidad) {
    appState.unidadActual = unidad;

    // Actualizar tabs activos
    elements.tabs.forEach(tab => {
        if (tab.dataset.unidad === unidad) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Recargar pedidos
    cargarPedidos();
}

function renderizarPedidos() {
    // Filtrar pedidos
    let pedidosFiltrados = [...appState.pedidos];

    if (appState.filtros.estadoPago) {
        pedidosFiltrados = pedidosFiltrados.filter(p => p.estado_pago === appState.filtros.estadoPago);
    }

    if (appState.filtros.estadoPedido) {
        pedidosFiltrados = pedidosFiltrados.filter(p => p.estado_pedido === appState.filtros.estadoPedido);
    }

    // Mostrar estado vacío si no hay pedidos
    if (pedidosFiltrados.length === 0) {
        elements.pedidosGrid.style.display = 'none';
        elements.emptyState.style.display = 'block';
        return;
    }

    elements.pedidosGrid.style.display = 'grid';
    elements.emptyState.style.display = 'none';

    // Renderizar tarjetas
    elements.pedidosGrid.innerHTML = pedidosFiltrados.map(pedido => crearTarjetaPedido(pedido)).join('');

    // Agregar event listeners a las tarjetas
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

    const clasePagado = pedido.estado_pago === 'pagado' ? 'pagado' : '';
    const badgeUnidad = pedido.unidad_negocio === 'Mayorista' ? 'badge-mayorista' : 'badge-express';

    return `
        <div class="pedido-card ${clasePagado}" data-id="${pedido.id}">
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
                    <span class="card-label">Fecha:</span>
                    <span class="card-value">${fechaCreacion}</span>
                </div>
                
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
    // Selectores de estado
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

    // Botones de ver comprobante
    document.querySelectorAll('.btn-ver-comprobante').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = e.currentTarget.dataset.url;
            abrirModalComprobante(url);
        });
    });

    // Botones de pedido listo
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

    elements.statTotal.textContent = total;
    elements.statMonto.textContent = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(montoTotal);
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

function ocultarCargando() {
    const loadingState = elements.pedidosGrid.querySelector('.loading-state');
    if (loadingState) {
        loadingState.remove();
    }
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
    elements.modalPedido.classList.add('active');
}

function cerrarModalPedido() {
    elements.modalPedido.classList.remove('active');
    elements.formPedido.reset();
    appState.editandoPedido = null;
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

    // Auto-remover después de 4 segundos
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 250ms ease reverse';
        setTimeout(() => toast.remove(), 250);
    }, 4000);
}
