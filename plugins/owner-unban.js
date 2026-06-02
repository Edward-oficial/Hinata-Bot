let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🌸 Uso: #unban @usuario 💫')

  // Obtener ID del usuario
  let who = m.mentionedJid?.[0] || (text.split(' ')[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net')
  if (!who) return m.reply('❌ Por favor etiqueta o escribe el número del usuario 🌸')

  // Inicializar usuario si no existe
  global.db.data.users[who] = global.db.data.users[who] || {}
  global.db.data.users[who].banned = false
  global.db.data.users[who].bannedReason = ''

  // Mensaje de confirmación
  await conn.reply(m.chat, `🌸 Usuario desbaneado con éxito ✨\n\n👤 Usuario: ${who}\n💫 Ya puede usar los comandos normalmente 🌺`, m)
}

handler.help = ['unban <@usuario>']
handler.tags = ['owner']
handler.command = ['unban']
handler.rowner = true // Solo el dueño puede usarlo

export default handler