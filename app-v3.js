// ============================================
// GRUPO BRICO - Dashboard V3 Vista Tabla (Excel-like)
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
    pedidos: [],
    filtros: {
        estadoPago: '',
        estadoPedido: '',
        fecha: ''
    },
    editandoPedido: null
};

const elements = {
    tabs: document.querySelectorAll('.tab-modern'),
    btnRefresh: document.getElementById('btn-refresh'),
    btnNuevoPedido: document.getElementById('btn-nuevo-pedido'),
    btnNuevoPedidoEmpty: document.getElementById('btn-nuevo-pedido-empty'),
    btnExportExcel: document.getElementById('btn-export-excel'),
    btnExportPdf: document.getElementById('btn-export-pdf'),
    filterEstadoPago: document.getElementById('filter-estado-pago'),
    filterEstadoPedido: document.getElementById('filter-estado-pedido'),
    filterFecha: document.getElementById('filter-fecha'),
    tableContainer: document.getElementById('table-container'),
    pedidosTbody: document.getElementById('pedidos-tbody'),
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
    inputTelefono: document.getElementById('input-telefono'),
    inputUnidad: document.getElementById('input-unidad'),
    inputPromo: document.getElementById('input-promo'),
    inputMonto: document.getElementById('input-monto'),
    inputFechaEntrega: document.getElementById('input-fecha-entrega'),
    inputComprobante: document.getElementById('input-comprobante'),
    inputNotas: document.getElementById('input-notas'),
    btnCancelar: document.getElementById('btn-cancelar'),
    toastContainer: document.getElementById('toast-container')
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard Brico V3 (Tabla) inicializado');
    initEventListeners();
    cargarPedidos();
});

function initEventListeners() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => cambiarUnidad(tab.dataset.unidad));
    });

    elements.btnRefresh.addEventListener('click', () => {
        showToast('Pedidos actualizados', 'success');
        cargarPedidos();
    });

    elements.btnNuevoPedido.addEventListener('click', abrirModalNuevoPedido);
    if (elements.btnNuevoPedidoEmpty) {
        elements.btnNuevoPedidoEmpty.addEventListener('click', abrirModalNuevoPedido);
    }
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

async function cargarPedidos() {
    mostrarCargando();

    try {
        const { data, error } = await supabaseClient
            .from('pedidos')
            .select('*')
            .eq('unidad_negocio', appState.unidadActual)
            .order('created_at', { ascending: false });

        if (error) throw error;

        appState.pedidos = data || [];
        renderizarPedidos();
        console.log(`✅ Cargados ${appState.pedidos.length} pedidos para ${appState.unidadActual}`);
    } catch (error) {
        console.error('❌ Error al cargar pedidos:', error);
        showToast('Error al cargar pedidos', 'error');
        appState.pedidos = [];
        renderizarPedidos();
    }
}

async function actualizarEstadoPago(pedidoId, nuevoEstado) {
    try {
        const { error } = await supabaseClient
            .from('pedidos')
            .update({ estado_pago: nuevoEstado })
            .eq('id', pedidoId);

        if (error) throw error;

        const pedidoLocal = appState.pedidos.find(p => p.id === pedidoId);
        if (pedidoLocal) {
            pedidoLocal.estado_pago = nuevoEstado;
            renderizarPedidos();
        }
        showToast(`Estado de pago actualizado a: ${nuevoEstado}`, 'success');
    } catch (error) {
        console.error('❌ Error al actualizar estado de pago:', error);
        showToast('Error al actualizar estado de pago', 'error');
    }
}

async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
    try {
        const { error } = await supabaseClient
            .from('pedidos')
            .update({ estado_pedido: nuevoEstado })
            .eq('id', pedidoId);

        if (error) throw error;

        const pedidoLocal = appState.pedidos.find(p => p.id === pedidoId);
        if (pedidoLocal) {
            pedidoLocal.estado_pedido = nuevoEstado;
            renderizarPedidos();
        }
        showToast(`Pedido marcado como: ${nuevoEstado}`, 'success');
    } catch (error) {
        console.error('❌ Error al actualizar estado del pedido:', error);
        showToast('Error al actualizar estado del pedido', 'error');
    }
}

