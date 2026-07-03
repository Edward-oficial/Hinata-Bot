let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) {
    let texto = '*_Hinata-Bot_*\n\n➮ *_SOLO GRUPOS_*\n✰ Este comando solo funciona en grupos'
    return conn.sendMessage(m.chat, { 
      text: texto,
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

  if (!isBotAdmin) {
    let texto = '*_Hinata-Bot_*\n\n➮ *_NECESITO SER ADMIN_*\n✰ La bot necesita ser administradora'
    return conn.sendMessage(m.chat, { 
      text: texto,
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

  if (!isAdmin) {
    let texto = '*_Hinata-Bot_*\n\n➮ *_SOLO ADMINS_*\n✰ Solo administradores pueden usar este comando'
    return conn.sendMessage(m.chat, { 
      text: texto,
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

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null

  if (!who) {
    let texto = '*_Hinata-Bot_*\n\n➮ *_USO_*\n✰ Menciona o responde a quien expulsar\n✰ Ejemplo: .sacar @usuario'
    return conn.sendMessage(m.chat, { 
      text: texto,
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

  let metadata = await conn.groupMetadata(m.chat)
  let isTargetOwner = metadata.participants.some(p => p.id === who && p.admin === 'superadmin')
  let isTargetAdmin = metadata.participants.some(p => p.id === who && (p.admin === 'admin' || p.admin === 'superadmin'))

  if (isTargetOwner) {
    let texto = '*_Hinata-Bot_*\n\n➮ *_NO SE PUEDE_*\n✰ No se puede expulsar al creador del grupo\n✰ @' + who.split('@')[0]
    return conn.sendMessage(m.chat, { 
      text: texto, 
      mentions: [who],
      contextInfo: {
        mentionedJid: [who, m.sender],
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

  if (isTargetAdmin && who !== conn.user.jid) {
    let texto = '*_Hinata-Bot_*\n\n➮ *_NO SE PUEDE_*\n✰ No se puede expulsar a otro administrador\n✰ @' + who.split('@')[0]
    return conn.sendMessage(m.chat, { 
      text: texto, 
      mentions: [who],
      contextInfo: {
        mentionedJid: [who, m.sender],
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

  if (who === conn.user.jid) {
    let texto = '*_Hinata-Bot_*\n\n➮ *_NO SE PUEDE_*\n✰ No puedo expulsarme a mi misma'
    return conn.sendMessage(m.chat, { 
      text: texto,
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
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')

    let texto = '*_Hinata-Bot_*\n\n➮ *_EXPULSADO_*\n✰ Usuario expulsado exitosamente\n✰ @' + who.split('@')[0] + '\n✰ Miembros restantes: *_' + (metadata.participants.length - 1) + '_*'
    await conn.sendMessage(m.chat, { 
      text: texto, 
      mentions: [who],
      contextInfo: {
        mentionedJid: [who, m.sender],
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
    let texto = '*_Hinata-Bot_*\n\n➮ *_ERROR_*\n✰ No se pudo expulsar al usuario'
    await conn.sendMessage(m.chat, { 
      text: texto,
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

handler.help = ['sacar']
handler.tags = ['group']
handler.command = /^(sacar|echar|expulsar|kick)$/i
handler.desc = 'Expulsa a un miembro'
handler.admin = true
handler.botAdmin = true

export default handler