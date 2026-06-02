const handler = async (m, { conn }) => {

  let user = global.db.data.users[m.sender]

  let inv = `
╭━━━〔 🌸 INVENTARIO ELYSSIA 🌸 〕━━━⬣

👤 Usuario: ${await conn.getName(m.sender)}

╭─〔 💰 ECONOMÍA 〕
│ 🪙 Coins: ${user.coin}
│ 💎 Diamantes: ${user.diamond}
│ 🏦 Banco: ${user.bank}
╰────────────⬣

╭─〔 ⛏️ MINERÍA 〕
│ 🪨 Piedra: ${user.piedra || 0}
│ ⛓️ Hierro: ${user.hierro || 0}
│ 🥈 Plata: ${user.plata || 0}
│ 🥇 Oro: ${user.oro || 0}
│ 💎 Diamante: ${user.diamante || 0}
╰────────────⬣

╭─〔 ⚔️ ESTADO 〕
│ ❤️ Vida: ${user.health}
│ ⭐ Nivel: ${user.level}
│ ✨ XP: ${user.exp}
╰────────────⬣

🌸 "Cada objeto cuenta tu historia..."
`

  await conn.sendMessage(m.chat, { text: inv, mentions: [m.sender] }, { quoted: m })
}

handler.command = /^(inv|inventario|bag)$/i
handler.tags = ['eco']
handler.help = ['inventario']

export default handler