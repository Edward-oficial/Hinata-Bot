let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) {
    let texto = '╭━━━〔 𝕳𝖎𝖓𝖆𝖙𝖆 𝕶𝖎𝖈𝖐 ˚ʚ♡ɞ˚ 〕━━⬣\n┃\n┃ ❧ Solo para grupos\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━⬣'
    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  if (!isBotAdmin) {
    let texto = '╭━━━〔 𝕳𝖎𝖓𝖆𝖙𝖆 𝕶𝖎𝖈𝖐 ˚ʚ♡ɞ˚ 〕━━⬣\n┃\n┃ ❧ La bot necesita ser admin\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━⬣'
    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  if (!isAdmin) {
    let texto = '╭━━━〔 𝕳𝖎𝖓𝖆𝖙𝖆 𝕶𝖎𝖈𝖐 ˚ʚ♡ɞ˚ 〕━━⬣\n┃\n┃ ❧ Solo administradores\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━⬣'
    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null

  if (!who) {
    let texto = '╭━━━〔 𝕳𝖎𝖓𝖆𝖙𝖆 𝕶𝖎𝖈𝖐 ˚ʚ♡ɞ˚ 〕━━⬣\n┃\n┃ ❧ Menciona o responde a quien expulsar\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━⬣'
    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  let metadata = await conn.groupMetadata(m.chat)
  let isTargetOwner = metadata.participants.some(p => p.id === who && p.admin === 'superadmin')
  let isTargetAdmin = metadata.participants.some(p => p.id === who && (p.admin === 'admin' || p.admin === 'superadmin'))

  if (isTargetOwner) {
    let texto = '╭━━━〔 𝕳𝖎𝖓𝖆𝖙𝖆 𝕶𝖎𝖈𝖐 ˚ʚ♡ɞ˚ 〕━━⬣\n┃\n┃ ❧ No se puede expulsar al creador\n┃ ❧ @' + who.split('@')[0] + '\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━⬣'
    return conn.sendMessage(m.chat, { text: texto, mentions: [who] }, { quoted: m })
  }

  if (isTargetAdmin && who !== conn.user.jid) {
    let texto = '╭━━━〔 𝕳𝖎𝖓𝖆𝖙𝖆 𝕶𝖎𝖈𝖐 ˚ʚ♡ɞ˚ 〕━━⬣\n┃\n┃ ❧ No se puede expulsar a otro admin\n┃ ❧ @' + who.split('@')[0] + '\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━⬣'
    return conn.sendMessage(m.chat, { text: texto, mentions: [who] }, { quoted: m })
  }

  if (who === conn.user.jid) {
    let texto = '╭━━━〔 𝕳𝖎𝖓𝖆𝖙𝖆 𝕶𝖎𝖈𝖐 ˚ʚ♡ɞ˚ 〕━━⬣\n┃\n┃ ❧ No puedo expulsarme a mí misma\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━⬣'
    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')

    let texto = '╭━━━〔 𝕳𝖎𝖓𝖆𝖙𝖆 𝕶𝖎𝖈𝖐 ˚ʚ♡ɞ˚ 〕━━⬣\n┃\n┃ ❧ Usuario expulsado\n┃ ❧ @' + who.split('@')[0] + '\n┃\n┃ ❧ Miembros restantes: ' + (metadata.participants.length - 1) + '\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━⬣'
    await conn.sendMessage(m.chat, { text: texto, mentions: [who] }, { quoted: m })
  } catch (e) {
    let texto = '╭━━━〔 𝕳𝖎𝖓𝖆𝖙𝖆 𝕶𝖎𝖈𝖐 ˚ʚ♡ɞ˚ 〕━━⬣\n┃\n┃ ❧ Error al expulsar al usuario\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━⬣'
    await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }
}

handler.help = ['sacar']
handler.tags = ['group']
handler.command = /^(sacar|echar|expulsar|kick)$/i
handler.desc = 'Expulsa a un miembro'
handler.admin = true
handler.botAdmin = true

export default handler
