// ============================================
// GRUPO BRICO - Dashboard V3 Vista Tabla (Excel-like)
// ============================================

function getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// === Datos Mock con Teléfonos ===
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
        cliente_telefono: '1198765432',
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
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        cliente_nombre: 'Carlos Rodríguez',
        cliente_dni: '11223344',
        cliente_telefono: '1155443322',
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
        cliente_telefono: '1144556677',
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
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        cliente_nombre: 'Luis Fernández',
        cliente_dni: '55667788',
        cliente_telefono: '1177889900',
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
        cliente_telefono: '1166778899',
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
        cliente_telefono: '1133224455',
        unidad_negocio: 'Mayorista',
        promo_seleccionada: 'Promo 7 - Panadería y Fiambrería',
        monto: 18500.00,
        comprobante_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
        estado_pago: 'pendiente',
        estado_pedido: 'nuevo',
        fecha_entrega: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
        notas_internas: null
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
        comprobante_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        estado_pago: 'pagado',
        estado_pedido: 'armado',
        fecha_entrega: getToday(),
        notas_internas: 'Incluir bolsas térmicas'
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
        cliente_telefono: '1122334455',
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
    tabs: document.querySelectorAll('.tab'),
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

function cargarPedidos() {
    mostrarCargando();

    setTimeout(() => {
        appState.pedidos = PEDIDOS_MOCK.filter(p => p.unidad_negocio === appState.unidadActual);
        renderizarPedidos();
        console.log(`✅ Cargados ${appState.pedidos.length} pedidos para ${appState.unidadActual}`);
    }, 300);
}

function actualizarEstadoPago(pedidoId, nuevoEstado) {
    const pedido = PEDIDOS_MOCK.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.estado_pago = nuevoEstado;
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

    const pedidoData = {
        id: appState.editandoPedido || String(PEDIDOS_MOCK.length + 1),
        created_at: new Date().toISOString(),
        cliente_nombre: elements.inputNombre.value.trim(),
        cliente_dni: elements.inputDni.value.trim(),
        cliente_telefono: elements.inputTelefono.value.trim(),
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

    // URL de WhatsApp
    const whatsappUrl = `https://wa.me/549${pedido.cliente_telefono}?text=Hola%20${encodeURIComponent(pedido.cliente_nombre)},%20te%20contactamos%20desde%20Grupo%20Brico%20por%20tu%20pedido.`;

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
                    ${pedido.comprobante_url ? `
                        <button class="btn-table-action btn-ver-comprobante" data-url="${pedido.comprobante_url}">
                            📄 Ver
                        </button>
                    ` : ''}
                    <button class="btn-table-action btn-table-listo btn-pedido-listo" data-id="${pedido.id}" 
                        ${pedido.estado_pedido === 'armado' ? 'disabled' : ''}>
                        ✅ Listo
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

function mostrarCargando() {
    elements.pedidosTbody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 2rem;">
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
