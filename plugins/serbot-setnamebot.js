// plugins/owner/setnamebot.js
let handler = async (m, { conn, text, isOwner }) => {
  if (!isOwner) return conn.sendMessage(m.chat, {
    text: '*_Hinata-Bot_*\n\n➮ *_SOLO OWNER_*\n✰ Solo el owner puede usar este comando',
    contextInfo: {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363407253203904@newsletter',
        newsletterName: '𓆩⚝𓆪 ʜɪɴᴀᴛᴀ ᴏꜰɪᴄɪᴀʟ 𓆩⚝𓆪',
        serverMessageId: 1
      }
    }
  }, { quoted: m })

  if (!text) return conn.sendMessage(m.chat, {
    text: '*_Hinata-Bot_*\n\n➮ *_USO_*\n✰ .setnamebot <nombre>\n✰ Cambia el nombre del bot actual\n✰ Ejemplo: .setnamebot MiBot\n\n✰ .setnamebot all <nombre>\n✰ Cambia el nombre de todos los bots'
  }, { quoted: m })

  const args = text.split(' ')
  
  // Cambiar nombre de todos los bots (principal + sub-bots)
  if (args[0].toLowerCase() === 'all') {
    const newName = args.slice(1).join(' ')
    if (!newName) return conn.sendMessage(m.chat, { text: '✰ Escribe el nombre para todos los bots' }, { quoted: m })
    
    let cambiados = 0
    let errores = 0
    
    // Cambiar el bot actual (principal o sub-bot)
    try {
      await conn.updateProfileName(newName)
      cambiados++
    } catch {
      errores++
    }
    
    // Cambiar todos los demas sub-bots
    for (const bot of global.conns) {
      if (bot.user?.jid !== conn.user?.jid) {
        try {
          await bot.updateProfileName(newName)
          cambiados++
        } catch {
          errores++
        }
      }
    }
    
    await conn.sendMessage(m.chat, {
      text: `*_Hinata-Bot_*\n\n➮ *_BOTS ACTUALIZADOS_*\n✰ Nombre: *_${newName}_*\n✰ Bots cambiados: *_${cambiados}_*\n✰ Errores: *_${errores}_*`
    }, { quoted: m })
    return
  }
  
  // Cambiar nombre del bot actual (el que ejecuta el comando)
  try {
    await conn.updateProfileName(text)
    await conn.sendMessage(m.chat, {
      text: `*_Hinata-Bot_*\n\n➮ *_BOT ACTUALIZADO_*\n✰ Nuevo nombre: *_${text}_*`
    }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: '*_Hinata-Bot_*\n\n➮ *_ERROR_*\n✰ No se pudo cambiar el nombre'
    }, { quoted: m })
  }
}

handler.help = ['setnamebot']
handler.tags = ['owner']
handler.command = /^(setnamebot)$/i
handler.desc = 'Cambia el nombre del bot actual o todos'
handler.owner = true

export default handler