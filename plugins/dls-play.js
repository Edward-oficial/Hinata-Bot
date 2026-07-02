import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'

// ========== API de Edward ==========
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

// ========== sendAudio con ENDPOINT CORRECTO ==========
async function sendAudio(conn, m, videoUrl, title) {
  // ✅ ENDPOINT CORRECTO: /download/ytaudio
  const res = await fetch(`${EDWARD_API}/download/ytaudio?url=${encodeURIComponent(videoUrl)}&apiKey=${EDWARD_KEY}`)
  const json = await res.json()
  
  if (!json.status || !json.result?.download_url) throw new Error('No se pudo obtener el audio.')
  
  const finalTitle = safeFileName(json.result.title || title)

  await conn.sendMessage(m.chat, {
    audio: { url: json.result.download_url },
    mimetype: 'audio/mpeg',
    fileName: finalTitle + '.mp3'
  }, { quoted: m })

  if (json.result.thumbnail) {
    await conn.sendMessage(m.chat, {
      image: { url: json.result.thumbnail },
      caption: `🎵 ${finalTitle}\n\n> 🎧 API by Edward\n> 🔗 https://dv-edward-api.onrender.com`
    }, { quoted: m })
  }

  return finalTitle
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
      header: { title: 'HINATA BOT - YOUTUBE', subtitle: 'Descarga música de YouTube', hasMediaAttachment: !!media, imageMessage: media?.imageMessage },
      body: { text: `🎵 「 HINATA YOUTUBE 」 🎵\n\n💫 » Descarga audio de YouTube\n\n> ${usedPrefix}${command} <nombre o link>\n> Ejemplo: ${usedPrefix}${command} Naruto Opening 1\n> 💎 Cuesta 1 diamante por descarga\n\n> 🎧 API by Edward\n> 🔗 https://dv-edward-api.onrender.com` },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '🎵 YOUTUBE', sections: [{ title: '¿Qué deseas hacer?', rows: [{ header: '🔍 BUSCAR', title: 'Buscar música', description: 'Escribe el nombre después del comando', id: 'ytinfo' }] }] }) }] }
    })
    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }

  if (isHttpUrl(input) && !extractYouTubeUrl(input)) {
    return conn.sendMessage(m.chat, { text: '❌ Envía un link válido de YouTube.' }, { quoted: m })
  }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    return conn.sendMessage(m.chat, {
      text: `🎵 「 HINATA YOUTUBE 」\n\n💫 » No tienes suficientes diamantes\n💎 Necesitas: 1 | Tienes: ${diamantes}\n\n> Usa #work para ganar\n\n> 🎧 API by Edward\n> 🔗 https://dv-edward-api.onrender.com`
    }, { quoted: m })
  }

  await m.react('🔍')

  if (extractYouTubeUrl(input)) {
    const videoUrl = extractYouTubeUrl(input)
    return _descargarAudio(conn, m, videoUrl, 'video')
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
      description: `⏱️ ${v.duration || '?'} | 👁️ ${v.views || '?'}`,
      id: `ytsel~${Buffer.from(v.url).toString('base64')}~${Buffer.from(String(v.title || 'video')).toString('base64')}`
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'HINATA BOT - YOUTUBE', subtitle: `Resultados: ${input}`, hasMediaAttachment: !!media, imageMessage: media?.imageMessage },
      body: { text: `🔍 「 RESULTADOS 」\n\n💫 » Búsqueda: *${input}*\n📋 ${resultados.length} resultados encontrados\n\n> Elige el que quieras descargar\n> 💎 1 diamante\n\n> 🎧 API by Edward\n> 🔗 https://dv-edward-api.onrender.com` },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '🎵 RESULTADOS', sections: [{ title: `📋 ${input.toUpperCase().slice(0, 24)}`, rows }] }) }] }
    })
    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    conn.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m })
  }
}

async function _descargarAudio(conn, m, videoUrl, title) {
  let user = global.db.data.users[m.sender]
  if (!user) { global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }; user = global.db.data.users[m.sender] }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    await conn.sendMessage(m.chat, {
      text: `🎵 「 HINATA YOUTUBE 」\n\n💫 » No tienes suficientes diamantes\n💎 Necesitas: 1 | Tienes: ${diamantes}\n\n> Usa #work para ganar\n\n> 🎧 API by Edward\n> 🔗 https://dv-edward-api.onrender.com`
    }, { quoted: m })
    return
  }

  restarDiamante(user)
  const restantes = getDiamantes(user)

  await m.react('⏳')
  await conn.sendMessage(m.chat, {
    text: `🎵 *Descargando audio...*\n🎧 ${title}\n💎 -1 diamante\n⏳ Espera un momento...\n\n> 🎧 API by Edward`
  }, { quoted: m })

  try {
    const finalTitle = await sendAudio(conn, m, videoUrl, title)
    await conn.sendMessage(m.chat, {
      text: `✅ *Descarga completada*\n\n🎵 » ${finalTitle || title}\n💎 » Diamantes restantes: ${restantes}\n\n> 🎧 API by Edward\n> 🔗 https://dv-edward-api.onrender.com`
    }, { quoted: m })
    await m.react('✅')
  } catch (e) {
    devolverDiamante(user, diamantes)
    console.error('[YT ERROR]', e.message)
    await m.react('❌')
    await conn.sendMessage(m.chat, { text: `❌ ${e.message || 'Error al descargar.'}\n💎 Diamante devuelto.` }, { quoted: m })
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
    await conn.sendMessage(m.chat, { text: '🔍 Escribe el nombre así:\n> .yt Naruto Opening 1' }, { quoted: m })
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

    await _descargarAudio(conn, m, videoUrl, title)
    return true
  }

  return false
}

handler.help    = ['yt', 'play', 'audio']
handler.tags    = ['downloader']
handler.command = /^(yt|ytmp3|audio|mp3|song|play|musica|cancion)$/i
handler.desc    = 'Descarga audio de YouTube 💎1 | API by Edward'

export default handler