async function eliminarPedido(pedidoId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('pedidos')
            .delete()
            .eq('id', pedidoId);

        if (error) throw error;

        showToast('Pedido eliminado correctamente', 'success');
        cargarPedidos();
    } catch (error) {
        console.error('❌ Error al eliminar pedido:', error);
        showToast('Error al eliminar el pedido', 'error');
    }
}

function marcarPedidoListo(pedidoId) {
    actualizarEstadoPedido(pedidoId, 'armado');
}

async function guardarPedido(e) {
    e.preventDefault();

    const monto = parseFloat(elements.inputMonto.value);

    // Si el monto es mayor a 0, automáticamente se marca como pagado
    const estadoPago = monto > 0 ? 'pagado' : 'pendiente';

    const pedidoData = {
        cliente_nombre: elements.inputNombre.value.trim(),
        cliente_dni: elements.inputDni.value.trim(),
        cliente_telefono: elements.inputTelefono.value.trim(),
        unidad_negocio: elements.inputUnidad.value,
        promo_seleccionada: elements.inputPromo.value.trim(),
        monto: monto,
        comprobante_url: elements.inputComprobante.value.trim() || null,
        estado_pago: estadoPago,
        estado_pedido: 'nuevo',
        fecha_entrega: elements.inputFechaEntrega.value || null,
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
        showToast('Error al guardar pedido', 'error');
    }
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
        elements.tableContainer.style.display = 'none';
        elements.emptyState.style.display = 'block';
        return;
    }

    elements.tableContainer.style.display = 'block';
    elements.emptyState.style.display = 'none';

    elements.pedidosTbody.innerHTML = pedidosFiltrados.map(pedido => crearFilaPedido(pedido)).join('');
    agregarEventListenersTabla();
}

function formatearTurno(pedido) {
    if (!pedido.turno_fecha || !pedido.turno_hora) {
        return `
            <div class="turno-info">
                <span class="turno-badge turno-sin-confirmar">SIN TURNO</span>
            </div>
        `;
    }

    const fechaTurno = new Date(pedido.turno_fecha + 'T' + pedido.turno_hora);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaTurnoSolo = new Date(pedido.turno_fecha);
    fechaTurnoSolo.setHours(0, 0, 0, 0);

    const esTurnoHoy = fechaTurnoSolo.getTime() === hoy.getTime();
    const esTurnoManana = fechaTurnoSolo.getTime() === (hoy.getTime() + 86400000);

    const fechaFormateada = fechaTurno.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit'
    });

    const horaFormateada = fechaTurno.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    let badgeExtra = '';
    if (esTurnoHoy) {
        badgeExtra = '<span class="turno-badge turno-hoy">HOY</span>';
    } else if (esTurnoManana) {
        badgeExtra = '<span class="turno-badge turno-manana">MAÑANA</span>';
    }

    return `
        <div class="turno-info">
            <div class="turno-fecha">📅 ${fechaFormateada}</div>
            <div class="turno-hora">🕐 ${horaFormateada}</div>
            ${badgeExtra}
        </div>
    `;
}

