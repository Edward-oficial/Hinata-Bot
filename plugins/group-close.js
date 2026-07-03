let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return conn.sendMessage(m.chat, { 
    text: '*_Hinata-Bot_*\n\n➮ *_SOLO GRUPOS_*\n✰ Este comando solo funciona en grupos',
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
  
  if (!isAdmin) return conn.sendMessage(m.chat, { 
    text: '*_Hinata-Bot_*\n\n➮ *_SOLO ADMINS_*\n✰ Solo administradores pueden usar este comando',
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
  
  if (!isBotAdmin) return conn.sendMessage(m.chat, { 
    text: '*_Hinata-Bot_*\n\n➮ *_NECESITO SER ADMIN_*\n✰ La bot necesita ser administradora',
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

  await conn.groupSettingUpdate(m.chat, 'announcement')
  await conn.sendMessage(m.chat, { 
    text: '*_Hinata-Bot_*\n\n➮ *_GRUPO CERRADO_*\n✰ Grupo cerrado exitosamente\n✰ Solo administradores pueden enviar mensajes',
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

handler.help = ['close']
handler.tags = ['group']
handler.command = /^(close|cerrar)$/i
handler.desc = 'Cierra el grupo'
handler.admin = true
handler.botAdmin = true

export default handler