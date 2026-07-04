
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
    text: '*_Hinata-Bot_*\n\n➮ *_USO_*\n✰ .setnamebot <nombre>\n✰ Cambia el nombre del bot en el menu\n✰ Ejemplo: .setnamebot MiSuperBot'
  }, { quoted: m })

  try {
    // Guardar el nombre en settings
    if (!global.db.data.settings[conn.user.jid]) {
      global.db.data.settings[conn.user.jid] = {}
    }
    global.db.data.settings[conn.user.jid].menuName = text

    // Tambien cambiar el nombre del perfil
    await conn.updateProfileName(text)

    await conn.sendMessage(m.chat, {
      text: `*_Hinata-Bot_*\n\n➮ *_NOMBRE ACTUALIZADO_*\n✰ Nuevo nombre del menu: *_${text}_*\n✰ El menu mostrara el nuevo nombre`,
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
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: '*_Hinata-Bot_*\n\n➮ *_ERROR_*\n✰ No se pudo cambiar el nombre',
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
  }
}

handler.help = ['setnamebot']
handler.tags = ['owner']
handler.command = /^(setnamebot)$/i
handler.desc = 'Cambia el nombre del bot en el menu'
handler.owner = true

export default handler