// © 2026 EL VIGILANTE & BRAYANRK - HINATA BOT
// No quitar créditos

import fetch from 'node-fetch'
import { exec } from 'child_process'
import { writeFile, unlink, readFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

async function toWhatsAppSticker(url) {
  const res = await fetch(url)
  const buffer = Buffer.from(await res.arrayBuffer())
  const input = join(tmpdir(), `stk_in_${Date.now()}.webp`)
  const output = join(tmpdir(), `stk_out_${Date.now()}.webp`)
  await writeFile(input, buffer)
  await new Promise((resolve, reject) => {
    exec(
      `ffmpeg -y -i "${input}" -vcodec libwebp -loop 0 -preset default -an -vsync 0 -s 512:512 "${output}"`,
      (err) => { if (err) reject(err); else resolve() }
    )
  })
  const result = await readFile(output)
  await unlink(input).catch(() => {})
  await unlink(output).catch(() => {})
  return result
}

async function buscarYEnviar(conn, m, query) {
  await m.react('🔍')

  const res = await fetch(`https://api.delirius.store/search/stickerly?query=${encodeURIComponent(query)}`)
  const json = await res.json()

  if (!json.status || !json.data?.length) {
    await m.react('❌')
    return conn.sendMessage(m.chat, {
      text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Sin resultados para *${query}*\n\n> Intenta con otro término`
    }, { quoted: m })
  }

  const pack = json.data[0]

  await m.react('⏳')
  await conn.sendMessage(m.chat, {
    text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ Pack: *${pack.name}*\n❀ Autor: *${pack.author}*\n\n> Descargando stickers...`
  }, { quoted: m })

  const res2 = await fetch(`https://api.delirius.store/download/stickerly?url=${encodeURIComponent(pack.url)}`)
  const json2 = await res2.json()

  if (!json2.status || !json2.data?.stickers?.length) {
    await m.react('❌')
    return conn.sendMessage(m.chat, {
      text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Error al descargar stickers'
    }, { quoted: m })
  }

  const stickers = json2.data.stickers
  let enviados = 0

  for (let i = 0; i < Math.min(stickers.length, 5); i++) {
    try {
      const stickerBuffer = await toWhatsAppSticker(stickers[i])
      await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
      enviados++
    } catch {}
  }

  await conn.sendMessage(m.chat, {
    text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n✅ ${enviados}/${stickers.length} stickers enviados\n❀ Pack: *${pack.name}*\n❀ Autor: *${pack.author}*`
  }, { quoted: m })

  await m.react('✅')
}

let handler = async (m, { conn, text }) => {
  if (!text) {
    const sections = [{
      title: '🔥 BÚSQUEDAS RÁPIDAS',
      rows: [
        { header: '🐉', title: 'Goku', description: 'Stickers de Goku', id: 'stickerly_Goku' },
        { header: '🍃', title: 'Naruto', description: 'Stickers de Naruto', id: 'stickerly_Naruto' },
        { header: '👒', title: 'Luffy', description: 'Stickers de Luffy', id: 'stickerly_Luffy' },
        { header: '😂', title: 'Meme', description: 'Stickers de memes', id: 'stickerly_Meme' }
      ]
    }]

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: '𑁍ࠬܓ HINATA STICKERLY 𑁍ࠬܓ', subtitle: 'Busca y descarga stickers', hasMediaAttachment: false },
      body: { text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ Busca stickers en Stickerly\n\n> .stickerly <búsqueda>\n> .stickerly Goku' },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({ title: '🔍 BÚSQUEDAS', sections })
        }]
      }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return
  }

  try {
    await buscarYEnviar(conn, m, text)
  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.sendMessage(m.chat, {
      text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Error\n\n> ' + e.message
    }, { quoted: m })
  }
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id || data.selectedId || data.selectedRowId || null
    if (!id || !id.startsWith('stickerly_')) return false

    const query = id.replace('stickerly_', '')
    await buscarYEnviar(conn, m, query)
    return true
  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.sendMessage(m.chat, {
      text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Error\n\n> ' + e.message
    }, { quoted: m })
    return true
  }
}

handler.help = ['stickerly']
handler.tags = ['downloader']
handler.command = /^(stickerly|stickers|stickerpack)$/i
handler.desc = 'Busca y descarga stickers de Stickerly'

export default handler
