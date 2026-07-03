// events.js (en la raíz del proyecto)
export default function setupEvents(conn) {
  const newsletterJid = '120363407253203904@newsletter'
  const newsletterName = '𓆩⚝𓆪 ʜɪɴᴀᴛᴀ ᴏꜰɪᴄɪᴀʟ 𓆩⚝𓆪'

  function createNewsletterContext(text, mentions = []) {
    return {
      text: text,
      contextInfo: {
        mentionedJid: mentions,
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: newsletterJid,
          newsletterName: newsletterName,
          serverMessageId: 1
        }
      }
    }
  }

  // Cambios en el grupo (nombre, descripcion, foto)
  conn.ev.on('groups.update', async (updates) => {
    for (const update of updates) {
      const groupId = update.id
      const author = update.author || 'Alguien'
      
      if (update.subject) {
        try {
          await conn.sendMessage(groupId, createNewsletterContext(
            `*_Hinata-Bot_*\n\n➮ *_NOMBRE DEL GRUPO_*\n✰ Se ha cambiado el nombre del grupo\n✰ Nuevo nombre: *_${update.subject}_*\n✰ Cambiado por: @${author.split('@')[0]}`,
            [author]
          ))
        } catch (e) {
          console.error('Error al notificar cambio de nombre:', e)
        }
      }
      
      if (update.desc) {
        try {
          await conn.sendMessage(groupId, createNewsletterContext(
            `*_Hinata-Bot_*\n\n➮ *_DESCRIPCION DEL GRUPO_*\n✰ Se ha cambiado la descripcion del grupo\n✰ Nueva descripcion: ${update.desc}\n✰ Cambiado por: @${author.split('@')[0]}`,
            [author]
          ))
        } catch (e) {
          console.error('Error al notificar cambio de descripcion:', e)
        }
      }
      
      if (update.picture) {
        try {
          await conn.sendMessage(groupId, createNewsletterContext(
            `*_Hinata-Bot_*\n\n➮ *_FOTO DEL GRUPO_*\n✰ Se ha cambiado la foto del grupo\n✰ Cambiado por: @${author.split('@')[0]}`,
            [author]
          ))
        } catch (e) {
          console.error('Error al notificar cambio de foto:', e)
        }
      }
    }
  })

  // Promover o degradar admin
  conn.ev.on('group-participants.update', async (update) => {
    const { id, participants, action, author } = update
    
    if (action === 'promote') {
      for (const user of participants) {
        try {
          await conn.sendMessage(id, createNewsletterContext(
            `*_Hinata-Bot_*\n\n➮ *_NUEVO ADMIN_*\n✰ @${user.split('@')[0]} ha sido promovido a administrador\n✰ Promovido por: @${author?.split('@')[0] || 'Alguien'}`,
            [user, author]
          ))
        } catch (e) {
          console.error('Error al notificar promocion:', e)
        }
      }
    } else if (action === 'demote') {
      for (const user of participants) {
        try {
          await conn.sendMessage(id, createNewsletterContext(
            `*_Hinata-Bot_*\n\n➮ *_ADMIN ELIMINADO_*\n✰ A @${user.split('@')[0]} le han quitado el rango de administrador\n✰ Accion realizada por: @${author?.split('@')[0] || 'Alguien'}`,
            [user, author]
          ))
        } catch (e) {
          console.error('Error al notificar degradacion:', e)
        }
      }
    }
  })

  // Link restablecido (cuando se genera un nuevo link de invitacion)
  conn.ev.on('group.update', async (update) => {
    if (update.announce && update.announce === 'not_announcement') {
      // Cuando se abre el grupo
    }
  })

  // Detectar cuando se genera un nuevo link de invitacion
  conn.ev.on('groups.update', async (updates) => {
    for (const update of updates) {
      if (update.inviteCode) {
        const groupId = update.id
        const author = update.author || 'Alguien'
        const newLink = `https://chat.whatsapp.com/${update.inviteCode}`
        
        try {
          await conn.sendMessage(groupId, createNewsletterContext(
            `*_Hinata-Bot_*\n\n➮ *_LINK RESTABLECIDO_*\n✰ Se ha restablecido el link de invitacion\n✰ Nuevo link: ${newLink}\n✰ Generado por: @${author.split('@')[0]}`,
            [author]
          ))
        } catch (e) {
          console.error('Error al notificar link restablecido:', e)
        }
      }
    }
  })
}