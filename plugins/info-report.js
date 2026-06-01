import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, { text: '❌ Por favor escribe tu reporte o sugerencia.' }, { quoted: m })

  const creatorNumber = '51910227479@s.whatsapp.net' // Número del creador

  // Mensaje que se envía al creador
  const reportMsg = `
📩 *Nuevo Reporte / Sugerencia*

*De:* @${m.sender.split('@')[0]}
*Chat:* ${m.chat}
*Mensaje:*
${text}
  `

  // Botón de respuesta (opcional, solo para estilo Elyssia)
  const buttons = [
    {
      buttonId: 'report_ok',
      buttonText: { displayText: '✅ Reporte recibido' },
      type: 1
    }
  ]

  const message = generateWAMessageFromContent(creatorNumber, {
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: reportMsg,
        hydratedFooterText: '📌 Elyssia-Bot-MD',
        hydratedButtons: buttons
      }
    }
  })

  await conn.relayMessage(creatorNumber, message.message, { messageId: message.key.id })

  // Confirmación para el usuario
  const confirmation = `
✅ Tu reporte ha sido enviado al creador.
Gracias por tu feedback 🌸
  `
  await conn.sendMessage(m.chat, { text: confirmation }, { quoted: m })
}

handler.command = ['report', 'reporte', 'sugerencia']
handler.tags = ['info']
handler.help = ['report <mensaje>']

export default handler