import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EDWARD_API = 'https://dv-edward-api.onrender.com/api'
const EDWARD_KEY = 'edward'

const _processing = new Set()

function safeFileName(name) {
  return String(name || 'media').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'media'
}
function extractYouTubeUrl(text) {
  const m = String(text || '').match(/https?:\/\/(?:www\.)?(?:youtube\.com|music\.youtube\.com|youtu\.be)\/[^\s]+/i)
  return m ? m[0].trim() : ''
}
function isHttpUrl(v) { return /^https?:\/\//i.test(String(v || '')) }

function getDiamantes(user) { return user?.diamantes ?? user?.diamond ?? 0 }
function restarDiamante(user) {
  if (user.diamantes !== undefined) user.diamantes = (user.diamantes || 0) - 1
  else user.diamond = (user.diamond || 0) - 1
}
function devolverDiamante(user, anterior) {
  if (user.diamantes !== undefined) user.diamantes = anterior
  else user.diamond = anterior
}

async function downloadFile(url, outputPath) {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  fs.writeFileSync(outputPath, Buffer.from(buffer))
}

function repairVideoWithFFmpeg(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-fflags', '+genpts',
      '-i', inputPath,
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-pix_fmt', 'yuv420p',
      '-preset', 'veryfast',
      '-crf', '23',
      '-movflags', '+faststart',
      '-max_muxing_queue_size', '1024',
      outputPath
    ]

    const proc = spawn('ffmpeg', args)

    let stderr = ''
    proc.stderr.on('data', (d) => { stderr += d.toString() })

    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve()
      } else {
        reject(new Error(`ffmpeg salió con código ${code}\n${stderr.slice(-800)}`))
      }
    })

    proc.on('error', (err) => {
      reject(new Error(`No se pudo ejecutar ffmpeg: ${err.message}`))
    })
  })
}

async function sendVideo(conn, m, videoUrl, title) {
  const res = await fetch(`${EDWARD_API}/download/ytvideo?url=${encodeURIComponent(videoUrl)}&apiKey=${EDWARD_KEY}`)
  const json = await res.json()

  if (!json.status || !json.result?.download_url) throw new Error('No se pudo obtener el video.')

  const finalTitle = safeFileName(json.result.title || title)
  const quality = json.result.quality || '360p'
  const tempDir = path.join(__dirname, 'temp')
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

  const inputPath = path.join(tempDir, `${Date.now()}_input.mp4`)
  const outputPath = path.join(tempDir, `${Date.now()}_output.mp4`)

  try {
    await downloadFile(json.result.download_url, inputPath)

    const inputStats = fs.statSync(inputPath)
    if (inputStats.size < 10000) throw new Error('El archivo descargado esta vacio o corrupto.')

    await conn.sendMessage(m.chat, {
      text: `Reparando video para WhatsApp...\n*_${finalTitle}_*`
    }, { quoted: m })

    await repairVideoWithFFmpeg(inputPath, outputPath)

    const stats = fs.statSync(outputPath)
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2)

    await conn.sendMessage(m.chat, {
      video: { url: outputPath },
      caption: `*_${finalTitle}_*\nCalidad: *_${quality}_*\nTamaño: *_${fileSizeMB}MB_*`,
      mimetype: 'video/mp4',
      fileName: finalTitle + '.mp4'
    }, { quoted: m })

    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)

    return finalTitle
  } catch (error) {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
    throw error
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const msgKey = `main_${m.id || m.key?.id}`
  if (_processing.has(msgKey)) return
  _processing.add(msgKey)
  setTimeout(() => _processing.delete(msgKey), 15000)

  let user = global.db.data.users[m.sender]
  if (!user) { global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }; user = global.db.data.users[m.sender] }

  const input = text?.trim()

  if (!input) {
    let media = null
    try { media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/r60c8l.jpg' } }, { upload: conn.waUploadToServer }) } catch {}

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'HINATA BOT - VIDEO', subtitle: 'Descarga video de YouTube', hasMediaAttachment: !!media, imageMessage: media?.imageMessage },
      body: { text: `*_VIDEO_*\n\nBusca y descarga video de YouTube\nCalidad original\n\nUso: *_${usedPrefix}${command} <nombre o link>_*\nEjemplo: *_${usedPrefix}${command} Naruto Opening 1_*\n\n*_Cuesta 1 diamante por descarga_*\n\n➮ API by Edward` },
      footer: { text: 'HINATA BOT' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: 'VIDEO', sections: [{ title: 'Que deseas hacer', rows: [{ header: 'BUSCAR', title: 'Buscar video', description: 'Escribe el nombre despues del comando', id: 'ytinfo' }] }] }) }] }
    })
    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }

  if (isHttpUrl(input) && !extractYouTubeUrl(input)) {
    return conn.sendMessage(m.chat, { text: 'Envia un link valido de YouTube.' }, { quoted: m })
  }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    return conn.sendMessage(m.chat, {
      text: `*_VIDEO_*\n\nNo tienes suficientes diamantes\nNecesitas: *_1_* | Tienes: *_${diamantes}_*\n\n➮ Usa work para ganar diamantes\n\n➮ API by Edward`
    }, { quoted: m })
  }

  await m.react('🔍')

  if (extractYouTubeUrl(input)) {
    const videoUrl = extractYouTubeUrl(input)
    return _descargarVideo(conn, m, videoUrl, 'video')
  }

  try {
    const res = await fetch(`${EDWARD_API}/search/youtube?apiKey=${EDWARD_KEY}&query=${encodeURIComponent(input)}`)
    const data = await res.json()

    if (!data.status || !data.data?.length) throw new Error('No se encontraron resultados')

    const resultados = data.data.slice(0, 10)
    let media = null
    if (resultados[0]?.thumbnail) {
      try { media = await prepareWAMessageMedia({ image: { url: resultados[0].thumbnail } }, { upload: conn.waUploadToServer }) } catch {}
    }

    const rows = resultados.map((v, i) => ({
      header: String(v.author || 'Desconocido').slice(0, 20),
      title: String(v.title || '').slice(0, 35),
      description: `Duracion: ${v.duration || '?'} | Vistas: ${v.views || '?'}`,
      id: `ytsel~${Buffer.from(v.url).toString('base64')}~${Buffer.from(String(v.title || 'video')).toString('base64')}`
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'HINATA BOT - VIDEO', subtitle: `Resultados: ${input}`, hasMediaAttachment: !!media, imageMessage: media?.imageMessage },
      body: { text: `*_RESULTADOS_*\n\nBusqueda: *_${input}_*\n*_${resultados.length}_* resultados encontrados\n\nElige el que quieras descargar\n*_Cuesta 1 diamante_*\nCalidad original\n\n➮ API by Edward` },
      footer: { text: 'HINATA BOT' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: 'RESULTADOS', sections: [{ title: input.toUpperCase().slice(0, 24), rows }] }) }] }
    })
    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    conn.sendMessage(m.chat, { text: `Error: ${e.message}` }, { quoted: m })
  }
}

