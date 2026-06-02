let handler = async (m, { conn, text }) => {
  if (!m.isGroup) return m.reply('❌ Solo funciona en grupos 🌸')
  if (!text) return m.reply('🌸 Uso: #promote @usuario 💫')

  let who = m.mentionedJid?.[0] || (text.split(' ')[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net')
  if (!who) return m.reply('❌ Por favor etiqueta o escribe el número del usuario 🌸')

  try {
    await conn.groupParticipantsUpdate(m.chat, [who], 'promote')
    m.reply(`✨ Usuario promovido a admin 🌸\n\n👤 Usuario: ${who}\n💫 Felicidades 🌺`)
  } catch (e) {
    m.reply('❌ No pude promover al usuario, asegúrate que el bot es admin 🌸')
  }
}

handler.help = ['promote <@usuario>']
handler.tags = ['group']
handler.command = ['promote']
handler.admin = true
handler.botAdmin = true

export default handler