function crearFilaPedido(pedido) {
    const fechaCreacion = new Date(pedido.created_at).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    const montoFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(pedido.monto);

    const today = getToday();
    const esPedidoHoy = pedido.created_at.startsWith(today);
    const esEntregaHoy = pedido.fecha_entrega === today;

    // URL de WhatsApp - El número ya viene con 549 incluido
    const whatsappUrl = `https://wa.me/${pedido.cliente_telefono}?text=${encodeURIComponent(`Hola ${pedido.cliente_nombre}, te contactamos desde Grupo Brico por tu pedido de "${pedido.promo_seleccionada}". ¿En qué podemos ayudarte?`)}`;

    return `
        <tr data-id="${pedido.id}">
            <td class="col-fecha">
                ${fechaCreacion}
                ${esPedidoHoy ? '<span class="table-badge-hoy">HOY</span>' : ''}
                ${esEntregaHoy && !esPedidoHoy ? '<span class="table-badge-hoy table-badge-entrega-hoy">ENTREGA</span>' : ''}
            </td>
            <td class="col-cliente">
                <div class="col-cliente-nombre">${pedido.cliente_nombre}</div>
                <div class="col-cliente-dni">DNI: ${pedido.cliente_dni}</div>
            </td>
            <td class="col-telefono">
                <a href="${whatsappUrl}" target="_blank" class="btn-whatsapp-table" title="Enviar WhatsApp">
                    💬 ${pedido.cliente_telefono}
                </a>
            </td>
            <td class="col-promo">
                <div class="col-promo-text" title="${pedido.promo_seleccionada}">${pedido.promo_seleccionada}</div>
            </td>
            <td class="col-turno">
                ${formatearTurno(pedido)}
            </td>
            <td class="col-monto">${montoFormateado}</td>
            <td class="col-pago">
                <span class="table-badge table-badge-${pedido.estado_pago}">
                    ${pedido.estado_pago === 'pendiente' ? '⏳' : pedido.estado_pago === 'pagado' ? '✅' : '❌'}
                    ${pedido.estado_pago.toUpperCase()}
                </span>
                <select class="table-select ${pedido.estado_pago}" data-id="${pedido.id}" data-tipo="pago">
                    <option value="pendiente" ${pedido.estado_pago === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="pagado" ${pedido.estado_pago === 'pagado' ? 'selected' : ''}>Pagado</option>
                    <option value="rechazado" ${pedido.estado_pago === 'rechazado' ? 'selected' : ''}>Rechazado</option>
                </select>
            </td>
            <td class="col-estado">
                <select class="table-select" data-id="${pedido.id}" data-tipo="pedido">
                    <option value="nuevo" ${pedido.estado_pedido === 'nuevo' ? 'selected' : ''}>Nuevo</option>
                    <option value="armado" ${pedido.estado_pedido === 'armado' ? 'selected' : ''}>Armado</option>
                    <option value="entregado" ${pedido.estado_pedido === 'entregado' ? 'selected' : ''}>Entregado</option>
                    <option value="no_vino" ${pedido.estado_pedido === 'no_vino' ? 'selected' : ''}>No vino</option>
                </select>
            </td>
            <td class="col-acciones">
                <div class="table-actions">
                    ${pedido.analisis_historial ? `
                        <button class="btn-table-action btn-ver-analisis" data-pedido-id="${pedido.id}">
                            🔍 Ver
                        </button>
                    ` : ''}
                    ${pedido.comprobante_url ? `
                        <button class="btn-table-action btn-ver-comprobante" data-url="${pedido.comprobante_url}">
                            📄 Ver
                        </button>
                    ` : ''}
                    <button class="btn-table-action btn-table-listo btn-pedido-listo" data-id="${pedido.id}" 
                        ${pedido.estado_pedido === 'armado' ? 'disabled' : ''}>
                        ✅ Listo
                    </button>
                    <button class="btn-table-action btn-eliminar-pedido" data-id="${pedido.id}" title="Eliminar pedido" style="color: #dc3545; border-color: #dc3545;">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function agregarEventListenersTabla() {
    document.querySelectorAll('.table-select').forEach(select => {
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

    document.querySelectorAll('.btn-ver-analisis').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pedidoId = e.currentTarget.dataset.pedidoId;
            abrirModalAnalisis(pedidoId);
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

    document.querySelectorAll('.btn-eliminar-pedido').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pedidoId = e.currentTarget.dataset.id;
            eliminarPedido(pedidoId);
        });
    });
}

function mostrarCargando() {
    elements.pedidosTbody.innerHTML = `
        <tr>
            <td colspan="9" style="text-align: center; padding: 2rem;">
                <div class="spinner"></div>
                <p>Cargando pedidos...</p>
            </td>
        </tr>
    `;
    elements.emptyState.style.display = 'none';
}

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

function abrirModalAnalisis(pedidoId) {
    const pedido = appState.pedidos.find(p => p.id === pedidoId);
    if (!pedido || !pedido.analisis_historial) {
        showToast('No hay análisis disponible para este pedido', 'warning');
        return;
    }

    const analisis = pedido.analisis_historial;

    // Crear modal dinámicamente
    const modalHTML = `
        <div class="modal active" id="modal-analisis">
            <div class="modal-overlay"></div>
            <div class="modal-content modal-analisis-content">
                <button class="modal-close" id="close-analisis">✕</button>
                <h2 class="modal-title">📊 Análisis de Conversación</h2>
                <div class="modal-body">
                    <div class="analisis-header">
                        <div class="analisis-cliente">
                            <strong>${pedido.cliente_nombre}</strong>
                            <span class="analisis-meta">DNI: ${pedido.cliente_dni} | Tel: ${pedido.cliente_telefono}</span>
                        </div>
                        <div class="analisis-tono">
                            <span class="badge-tono">${analisis.tono_conversacion || 'N/A'}</span>
                        </div>
                    </div>

                    <div class="analisis-section">
                        <h3>💬 Resumen de la Conversación</h3>
                        <p class="analisis-resumen">${analisis.resumen || 'No disponible'}</p>
                    </div>

                    ${analisis.promociones_detalle && analisis.promociones_detalle.length > 0 ? `
                        <div class="analisis-section">
                            <h3>🛒 Promociones Solicitadas</h3>
                            <div class="promociones-lista">
                                ${analisis.promociones_detalle.map(promo => `
                                    <div class="promo-item">
                                        <div class="promo-nombre">
                                            <span class="promo-cantidad">${promo.cantidad}x</span>
                                            ${promo.nombre}
                                        </div>
                                        ${promo.observaciones ? `
                                            <div class="promo-obs">${promo.observaciones}</div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${analisis.intenciones_cliente && analisis.intenciones_cliente.length > 0 ? `
                        <div class="analisis-section">
                            <h3>🎯 Intenciones del Cliente</h3>
                            <ul class="analisis-lista">
                                ${analisis.intenciones_cliente.map(intencion => `
                                    <li>${intencion}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${analisis.puntos_clave && analisis.puntos_clave.length > 0 ? `
                        <div class="analisis-section">
                            <h3>⭐ Puntos Clave</h3>
                            <ul class="analisis-lista puntos-clave">
                                ${analisis.puntos_clave.map(punto => `
                                    <li>${punto}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${pedido.historial_conversacion ? `
                        <div class="analisis-section">
                            <h3>📝 Historial Completo</h3>
                            <div class="historial-conversacion">
                                ${pedido.historial_conversacion.split('\n').map(linea => {
        if (linea.startsWith('Cliente:')) {
            return `<div class="mensaje-cliente">${linea}</div>`;
        } else if (linea.startsWith('Agente:')) {
            return `<div class="mensaje-agente">${linea}</div>`;
        } else {
            return `<div class="mensaje-sistema">${linea}</div>`;
        }
    }).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Agregar event listeners
    const modal = document.getElementById('modal-analisis');
    const closeBtn = document.getElementById('close-analisis');
    const overlay = modal.querySelector('.modal-overlay');

    const cerrarModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', cerrarModal);
    overlay.addEventListener('click', cerrarModal);
}


function exportarExcel() {
    try {
        const datos = appState.pedidos.map(p => ({
            'ID': p.id,
            'Fecha Pedido': new Date(p.created_at).toLocaleString('es-AR'),
            'Cliente': p.cliente_nombre,
            'DNI': p.cliente_dni,
            'Teléfono': p.cliente_telefono,
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

function exportarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(255, 103, 0);
        doc.text('GRUPO BRICO', 105, 15, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Reporte de Pedidos - ${appState.unidadActual}`, 105, 25, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 105, 32, { align: 'center' });

        const datos = appState.pedidos.map(p => [
            p.cliente_nombre,
            p.cliente_dni,
            p.cliente_telefono,
            p.promo_seleccionada,
            `$${p.monto.toLocaleString('es-AR')}`,
            p.estado_pago,
            p.estado_pedido
        ]);

        doc.autoTable({
            startY: 40,
            head: [['Cliente', 'DNI', 'Teléfono', 'Promo', 'Monto', 'Pago', 'Estado']],
            body: datos,
            theme: 'striped',
            headStyles: {
                fillColor: [255, 103, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            columnStyles: {
                4: { halign: 'right' }
            }
        });

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

console.log('🚀 Dashboard Brico V3 (Vista Tabla) inicializado correctamente');
