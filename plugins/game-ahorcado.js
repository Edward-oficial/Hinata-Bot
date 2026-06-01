import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, usedPrefix, command }) => {
  global.ahorcado = global.ahorcado || {}

  const palabras = ['JAVASCRIPT','ANDROID','WHATSAPP','ELYSSIA','PROGRAMACION']
  const palabra = palabras[Math.floor(Math.random() * palabras.length)]

  global.ahorcado[m.sender] = {
    palabra,
    usadas: [],
    vidas: 6
  }

  const text = `
╭━━━〔 🎮 AHORCADO 〕━━━⬣
┃ ❤️ Vidas: 6
┃
┃ _ ${'_ '.repeat(palabra.length-1)}
┃
┃ Letras usadas: Ninguna
╰━━━━━━━━━━━━⬣
`

  const buttons = [{
    name: 'single_select',
    buttonParamsJson: JSON.stringify({
      title: '🎮 ELIGE UNA LETRA',
      sections: [{
        title: '🔤 Letras',
        rows: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({
          title: l,
          id: `ahorcado_${l}_${m.sender}`
        }))
      }]
    })
  }]

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {},
        interactiveMessage: proto.Message.InteractiveMessage.create({
          header: { title: 'ELYSSIA MD 🌸 - AHORCADO', subtitle: 'Adivina la palabra', hasMediaAttachment: false },
          body: { text },
          footer: { text: '🎮 Elyssia MD 🌸' },
          nativeFlowMessage: { buttons }
        })
      }
    }
  }, { quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return
  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id
    if (!id || !id.startsWith('ahorcado_')) return

    const parts = id.split('_')
    const letra = parts[1]
    const userId = parts[2]

    const game = global.ahorcado[userId]
    if (!game) return

    if (!game.usadas.includes(letra)) game.usadas.push(letra)

    if (!game.palabra.includes(letra)) game.vidas--

    const progreso = game.palabra.split('').map(l => game.usadas.includes(l) ? l : '_').join(' ')

    let estado = ''
    if (progreso.replace(/ /g,'') === game.palabra) estado = '🏆 ¡GANASTE!'
    else if (game.vidas <= 0) estado = `💀 PERDISTE\nPalabra: ${game.palabra}`

    const text = `
╭━━━〔 🎮 AHORCADO 〕━━━⬣
┃ ❤️ Vidas: ${game.vidas}
┃
┃ ${progreso}
┃
┃ Letras usadas: ${game.usadas.join(', ')}
┃
┃ ${estado || '👉 Presiona otra letra para continuar'}
╰━━━━━━━━━━━━⬣
`

    const buttons = [{
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: '🎮 ELIGE UNA LETRA',
        sections: [{
          title: '🔤 Letras',
          rows: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({
            title: l,
            id: `ahorcado_${l}_${userId}`
          }))
        }]
      })
    }]

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: { title: 'ELYSSIA MD 🌸 - AHORCADO', subtitle: 'Adivina la palabra', hasMediaAttachment: false },
            body: { text },
            footer: { text: '🎮 Elyssia MD 🌸' },
            nativeFlowMessage: { buttons }
          })
        }
      }
    }, { quoted: m })

    if (game.vidas <= 0 || progreso.replace(/ /g,'') === game.palabra) delete global.ahorcado[userId]

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return true

  } catch (e) {
    console.log(e)
  }
}

handler.command = ['ahorcado']
handler.tags = ['game']
handler.help = ['ahorcado']

export default handler