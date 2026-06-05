let handler = async (m, { conn }) => {
  let who = m.sender
  let owners = ['59177474230@s.whatsapp.net', '573223090406@s.whatsapp.net']

  if (!owners.includes(who)) {
    return conn.sendMessage(m.chat, {
      text: '❀ HINATA RESETLINK ❀\n\nSolo los creadores pueden usar este comando\n\n> Solicitado por @' + who.split('@')[0],
      mentions: [who]
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, { text: '⏳ Reseteando link del grupo...' }, { quoted: m })

  try {
    let pp
    try { pp = await conn.profilePictureUrl(m.chat, 'image') } catch { pp = 'https://files.catbox.moe/5tegkb.png' }

    await conn.groupRevokeInvite(m.chat)
    let code = await conn.groupInviteCode(m.chat)
    let link = 'https://chat.whatsapp.com/' + code

    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: '❀ HINATA RESETLINK ❀\n\nLink reseteado correctamente\n\n' + link + '\n\n> Solicitado por @' + who.split('@')[0],
      mentions: [who]
    }, { quoted: m })

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: '❀ HINATA RESETLINK ❀\n\nLa bot debe ser admin para resetear el link'
    }, { quoted: m })
  }
}

handler.help = ['resetlink']
handler.tags = ['owner']
handler.command = /^(resetlink|revoke|nuevolink)$/i
handler.desc = 'Resetea el link del grupo'
handler.owner = true
handler.botAdmin = true

export default handler