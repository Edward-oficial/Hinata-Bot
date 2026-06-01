import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, usedPrefix, command }) => {
  global.asertijo = global.asertijo || {}

  const acertijos = [
    { pregunta: 'Blanca por dentro, verde por fuera. Si quieres que te lo diga, espera.', respuesta: 'PERA' },
    { pregunta: 'Vuelo de noche, duermo en el día y nunca verás plumas en ala mía.', respuesta: 'MURCIELAGO' },
    { pregunta: 'No es hermano, no es hermana, pero todos saben que es hijo de mi madre.', respuesta: 'YO' }
  ]

  const { pregunta, respuesta } = acertijos[Math.floor(Math.random() * acertijos.length)]

  global.asertijo[m.sender] = {
    respuesta,
    start: Date.now(),
    timeout: setTimeout(() => {
      if (global.asertijo[m.sender]) {
        conn.sendMessage(m.chat, `⏰ Se acabó el tiempo\nLa respuesta era: *${respuesta}*`, { quoted: m })
        delete global.asertijo[m.sender]
      }
    }, 60000) // 60 segundos
  }

  const text = `
╭━━━〔 🧩 ASERTIJO 〕━━━⬣
┃ ❓ Pregunta:
┃ ${pregunta}
┃
┃ ⏰ Tienes 60 segundos para responder
╰━━━━━━━━━━━━⬣
`

  await conn.sendMessage(m.chat, { text }, { quoted: m })
}

handler.before = async (m, { conn }) => {
  if (!global.asertijo) return
  const game = global.asertijo[m.sender]
  if (!game) return

  const respuesta = game.respuesta.toUpperCase()
  const mensaje = m.text?.toUpperCase() || ''

  if (mensaje === respuesta) {
    clearTimeout(game.timeout)
    await conn.sendMessage(m.chat, `🎉 ¡Correcto! La respuesta es: *${respuesta}*`, { quoted: m })
    delete global.asertijo[m.sender]
    return true
  }
}

handler.command = ['asertijo', 'acertijo']
handler.tags = ['game']
handler.help = ['asertijo']

export default handler