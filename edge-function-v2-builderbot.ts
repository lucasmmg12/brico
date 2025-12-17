// ============================================
// EDGE FUNCTION: Crear Pedido con OpenAI - V2
// Compatible con formato BuilderBot (role/content)
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Usar solo variables de entorno (configurar en Supabase Dashboard)
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
const BUILDERBOT_API_URL = Deno.env.get('BUILDERBOT_API_URL') || '';
const BUILDERBOT_API_KEY = Deno.env.get('BUILDERBOT_API_KEY') || '';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        );

        const body = await req.json();
        console.log('📥 Webhook recibido:', JSON.stringify(body, null, 2));

        // Validar que venga el historial de chat y el teléfono
        if (!body.historial || !body.cliente_telefono) {
            return new Response(
                JSON.stringify({
                    error: 'Faltan datos requeridos: historial y cliente_telefono'
                }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Construir el historial para OpenAI (compatible con ambos formatos)
        let historialTexto = '';

        if (Array.isArray(body.historial)) {
            // Formato BuilderBot: {role: "user/assistant", content: "..."}
            historialTexto = body.historial
                .filter(msg => msg.content && !msg.content.startsWith('_event_')) // Filtrar eventos de media
                .map(msg => {
                    const emisor = msg.role === 'user' ? 'Cliente' : 'Agente';
                    return `${emisor}: ${msg.content}`;
                })
                .join('\n');
        } else if (typeof body.historial === 'string') {
            // Formato texto plano
            historialTexto = body.historial;
        }

        console.log('📝 Historial de chat procesado:', historialTexto);

        // Llamar a OpenAI para extraer datos
        const datosExtraidos = await extraerDatosConOpenAI(historialTexto, body.cliente_telefono);

        console.log('🤖 Datos extraídos por OpenAI:', JSON.stringify(datosExtraidos, null, 2));

        // Validar datos extraídos
        if (!datosExtraidos.cliente_nombre || !datosExtraidos.promo_seleccionada) {
            return new Response(
                JSON.stringify({
                    error: 'No se pudieron extraer todos los datos necesarios del chat',
                    datosExtraidos,
                    historialProcesado: historialTexto
                }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Determinar estado de pago automáticamente basado en el monto
        const monto = datosExtraidos.monto || 0;
        const estadoPago = monto > 0 ? 'pagado' : 'pendiente';

        // Crear pedido en Supabase (usar teléfono del webhook, no de OpenAI)
        const { data: pedido, error: errorPedido } = await supabaseClient
            .from('pedidos')
            .insert([{
                cliente_nombre: datosExtraidos.cliente_nombre,
                cliente_telefono: body.cliente_telefono, // Usar del webhook, no de OpenAI
                cliente_dni: datosExtraidos.cliente_dni || '00000000',
                unidad_negocio: datosExtraidos.unidad_negocio || 'Mayorista',
                promo_seleccionada: datosExtraidos.promo_seleccionada,
                monto: monto,
                estado_pago: estadoPago,
                estado_pedido: 'nuevo',
                notas_internas: 'Pedido creado automáticamente desde WhatsApp con OpenAI'
            }])
            .select();

        if (errorPedido) {
            console.error('❌ Error al crear pedido:', errorPedido);
            throw errorPedido;
        }

        console.log('✅ Pedido creado:', pedido[0]);

        // Generar link de selección de turno con pedido_id
        const pedidoId = pedido[0].id;
        const linkTurno = `https://brico-dashboard.vercel.app/seleccionar-turno.html?pedido_id=${pedidoId}&unidad=${datosExtraidos.unidad_negocio || 'Mayorista'}`;

        // Preparar mensaje para el cliente
        const mensaje = `✅ *Pedido Confirmado - Grupo Brico*\n\n` +
            `Hola ${datosExtraidos.cliente_nombre}! 👋\n\n` +
            `Tu pedido de *${datosExtraidos.promo_seleccionada}* ha sido confirmado.\n` +
            `💰 Monto: $${datosExtraidos.monto?.toLocaleString('es-AR') || '0'}\n\n` +
            `📅 *Ahora elegí tu turno de retiro:*\n` +
            `👉 ${linkTurno}\n\n` +
            `⏰ Turnos disponibles desde mañana\n` +
            `🆔 Recordá traer tu DNI`;

        // Enviar mensaje directamente al cliente vía BuilderBot
        try {
            await enviarMensajeBuilderBot(body.cliente_telefono, mensaje);
            console.log('✅ Mensaje enviado al cliente');
        } catch (errorMensaje) {
            console.error('⚠️ No se pudo enviar el mensaje, pero el pedido fue creado:', errorMensaje);
            // No lanzamos error para que el pedido se guarde igual
        }

        // Devolver respuesta exitosa
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Pedido creado y mensaje enviado',
                pedido: pedido[0],
                datosExtraidos,
                linkTurno,
                mensajeEnviado: true
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('❌ Error general:', error);
        return new Response(
            JSON.stringify({
                error: error.message,
                details: error.toString()
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});

async function enviarMensajeBuilderBot(telefono: string, mensaje: string) {
    try {
        console.log('📤 Enviando mensaje a:', telefono);

        const response = await fetch(BUILDERBOT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-builderbot': BUILDERBOT_API_KEY
            },
            body: JSON.stringify({
                messages: {
                    content: mensaje
                },
                number: telefono,
                checkIfExists: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error al enviar mensaje BuilderBot:', errorText);
            throw new Error(`Error BuilderBot: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Mensaje enviado correctamente:', data);
        return data;
    } catch (error) {
        console.error('❌ Error al enviar mensaje:', error);
        throw error;
    }
}

async function extraerDatosConOpenAI(historial: string, telefonoCliente: string) {
    const prompt = `Actúa como un motor de extracción de datos JSON. Tu única tarea es analizar el historial de chat de WhatsApp proporcionado y extraer la información estructurada del cliente y su pedido.

Reglas de Extracción:
1. Analiza la conversación para identificar al CLIENTE (quien compra) y al AGENTE (quien vende). Extrae solo los datos del cliente.
2. Si un dato no se encuentra en el texto, devuelve null.
3. Formato de Salida: Devuelve SOLO un objeto JSON válido. No uses bloques de código markdown (\`\`\`json), no incluyas texto introductorio ni conclusiones. Solo el raw JSON.

Estructura del JSON y reglas por campo:
{
  "cliente_nombre": "nombre completo del cliente (busca donde dice 'mi nombre es...' o similar)",
  "cliente_dni": "documento del cliente obtenido en el chat (busca números de 7-8 dígitos que sean DNI)",
  "cliente_telefono": "${telefonoCliente}",
  "unidad_negocio": "String (Por defecto 'Mayorista', a menos que el contexto indique otra cosa)",
  "promo_seleccionada": "String (Nombre COMPLETO de la promo o producto final confirmado por el cliente, ejemplo: 'PROMO 4 XL (Salame Milán)')",
  "monto": Integer (El valor numérico final de la compra en pesos. Solo números, sin el símbolo '$' ni puntos ni comas. Ejemplo: 22640)
}

IMPORTANTE: 
- El nombre del cliente suele aparecer cuando dice "mi nombre es..." o similar
- El DNI es un número de 7-8 dígitos que el cliente proporciona
- La promo debe incluir el nombre completo (ejemplo: "PROMO 4 XL (Salame Milán)")
- El monto debe ser el precio final que el agente menciona

Historial de conversación a analizar:
${historial}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Eres un asistente que extrae datos estructurados de conversaciones. Respondes SOLO con JSON válido, sin markdown ni texto adicional.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 500
        })
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('❌ Error de OpenAI:', error);
        throw new Error(`Error de OpenAI: ${error}`);
    }

    const data = await response.json();
    const contenido = data.choices[0].message.content.trim();

    console.log('🤖 Respuesta de OpenAI:', contenido);

    // Parsear JSON (puede venir con o sin markdown)
    let jsonTexto = contenido;
    if (contenido.includes('```json')) {
        jsonTexto = contenido.split('```json')[1].split('```')[0].trim();
    } else if (contenido.includes('```')) {
        jsonTexto = contenido.split('```')[1].split('```')[0].trim();
    }

    return JSON.parse(jsonTexto);
}
