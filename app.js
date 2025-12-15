// ============================================
// GRUPO BRICO - Dashboard Administrativo
// Lógica Principal de la Aplicación
// ============================================

// === Inicialización de Supabase ===
const { createClient } = supabase;
let supabaseClient;

try {
    supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('✅ Supabase inicializado correctamente');
} catch (error) {
    console.error('❌ Error al inicializar Supabase:', error);
    showToast('Error de configuración. Verifica tus credenciales de Supabase.', 'error');
}

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
    elements.btnRefresh.addEventListener('click', cargarPedidos);
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

// === Funciones de Datos ===
async function cargarPedidos() {
    try {
        mostrarCargando();

        const { data, error } = await supabaseClient
            .from('pedidos')
            .select('*')
            .eq('unidad_negocio', appState.unidadActual)
            .order('created_at', { ascending: false });

        if (error) throw error;

        appState.pedidos = data || [];
        renderizarPedidos();
        actualizarEstadisticas();

        console.log(`✅ Cargados ${data.length} pedidos para ${appState.unidadActual}`);
    } catch (error) {
        console.error('❌ Error al cargar pedidos:', error);
        showToast('Error al cargar los pedidos. Verifica tu conexión.', 'error');
        ocultarCargando();
    }
}

async function actualizarEstadoPago(pedidoId, nuevoEstado) {
    try {
        const { error } = await supabaseClient
            .from('pedidos')
            .update({ estado_pago: nuevoEstado })
            .eq('id', pedidoId);

        if (error) throw error;

        // Actualizar en el estado local
        const pedido = appState.pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            pedido.estado_pago = nuevoEstado;
            renderizarPedidos();
        }

        showToast(`Estado de pago actualizado a: ${nuevoEstado}`, 'success');
    } catch (error) {
        console.error('❌ Error al actualizar estado de pago:', error);
        showToast('Error al actualizar el estado de pago', 'error');
    }
}

async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
    try {
        const { error } = await supabaseClient
            .from('pedidos')
            .update({ estado_pedido: nuevoEstado })
            .eq('id', pedidoId);

        if (error) throw error;

        // Actualizar en el estado local
        const pedido = appState.pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            pedido.estado_pedido = nuevoEstado;
            renderizarPedidos();
        }

        showToast(`Pedido marcado como: ${nuevoEstado}`, 'success');
    } catch (error) {
        console.error('❌ Error al actualizar estado de pedido:', error);
        showToast('Error al actualizar el estado del pedido', 'error');
    }
}

async function marcarPedidoListo(pedidoId) {
    await actualizarEstadoPedido(pedidoId, 'armado');
}

async function guardarPedido(e) {
    e.preventDefault();

    const pedidoData = {
        cliente_nombre: elements.inputNombre.value.trim(),
        cliente_dni: elements.inputDni.value.trim(),
        unidad_negocio: elements.inputUnidad.value,
        promo_seleccionada: elements.inputPromo.value.trim(),
        monto: parseFloat(elements.inputMonto.value),
        comprobante_url: elements.inputComprobante.value.trim() || null,
        notas_internas: elements.inputNotas.value.trim() || null
    };

    try {
        if (appState.editandoPedido) {
            // Actualizar pedido existente
            const { error } = await supabaseClient
                .from('pedidos')
                .update(pedidoData)
                .eq('id', appState.editandoPedido);

            if (error) throw error;

            showToast('Pedido actualizado correctamente', 'success');
        } else {
            // Crear nuevo pedido
            const { error } = await supabaseClient
                .from('pedidos')
                .insert([pedidoData]);

            if (error) throw error;

            showToast('Pedido creado correctamente', 'success');
        }

        cerrarModalPedido();
        cargarPedidos();
    } catch (error) {
        console.error('❌ Error al guardar pedido:', error);
        showToast('Error al guardar el pedido', 'error');
    }
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

// === Suscripción en Tiempo Real (Opcional) ===
// Descomentar para habilitar actualizaciones en tiempo real
/*
supabaseClient
    .channel('pedidos-changes')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pedidos' },
        (payload) => {
            console.log('🔄 Cambio detectado:', payload);
            cargarPedidos();
        }
    )
    .subscribe();
*/

console.log('🚀 Dashboard Brico inicializado correctamente');
