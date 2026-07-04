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
    text: '*_Hinata-Bot_*\n\n➮ *_USO_*\n✰ .setnamebot <nombre>\n✰ Cambia nombre del bot principal\n\n✰ .setnamebot @jid <nombre>\n✰ Cambia nombre de un sub-bot\n✰ Ejemplo: .setnamebot 123456789@s.whatsapp.net MiSubBot'
  }, { quoted: m })

  const args = text.split(' ')
  
  if (args.length >= 2 && args[0].includes('@')) {
    const jid = args[0]
    const newName = args.slice(1).join(' ')
    
    let encontrado = false
    
    for (const bot of global.conns) {
      if (bot.user?.jid === jid) {
        try {
          await bot.updateProfileName(newName)
          await conn.sendMessage(m.chat, {
            text: `*_Hinata-Bot_*\n\n➮ *_SUB-BOT ACTUALIZADO_*\n✰ JID: ${jid}\n✰ Nuevo nombre: *_${newName}_*`,
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
          encontrado = true
          break
        } catch (e) {
          await conn.sendMessage(m.chat, {
            text: `*_Hinata-Bot_*\n\n➮ *_ERROR_*\n✰ No se pudo cambiar nombre del sub-bot`,
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
          encontrado = true
          break
        }
      }
    }
    
    if (!encontrado) {
      await conn.sendMessage(m.chat, {
        text: `*_Hinata-Bot_*\n\n➮ *_NO ENCONTRADO_*\n✰ No se encontró ningún sub-bot con ese JID`,
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
    return
  }

  try {
    await conn.updateProfileName(text)
    await conn.sendMessage(m.chat, {
      text: `*_Hinata-Bot_*\n\n➮ *_BOT PRINCIPAL_*\n✰ Nuevo nombre: *_${text}_*`,
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
handler.command = /^(setnamebot|setnamesub|cambiarnombrebot)$/i
handler.desc = 'Cambia el nombre del bot o sub-bot'
handler.owner = true

export default handler