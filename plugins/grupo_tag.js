import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, participants, isAdmin, isOwner }) => {
  if (!text && !m.quoted) {
    return conn.reply(
      m.chat,
      '🌸 Debes escribir un mensaje para activar el hidetag ultra Elyssia MD.',
      m
    )
  }

  const mensaje = m.quoted?.text || text || '✨ Elyssia MD te menciona'
  const users = participants.map(u => conn.decodeJid(u.id))
  const total = users.length

  if (total === 0) return conn.reply(m.chat, '⚠️ No se encontraron usuarios para mencionar.', m)

  // 🌸 Mensaje inicial estilo panel
  await conn.reply(
    m.chat,
    `╭━━━〔 🌸 ELYSSIA MD 〕━━━⬣
┃ 📢 Iniciando notificación global...
┃ 🎯 Usuarios detectados: ${total}
╰━━━━━━━━━━━━━━⬣`,
    m
  )

  let enviados = 0

  // 🌸 Envío por lotes con efecto visual de progreso
  for (let i = 0; i < users.length; i += 10) { // enviar 10 por lote
    const lote = users.slice(i, i + 10)

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        extendedTextMessage: {
          text: `╭━━━〔 🌸 ELYSSIA MD 〕━━━⬣
┃ 📢 Notificación oficial
╰━━━━━━━━━━━━━━⬣

${mensaje}`,
          contextInfo: { mentionedJid: lote }
        }
      },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    enviados += lote.length

    // 🌸 Barra de progreso animada en chat
    const progress = Math.round((enviados / total) * 20) // 20 bloques
    const barra = '▓'.repeat(progress) + '░'.repeat(20 - progress)
    await conn.sendMessage(
      m.chat,
      { text: `⌛ Enviando... [${barra}] ${enviados}/${total} usuarios notificados` },
      { quoted: m }
    )

    await new Promise(res => setTimeout(res, 700)) // efecto visual
  }

  // 🌸 Mensaje final
  await conn.reply(
    m.chat,
    `╭━━━〔 🌸 ELYSSIA MD 〕━━━⬣
┃ ✅ Notificación completada
┃ 📨 Total usuarios notificados: ${enviados}
┃ ✨ Proceso finalizado con éxito
╰━━━━━━━━━━━━━━⬣`,
    m
  )
}

handler.help = ['tag']
handler.tags = ['group']
handler.command = ['tag', 'tagultra']
handler.group = true
handler.admin = true

export default handler