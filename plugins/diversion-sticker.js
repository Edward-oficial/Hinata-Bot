import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let handler = async (m, { conn, text }) => {
  if (!text) {
    let sections = [{
      title: '🔥 BÚSQUEDAS RÁPIDAS',
      rows: [
        { header: '🐉', title: 'Goku', description: 'Stickers de Goku', id: 'stickerly_Goku' },
        { header: '🍃', title: 'Naruto', description: 'Stickers de Naruto', id: 'stickerly_Naruto' },
        { header: '👒', title: 'Luffy', description: 'Stickers de Luffy', id: 'stickerly_Luffy' },
        { header: '😂', title: 'Meme', description: 'Stickers de memes', id: 'stickerly_Meme' }
      ]
    }]

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: '🌟 HINATA STICKERLY 🌟', subtitle: 'Busca stickers animados', hasMediaAttachment: false },
      body: { text: '🌟 「 HINATA STICKERLY 」 🌟\n\n💫 » Busca stickers en Stickerly\n\n> #stickerly <búsqueda>\n> #stickerly Goku' },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🔍 BÚSQUEDAS',
            sections: sections
          })
        }]
      }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return
  }

  await m.react('🔍')

  try {
    let searchUrl = `https://api-faa.my.id/faa/stickerly?query=${encodeURIComponent(text)}`
    let res = await fetch(searchUrl)
    let json = await res.json()

    if (!json.status || !json.results?.length) {
      await m.react('❌')
      return conn.sendMessage(m.chat, {
        text: '🌟 「 HINATA STICKERLY 」 🌟\n\n💫 » Sin resultados'
      }, { quoted: m })
    }

    let random = json.results[Math.floor(Math.random() * json.results.length)]

    await conn.sendMessage(m.chat, {
      video: { url: random.url },
      caption: '🌟 「 HINATA STICKERLY 」 🌟\n\n💫 » ' + text + '\n📦 » ' + json.total + ' resultados',
      gifPlayback: true
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.react('❌')
    conn.sendMessage(m.chat, { text: '❌ Error al buscar' }, { quoted: m })
  }
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id || data.selectedId || data.selectedRowId || null
    if (!id || !id.startsWith('stickerly_')) return false

    let query = id.replace('stickerly_', '')
    let searchUrl = `https://api-faa.my.id/faa/stickerly?query=${encodeURIComponent(query)}`
    let res = await fetch(searchUrl)
    let json = await res.json()

    if (!json.status || !json.results?.length) {
      return conn.sendMessage(m.chat, { text: '❌ Sin resultados' }, { quoted: m })
    }

    let random = json.results[Math.floor(Math.random() * json.results.length)]

    await conn.sendMessage(m.chat, {
      video: { url: random.url },
      caption: '🌟 「 HINATA STICKERLY 」 🌟\n\n💫 » ' + query + '\n📦 » ' + json.total + ' resultados',
      gifPlayback: true
    }, { quoted: m })

    return true

  } catch (e) {
    console.log(e)
    return false
  }
}

handler.help = ['stickerly']
handler.tags = ['downloader']
handler.command = /^(stickerly|sticker|stickers)$/i
handler.desc = 'Busca stickers en Stickerly'

export default handler