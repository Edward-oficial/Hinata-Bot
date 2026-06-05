import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'

const VIDEO_QUALITY = '720p'
const DELIRIUS_API = 'https://api.delirius.store'

const _processing = new Set()


function safeFileName(name) {
  return String(name || 'media').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'media'
}
function extractYouTubeUrl(text) {
  const m = String(text || '').match(/https?:\/\/(?:www\.)?(?:youtube\.com|music\.youtube\.com|youtu\.be)\/[^\s]+/i)
  return m ? m[0].trim() : ''
}
function isHttpUrl(v) { return /^https?:\/\//i.test(String(v || '')) }


function getDiamantes(user) {
  return user?.diamantes ?? user?.diamond ?? 0
}
function restarDiamante(user) {
  if (user.diamantes !== undefined) user.diamantes = (user.diamantes || 0) - 1
  else user.diamond = (user.diamond || 0) - 1
}
function devolverDiamante(user, anterior) {
  if (user.diamantes !== undefined) user.diamantes = anterior
  else user.diamond = anterior
}

async function searchYouTube(query) {
  const res = await fetch(`${DELIRIUS_API}/search/ytsearch?q=${encodeURIComponent(query)}`)
  const data = await res.json()
  if (!data.status || !data.data?.length) throw new Error('No se encontraron resultados.')
  const video = data.data[0]
  return {
    videoUrl: video.url,
    title: safeFileName(video.title || 'media'),
    thumbnail: video.thumbnail || video.image || '',
  }
}


async function sendVideo(conn, m, videoUrl, title) {
  const res = await fetch(`${DELIRIUS_API}/download/ytmp4?url=${encodeURIComponent(videoUrl)}`)
  const json = await res.json()
  if (!json.status || !json.data?.download) throw new Error('No se pudo obtener el video.')

  const finalTitle = safeFileName(json.data.title || title)
  try {
    await conn.sendMessage(m.chat, {
      video: { url: json.data.download },
      mimetype: 'video/mp4',
      fileName: `${finalTitle}.mp4`,
      caption: `🎬 ${finalTitle}\n🎚️ ${VIDEO_QUALITY}`,
    }, { quoted: m })
  } catch {
    await conn.sendMessage(m.chat, {
      document: { url: json.data.download },
      mimetype: 'video/mp4',
      fileName: `${finalTitle}.mp4`,
      caption: `🎬 ${finalTitle}\n🎚️ ${VIDEO_QUALITY}`,
    }, { quoted: m })
  }
  return finalTitle
}

async function sendAudio(conn, m, videoUrl, title) {
  const res = await fetch(`${DELIRIUS_API}/download/ytmp3?url=${encodeURIComponent(videoUrl)}`)
  const json = await res.json()
  if (!json.status || !json.data?.download) throw new Error('No se pudo obtener el audio.')

  const finalTitle = safeFileName(json.data.title || title)
  try {
    await conn.sendMessage(m.chat, {
      audio: { url: json.data.download },
      mimetype: 'audio/mpeg',
      ptt: false,
    }, { quoted: m })
  } catch {
    await conn.sendMessage(m.chat, {
      document: { url: json.data.download },
      mimetype: 'audio/mpeg',
      fileName: `${finalTitle}.mp3`,
      caption: `🎵 ${finalTitle}`,
    }, { quoted: m })
  }

  if (json.data.image) {
    await conn.sendMessage(m.chat, {
      image: { url: json.data.image },
      caption: `🎵 ${finalTitle}\n👤 ${json.data.author || ''}`,
    }, { quoted: m })
  }

  return finalTitle
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // anti-duplicados
  const msgKey = `main_${m.id || m.key?.id}`
  if (_processing.has(msgKey)) return
  _processing.add(msgKey)
  setTimeout(() => _processing.delete(msgKey), 15000)

  let user = global.db.data.users[m.sender]
  if (!user) {
    global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }
    user = global.db.data.users[m.sender]
  }

  const input = text?.trim()

  if (!input) {
    let media = null
    try {
      media = await prepareWAMessageMedia(
        { image: { url: 'https://files.catbox.moe/r60c8l.jpg' } },
        { upload: conn.waUploadToServer }
      )
    } catch {}

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'HINATA BOT - YOUTUBE',
        subtitle: 'Descarga música y videos',
        hasMediaAttachment: !!media,
        imageMessage: media?.imageMessage,
      },
      body: {
        text: `🎬 「 HINATA YOUTUBE 」 🎵\n\n💫 » Descarga audio o video de YouTube\n\n> ${usedPrefix}${command} <nombre o link>\n> Ejemplo: ${usedPrefix}${command} Naruto Opening 1\n> 💎 Cuesta 1 diamante por descarga`,
      },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🎬 YOUTUBE',
            sections: [{
              title: '¿Qué deseas descargar?',
              rows: [
                { header: '🎵 AUDIO', title: 'Descargar música (MP3)', description: '🎧 Alta calidad | 💎 1 diamante', id: 'ytchoose|audio' },
                { header: '🎬 VIDEO', title: 'Descargar video (MP4)', description: `📹 ${VIDEO_QUALITY} | 💎 1 diamante`, id: 'ytchoose|video' }
              ]
            }]
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

  if (isHttpUrl(input) && !extractYouTubeUrl(input)) {
    return conn.sendMessage(m.chat, { text: '❌ Envía un link válido de YouTube.' }, { quoted: m })
  }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    return conn.sendMessage(m.chat, {
      text: `🎬 「 HINATA YOUTUBE 」 🎵\n\n💫 » No tienes suficientes diamantes\n\n💎 Necesitas: 1 diamante\n💰 Tienes: ${diamantes} diamantes\n\n> Usa #work para ganar`
    }, { quoted: m })
  }

  await m.react('🔍')
  await conn.sendMessage(m.chat, { text: `🔍 Buscando: *${input}*...` }, { quoted: m })

  let videoUrl, title, thumbnail
  try {
    if (extractYouTubeUrl(input)) {
      videoUrl  = extractYouTubeUrl(input)
      title     = 'video'
      thumbnail = null
    } else {
      const search = await searchYouTube(input)
      videoUrl  = search.videoUrl
      title     = search.title
      thumbnail = search.thumbnail
    }
  } catch (e) {
    await m.react('❌')
    return conn.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m })
  }

  let media = null
  if (thumbnail) {
    try {
      media = await prepareWAMessageMedia(
        { image: { url: thumbnail } },
        { upload: conn.waUploadToServer }
      )
    } catch {}
  }

  const urlB64   = Buffer.from(videoUrl).toString('base64')
  const titleB64 = Buffer.from(title).toString('base64')

  const interactiveMessage = proto.Message.InteractiveMessage.create({
    header: {
      title: 'HINATA BOT - YOUTUBE',
      subtitle: title,
      hasMediaAttachment: !!media,
      imageMessage: media?.imageMessage,
    },
    body: {
      text: `🎬 「 HINATA YOUTUBE 」 🎵\n\n💫 » *${title}*\n\n> ¿Cómo deseas descargarlo?\n> 💎 1 diamante por descarga`,
    },
    footer: { text: '⫏⫏ HINATA BOT ✿' },
    nativeFlowMessage: {
      buttons: [{
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: '🎬 YOUTUBE',
          sections: [{
            title: '¿Qué deseas descargar?',
            rows: [
              { header: '🎵 AUDIO', title: 'Descargar música (MP3)', description: '🎧 Alta calidad | 💎 1 diamante', id: `ytdl~audio~${urlB64}~${titleB64}` },
              { header: '🎬 VIDEO', title: 'Descargar video (MP4)', description: `📹 ${VIDEO_QUALITY} | 💎 1 diamante`, id: `ytdl~video~${urlB64}~${titleB64}` }
            ]
          }]
        })
      }]
    }
  })

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
  }, { quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  await m.react('✅')
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

  if (id === 'ytchoose|audio' || id === 'ytchoose|video') {
    const tipo = id === 'ytchoose|audio' ? '🎵 audio' : '🎬 video'
    await conn.sendMessage(m.chat, {
      text: `${tipo}\n\n💫 » Escribe el nombre o link así:\n> .yt Naruto Opening 1`
    }, { quoted: m })
    return true
  }

  if (!id.startsWith('ytdl~')) return false

  const parts = id.split('~')

  if (parts.length < 4) {
    await conn.sendMessage(m.chat, { text: '❌ Error al procesar la selección.' }, { quoted: m })
    return true
  }

  const tipo     = parts[1]
  const urlB64   = parts[2]
  const titleB64 = parts[3]

  let videoUrl, title
  try {
    videoUrl = Buffer.from(urlB64, 'base64').toString()
    title    = Buffer.from(titleB64, 'base64').toString()
  } catch {
    await conn.sendMessage(m.chat, { text: '❌ Error al procesar la selección.' }, { quoted: m })
    return true
  }

  let user = global.db.data.users[m.sender]
  if (!user) {
    global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }
    user = global.db.data.users[m.sender]
  }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    await conn.sendMessage(m.chat, {
      text: `🎬 「 HINATA YOUTUBE 」 🎵\n\n💫 » No tienes suficientes diamantes\n\n💎 Necesitas: 1 diamante\n💰 Tienes: ${diamantes} diamantes\n\n> Usa #work para ganar`
    }, { quoted: m })
    return true
  }

  restarDiamante(user)
  const restantes = getDiamantes(user)

  await m.react('⏳')
  await conn.sendMessage(m.chat, {
    text: tipo === 'audio'
      ? `🎵 *Descargando audio...*\n🎧 ${title}\n💎 -1 diamante\n⏳ Espera un momento...`
      : `🎬 *Descargando video...*\n📹 ${title} (${VIDEO_QUALITY})\n💎 -1 diamante\n⏳ Espera un momento...`
  }, { quoted: m })

  try {
    let finalTitle
    if (tipo === 'audio') {
      finalTitle = await sendAudio(conn, m, videoUrl, title)
    } else {
      finalTitle = await sendVideo(conn, m, videoUrl, title)
    }

    await conn.sendMessage(m.chat, {
      text: `✅ *Descarga completada*\n\n${tipo === 'audio' ? '🎵' : '🎬'} » ${finalTitle || title}\n💎 » Diamantes restantes: ${restantes}`
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    devolverDiamante(user, diamantes)
    console.error('[YT ERROR]', e.message)
    await m.react('❌')
    const rawMsg = String(e?.message || '').toLowerCase()
    const humanMsg = (rawMsg.includes('502') || rawMsg.includes('503') || rawMsg.includes('bad gateway'))
      ? '⚠️ El servidor está saturado.\n🔁 Intenta más tarde.\n💎 Diamante devuelto.'
      : `❌ ${e.message || 'Error al descargar.'}\n💎 Diamante devuelto.`
    await conn.sendMessage(m.chat, { text: humanMsg }, { quoted: m })
  }

  return true
}

handler.help    = ['yt', 'play', 'video']
handler.tags    = ['downloader']
handler.command = /^(yt|ytmp3|ytmp4|video|mp3|song|play)$/i
handler.desc    = 'Descarga audio o video de YouTube 💎1'

export default handler
