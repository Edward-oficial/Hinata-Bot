let handler = async (m, { conn, isAdmin, isBotAdmin, args }) => {
  if (!m.isGroup) return conn.sendMessage(m.chat, { text: '👥 「 HINATA ANTILINK 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❥ Solo para grupos\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔' }, { quoted: m })
  if (!isAdmin) return conn.sendMessage(m.chat, { text: '👥 「 HINATA ANTILINK 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❥ Solo administradores\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔' }, { quoted: m })
  if (!isBotAdmin) return conn.sendMessage(m.chat, { text: '👥 「 HINATA ANTILINK 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❥ La bot necesita ser admin\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔' }, { quoted: m })

  let chat = global.db.data.chats[m.chat]
  let option = args[0]?.toLowerCase()

  if (!option) {
    let estado = chat?.antiLink ? '✅ Activado' : '❌ Desactivado'
    return conn.sendMessage(m.chat, {
      text: '👥 「 HINATA ANTILINK 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n🔗 » Estado: ' + estado + '\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n> #antilink on | #antilink off'
    }, { quoted: m })
  }

  if (option === 'on') {
    chat.antiLink = true
    return conn.sendMessage(m.chat, {
      text: '👥 「 HINATA ANTILINK 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n✅ » Anti Links activado\n🔗 » Los enlaces serán eliminados\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔'
    }, { quoted: m })
  }

  if (option === 'off') {
    chat.antiLink = false
    return conn.sendMessage(m.chat, {
      text: '👥 「 HINATA ANTILINK 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❌ » Anti Links desactivado\n🔗 » Los enlaces están permitidos\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔'
    }, { quoted: m })
  }
}

handler.help = ['antilink']
handler.tags = ['group']
handler.command = /^(antilink)$/i
handler.desc = 'Activa/desactiva anti links'
handler.admin = true
handler.botAdmin = true

export default handler