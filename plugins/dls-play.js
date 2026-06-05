import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { pipeline } from 'stream/promises'
import { spawn } from 'child_process'
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'

const TEMP_DIR = path.join(process.cwd(), 'tmp')
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })

const REQUEST_TIMEOUT = 120000
const MAX_VIDEO_BYTES = 1500 * 1024 * 1024
const VIDEO_AS_DOCUMENT_THRESHOLD = 70 * 1024 * 1024

function safeFileName(name) {
  return String(name || 'video').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'video'
}

function normalizeMp4Name(name) {
  const clean = safeFileName(String(name || 'video').replace(/\.mp4$/i, ''))
  return `${clean || 'video'}.mp4`
}

function stripExtension(name) {
  return String(name || '').replace(/\.[^.]+$/i, '')
}

function deleteFileSafe(fp) {
  try { if (fp && fs.existsSync(fp)) fs.unlinkSync(fp) } catch {}
}

function parseContentDisposition(h) {
  const t = String(h || '')
  const u = t.match(/filename\*=UTF-8''([^;]+)/i)
  if (u?.[1]) {
    try { return decodeURIComponent(u[1]).replace(/["']/g, '').trim() } catch {}
  }
  const n = t.match(/filename="?([^"]+)"?/i)
  return n?.[1]?.trim() || ''
}

async function readStreamToText(stream) {
  return new Promise((res, rej) => {
    let d = ''
    stream.on('data', (c) => (d += c.toString()))
    stream.on('end', () => res(d))
    stream.on('error', rej)
  })
}

async function downloadVideo(downloadUrl, outputPath) {
  const response = await axios.get(downloadUrl, {
    responseType: 'stream',
    timeout: REQUEST_TIMEOUT,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': '*/*' },
    validateStatus: () => true,
    maxRedirects: 10,
  })

  if (response.status >= 400) {
    const err = await readStreamToText(response.data).catch(() => '')
    throw new Error(err || 'Error al descargar el video')
  }

  let downloaded = 0
  response.data.on('data', (chunk) => {
    downloaded += chunk.length
    if (downloaded > MAX_VIDEO_BYTES) {
      response.data.destroy(new Error('Video demasiado grande'))
    }
  })

  try {
    await pipeline(response.data, fs.createWriteStream(outputPath))
  } catch (e) {
    deleteFileSafe(outputPath)
    throw e
  }

  if (!fs.existsSync(outputPath)) throw new Error('No se pudo guardar el video')

  const size = fs.statSync(outputPath).size
  if (!size || size < 150000) {
    deleteFileSafe(outputPath)
    throw new Error('Video inválido o vacío')
  }

  const fromHeader = parseContentDisposition(response.headers?.['content-disposition'])
  return { size, fileName: normalizeMp4Name(fromHeader || 'video.mp4') }
}

async function normalizeForWhatsApp(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', [
      '-y', '-i', inputPath,
      '-vf', 'scale=640:trunc(ow/a/2)*2',
      '-c:v', 'libx264', '-b:v', '800k', '-preset', 'fast',
      '-c:a', 'aac', '-b:a', '128k',
      '-movflags', '+faststart', '-loglevel', 'error',
      outputPath
    ], { stdio: ['ignore', 'ignore', 'pipe'] })
    ff.on('error', reject)
    ff.on('close', (code) => {
      if (code === 0) resolve(true)
      else reject(new Error('ffmpeg error'))
    })
  })
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) { global.db.data.users[who] = { diamantes: 0 }; user = global.db.data.users[who] }

  if (!text) {
    let media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/r60c8l.jpg' } }, { upload: conn.waUploadToServer })
    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'HINATA BOT - PLAY', subtitle: 'Busca y descarga de YouTube', hasMediaAttachment: true, imageMessage: media.imageMessage },
      body: { text: '🎵 」\n\n💫 » Busca música y videos en YouTube\n\n> ' + usedPrefix + command + ' <nombre>\n> 💎 1 diamante' },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '🎵 YOUTUBE', sections: [{ title: '🔍 BUSCAR', rows: [{ header: '🎧', title: 'Buscar canción', description: '💎 1 diamante', id: 'play ' }] }] }) }] }
    })
    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return
  }

  await m.react('🔍')
  try {
    let searchUrl = `https://api.delirius.store/search/ytsearch?q=${encodeURIComponent(text)}`
    let searchRes = await fetch(searchUrl)
    let searchData = await searchRes.json()
    if (!searchData.status || !searchData.data?.length) throw new Error('No se encontraron resultados')

    let resultados = searchData.data.slice(0, 10)
    let primeraImagen = resultados[0].thumbnail || resultados[0].image || ''
    let media = null
    if (primeraImagen) media = await prepareWAMessageMedia({ image: { url: primeraImagen } }, { upload: conn.waUploadToServer })

    let rows = resultados.map((video, i) => ({
      header: '🎵 ' + (video.author?.name || 'Desconocido'),
      title: video.title.substring(0, 35),
      description: '⏱️ ' + (video.duration || '?') + ' | 👁️ ' + (video.views?.toLocaleString() || '?'),
      id: 'ytplay_' + i + '_' + Buffer.from(video.url).toString('base64') + '_' + Buffer.from(video.title).toString('base64')
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'HINATA BOT - PLAY', subtitle: 'Selecciona una canción', hasMediaAttachment: !!media, imageMessage: media ? media.imageMessage : undefined },
      body: { text: '🎵 」\n\n💫 » Búsqueda: ' + text + '\n\n> Elige una canción\n> 💎 1 diamante' },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '🎵 RESULTADOS', sections: [{ title: '📋 ' + text.toUpperCase(), rows }] }) }] }
    })
    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  } catch (e) {
    console.log(e)
    await m.react('❌')
    conn.sendMessage(m.chat, { text: '❌ No se encontraron resultados' }, { quoted: m })
  }
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false
  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id || data.selectedId || data.selectedRowId || null
    if (!id || !id.startsWith('ytplay_')) return false

    let who = m.sender
    let user = global.db.data.users[who]
    if (!user) { global.db.data.users[who] = { diamantes: 0, diamond: 0 }; user = global.db.data.users[who] }

    let misDiamantes = user.diamantes || user.diamond || 0
    if (misDiamantes < 1) {
      await conn.sendMessage(m.chat, { text: '🎵 」\n\n💫 » No tienes 1 diamante\n\n> Usa #work' }, { quoted: m })
      return true
    }

    let parts = id.split('_')
    let urlBase64 = parts[2], titleBase64 = parts[3]
    let titulo = Buffer.from(titleBase64, 'base64').toString()

    let sections = [{
      title: '🎵 FORMATO',
      rows: [
        { header: '🎧 MP3', title: 'Descargar Audio', description: 'Solo música | 1 💎', id: 'ytdl_mp3_' + urlBase64 + '_' + titleBase64 },
        { header: '🎬 MP4', title: 'Descargar Video', description: 'Video 360p | 1 💎', id: 'ytdl_mp4_' + urlBase64 + '_' + titleBase64 }
      ]
    }]

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'HINATA BOT - PLAY', subtitle: titulo.substring(0, 60), hasMediaAttachment: false },
      body: { text: '🎵 」\n\n💫 » Elige el formato\n\n🎧 MP3 | 🎬 MP4\n💎 1 diamante' },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '📥 DESCARGAR', sections: sections }) }] }
    })
    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return true
  } catch (e) { console.log(e); return false }
}

handler.after = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false
  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id || data.selectedId || data.selectedRowId || null
    if (!id || !id.startsWith('ytdl_')) return false

    let who = m.sender
    let user = global.db.data.users[who]
    if (!user) { global.db.data.users[who] = { diamantes: 0, diamond: 0 }; user = global.db.data.users[who] }

    let misDiamantes = user.diamantes || user.diamond || 0
    if (misDiamantes < 1) {
      await conn.sendMessage(m.chat, { text: '🎵 」\n\n💫 » No tienes 1 diamante' }, { quoted: m })
      return true
    }

    let parts = id.split('_')
    let tipo = parts[1], urlBase64 = parts[2], titleBase64 = parts[3]
    let videoUrl = Buffer.from(urlBase64, 'base64').toString()
    let titulo = Buffer.from(titleBase64, 'base64').toString()

    if (user.diamantes !== undefined) user.diamantes = misDiamantes - 1
    else user.diamond = misDiamantes - 1

    await m.react('⏳')
    await conn.sendMessage(m.chat, { text: '⏳ Descargando ' + (tipo === 'mp3' ? 'audio' : 'video') + '...\n💎 -1 diamante' }, { quoted: m })

    let apiUrl = tipo === 'mp3'
      ? `https://api.delirius.store/download/ytmp3?url=${encodeURIComponent(videoUrl)}`
      : `https://api.delirius.store/download/ytmp4?url=${encodeURIComponent(videoUrl)}&format=360p`

    let res = await fetch(apiUrl)
    let json = await res.json()

    if (!json.status || !json.data?.download) {
      if (user.diamantes !== undefined) user.diamantes = misDiamantes
      else user.diamond = misDiamantes
      throw new Error('No se pudo descargar, diamantes devueltos')
    }

    let downloadUrl = json.data.download
    let total = user.diamantes !== undefined ? user.diamantes : (user.diamond || 0)
    let finalTitle = safeFileName(json.data.title || titulo)
    let rawFile = path.join(TEMP_DIR, `yt_${Date.now()}.mp4`)
    let finalFile = path.join(TEMP_DIR, `yt_final_${Date.now()}.mp4`)

    try {
      if (tipo === 'mp3') {
        let audioRes = await axios.get(downloadUrl, { responseType: 'arraybuffer', timeout: REQUEST_TIMEOUT })
        await conn.sendMessage(m.chat, {
          audio: Buffer.from(audioRes.data),
          mimetype: 'audio/mpeg',
          fileName: finalTitle + '.mp3'
        }, { quoted: m })
      } else {
        let videoInfo = await downloadVideo(downloadUrl, rawFile)
        let finalName = normalizeMp4Name(stripExtension(videoInfo.fileName) || finalTitle)
        let size = videoInfo.size

        if (size > VIDEO_AS_DOCUMENT_THRESHOLD) {
          await conn.sendMessage(m.chat, {
            document: fs.readFileSync(rawFile),
            mimetype: 'video/mp4',
            fileName: finalName,
            caption: '🎬 ' + finalTitle
          }, { quoted: m })
        } else {
          try {
            await conn.sendMessage(m.chat, {
              video: fs.readFileSync(rawFile),
              mimetype: 'video/mp4',
              fileName: finalName,
              caption: '🎬 ' + finalTitle
            }, { quoted: m })
          } catch {
            await normalizeForWhatsApp(rawFile, finalFile)
            let filePath = fs.existsSync(finalFile) ? finalFile : rawFile
            await conn.sendMessage(m.chat, {
              video: fs.readFileSync(filePath),
              mimetype: 'video/mp4',
              fileName: finalName,
              caption: '🎬 ' + finalTitle
            }, { quoted: m })
          }
        }
      }
    } finally {
      deleteFileSafe(rawFile)
      deleteFileSafe(finalFile)
    }

    await conn.sendMessage(m.chat, {
      image: { url: json.data.image || 'https://files.catbox.moe/r60c8l.jpg' },
      caption: '🎵 」\n\n💫 » Descarga completada\n\n🎧 » ' + finalTitle + '\n👤 » ' + (json.data.author || '') + '\n💎 » Restantes: ' + total
    }, { quoted: m })
    await m.react('✅')
    return true
  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, { text: '❌ Error: ' + e.message }, { quoted: m })
    await m.react('❌')
    return true
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|yt|youtube|musica|cancion)$/i
handler.desc = 'Busca y descarga música/video de YouTube 💎1'

export default handler