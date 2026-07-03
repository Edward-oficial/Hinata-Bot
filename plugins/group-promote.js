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

  let users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : []
  
  if (!users.length) {
    return conn.sendMessage(m.chat, {
      text: '*_Hinata-Bot_*\n\n➮ *_USO_*\n✰ Menciona a un usuario o responde a su mensaje\n✰ Ejemplo: .promote @usuario',
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

  let results = []
  for (let user of users) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
      results.push(`✰ @${user.split('@')[0]} ahora es administrador`)
    } catch (e) {
      results.push(`✰ @${user.split('@')[0]} no se pudo promover`)
    }
  }

  await conn.sendMessage(m.chat, {
    text: `*_Hinata-Bot_*\n\n➮ *_PROMOTE_*\n${results.join('\n')}`,
    mentions: users,
    contextInfo: {
      mentionedJid: users,
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

handler.help = ['promote']
handler.tags = ['group']
handler.command = /^(promote|daradmin|haceradmin)$/i
handler.desc = 'Da el rango de administrador a un miembro'
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler