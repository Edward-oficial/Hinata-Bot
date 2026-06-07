// © 2026 EL VIGILANTE & BRAYANRK - HINATA BOT
// No quitar créditos

import fetch from 'node-fetch'
import { exec } from 'child_process'
import { writeFile, unlink, readFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

async function toWhatsAppSticker(url) {
  const res = await fetch(url)
  const buffer = Buffer.from(await res.arrayBuffer())

  const input = join(tmpdir(), `stk_in_${Date.now()}.webp`)
  const output = join(tmpdir(), `stk_out_${Date.now()}.webp`)

  await writeFile(input, buffer)

  await new Promise((resolve, reject) => {
    exec(
      `ffmpeg -y -i "${input}" -vcodec libwebp -loop 0 -preset default -an -vsync 0 -s 512:512 "${output}"`,
      (err) => {
        if (err) reject(err)
        else resolve()
      }
    )
  })

  const result = await readFile(output)
  await unlink(input).catch(() => {})
  await unlink(output).catch(() => {})
  return result
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const query = text?.trim()

  if (!query) return conn.sendMessage(m.chat, {
    text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ Descarga packs de stickers\n\n> ${usedPrefix}${command} <tema>\n> Ejemplo: ${usedPrefix}${command} anime`
  }, { quoted: m })

  await m.react('🔍')

  try {
    const res = await fetch(`https://api.delirius.store/tools/stickerpack?query=${encodeURIComponent(query)}&page=0`)
    const json = await res.json()

    if (!json.status || !json.data) {
      await m.react('❌')
      return conn.sendMessage(m.chat, {
        text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ No se encontraron stickers\n\n> Intenta con otro tema`
      }, { quoted: m })
    }

    const { title, username, total, stickers } = json.data

    await conn.sendMessage(m.chat, {
      text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ Pack: *${title}*\n❀ Autor: *${username}*\n❀ Total: *${total} stickers*\n\n> Enviando 10 stickers...`
    }, { quoted: m })

    await m.react('⏳')

    for (const url of stickers.slice(0, 10)) {
      try {
        const stickerBuffer = await toWhatsAppSticker(url)
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
      } catch {}
    }

    await m.react('✅')

  } catch (e) {
    await m.react('❌')
    await conn.sendMessage(m.chat, {
      text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Error al obtener stickers\n\n> ${e.message}`
    }, { quoted: m })
  }
}

handler.help = ['spack']
handler.tags = ['downloader']
handler.command = /^spack$/i
handler.desc = 'Descarga packs de stickers animados'

export default handler
