let handler = async (m, { conn, isOwner }) => {
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

  let metadata = await conn.groupMetadata(m.chat)
  let user = metadata.participants.find(p => p.id === m.sender)
  
  if (user?.admin) {
    return conn.sendMessage(m.chat, {
      text: '*_Hinata-Bot_*\n\n➮ *_YA ERES ADMIN_*\n✰ Ya eres administrador en este grupo',
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

  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
    
    await conn.sendMessage(m.chat, {
      text: '*_Hinata-Bot_*\n\n➮ *_AUTO ADMIN_*\n✰ Ahora eres administrador en este grupo',
      mentions: [m.sender],
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
      text: '*_Hinata-Bot_*\n\n➮ *_ERROR_*\n✰ No se pudo dar admin\n✰ Asegurate de que el bot sea administrador',
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

handler.help = ['autoadmin']
handler.tags = ['owner']
handler.command = /^(autoadmin|darmiadmin|hacermeadmin)$/i
handler.desc = 'Te da admin en el grupo'
handler.owner = true
handler.botAdmin = true

export default handler