async function _descargarVideo(conn, m, videoUrl, title) {
  let user = global.db.data.users[m.sender]
  if (!user) { global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }; user = global.db.data.users[m.sender] }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    await conn.sendMessage(m.chat, {
      text: `*_VIDEO_*\n\nNo tienes suficientes diamantes\nNecesitas: *_1_* | Tienes: *_${diamantes}_*\n\n➮ Usa work para ganar diamantes\n\n➮ API by Edward`
    }, { quoted: m })
    return
  }

  restarDiamante(user)
  const restantes = getDiamantes(user)

  await m.react('⏳')
  await conn.sendMessage(m.chat, {
    text: `Descargando video...\n*_${title}_*\n*-1 diamante_*\nEspera un momento...\n\n➮ API by Edward`
  }, { quoted: m })

  try {
    const finalTitle = await sendVideo(conn, m, videoUrl, title)
    await conn.sendMessage(m.chat, {
      text: `*_Descarga completada_*\n\n*_${finalTitle || title}_*\nDiamantes restantes: *_${restantes}_*\n\n➮ API by Edward`
    }, { quoted: m })
    await m.react('✅')
  } catch (e) {
    devolverDiamante(user, diamantes)
    console.error('[YT VIDEO ERROR]', e.message)
    await m.react('❌')
    await conn.sendMessage(m.chat, { text: `Error: ${e.message || 'Error al descargar.'}\n*_Diamante devuelto_*` }, { quoted: m })
  }
}

handler.before = async (m, { conn }) => {
  if (m.isBaileys) return false

  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  const msgKey = `before_${m.id || m.key?.id}`
  if (_processing.has(msgKey)) return true
  _processing.add(msgKey)
  setTimeout(() => _processing.delete(msgKey), 30000)

  let id
  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    id = data.id || data.selectedId || data.selectedRowId || null
  } catch { return false }

  if (!id) return false

  if (id === 'ytinfo') {
    await conn.sendMessage(m.chat, { text: '➮ Escribe el nombre del video:\n> *_ .video Naruto Opening 1_*' }, { quoted: m })
    return true
  }

  if (id.startsWith('ytsel~')) {
    const parts = id.split('~')
    if (parts.length < 3) return true
    const urlB64   = parts[1]
    const titleB64 = parts[2]
    let videoUrl, title
    try {
      videoUrl = Buffer.from(urlB64, 'base64').toString()
      title    = Buffer.from(titleB64, 'base64').toString()
    } catch { return true }

    await _descargarVideo(conn, m, videoUrl, title)
    return true
  }

  return false
}

handler.help    = ['video']
handler.tags    = ['downloader']
handler.command = /^(video|mp4|ytvideo)$/i
handler.desc    = 'Descarga video de YouTube'

export default handler