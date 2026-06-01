let handler = async (m, { conn, usedPrefix, command }) => {
  const opciones = ['piedra', 'papel', 'tijera']
  const emojis = { piedra: '✊', papel: '✋', tijera: '✌️' }

  // Botones interactivos
  const botones = [
    { buttonId: `${usedPrefix}${command} piedra`, buttonText: { displayText: '✊ Piedra' }, type: 1 },
    { buttonId: `${usedPrefix}${command} papel`, buttonText: { displayText: '✋ Papel' }, type: 1 },
    { buttonId: `${usedPrefix}${command} tijera`, buttonText: { displayText: '✌️ Tijera' }, type: 1 }
  ]

  // Si no escribió opción, mostramos botones
  if (!m.text) {
    return await conn.sendMessage(m.chat, {
      text: '✨ *PIEDRA, PAPEL O TIJERA – ELYSSIA MD* ✨\nElige tu opción:',
      footer: '💡 Usa los botones para jugar',
      buttons,
      headerType: 1
    }, { quoted: m })
  }

  const user = m.text.toLowerCase()
  if (!opciones.includes(user)) return m.reply('⚠️ Opción inválida. Elige piedra, papel o tijera')

  const bot = opciones[Math.floor(Math.random() * opciones.length)]

  let resultado = ''
  if (user === bot) resultado = '🤝 ¡Empate!'
  else if (
    (user === 'piedra' && bot === 'tijera') ||
    (user === 'papel' && bot === 'piedra') ||
    (user === 'tijera' && bot === 'papel')
  ) resultado = '🏆 ¡Ganaste! ELYSSIA MD'
  else resultado = '😢 ¡Perdiste! ELYSSIA MD'

  const mensaje = `
✨ *PIEDRA, PAPEL O TIJERA – ELYSSIA MD* ✨
👤 Tú: ${emojis[user]} ${user}
🤖 Bot: ${emojis[bot]} ${bot}

${resultado}

💡 Usa los botones para jugar otra vez
`

  await conn.sendMessage(m.chat, { text: mensaje, buttons, footer: '🎮 ELYSSIA MD' }, { quoted: m })
}

handler.help = ['ppt <piedra/papel/tijera>']
handler.tags = ['game']
handler.command = ['ppt']

export default handler