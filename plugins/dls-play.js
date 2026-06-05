import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { pipeline } from 'stream/promises'
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'

const TEMP_DIR = path.join(process.cwd(), 'tmp')
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })

const MAX_VIDEO_BYTES = 1500 * 1024 * 1024
const VIDEO_AS_DOCUMENT_THRESHOLD = 70 * 1024 * 1024

function safeFileName(name) {
  return String(name || 'video').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'video'
}

function deleteFileSafe(fp) {
  try { if (fp && fs.existsSync(fp)) fs.unlinkSync(fp) } catch {}
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { diamantes: 0 }
    user = global.db.data.users[who]
  }

  if (!text) {
    let media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/r60c8l.jpg' } }, { upload: conn.waUploadToServer })

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'HINATA BOT - PLAY',
        subtitle: 'Busca y descarga de YouTube',
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      },
      body: {
        text: '🎵 「 HINATA PLAY 」 🎵\n\n💫 » Busca música y videos en YouTube\n\n> ' + usedPrefix + command + ' <nombre>\n> Ejemplo: ' + usedPrefix + command + ' Twice\n> 💎 Cuesta 1 diamante por descarga'
      },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🎵 YOUTUBE',
            sections: [{
              title: '🔍 BUSCAR',
              rows: [{
                header: '🎧 MÚSICA',
                title: 'Buscar canción',
                description: '💎 1 diamante | Ejemplo: Twice',
                id: 'play '
              }]
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

  await m.react('🔍')

  try {
    let searchUrl = `https://api.delirius.store/search/ytsearch?q=${encodeURIComponent(text)}`
    let searchRes = await fetch(searchUrl)
    let searchData = await searchRes.json()

    if (!searchData.status || !searchData.data?.length) throw new Error('No se encontraron resultados')

    let resultados = searchData.data.slice(0, 10)
    let primeraImagen = resultados[0].thumbnail || resultados[0].image || ''

    let media = null
    if (primeraImagen) {
      media = await prepareWAMessageMedia({ image: { url: primeraImagen } }, { upload: conn.waUploadToServer })
    }

    let rows = resultados.map((video, i) => ({
      header: '🎵 ' + (video.author?.name || 'Desconocido'),
      title: video.title.substring(0, 35),
      description: '⏱️ ' + (video.duration || '?') + ' | 👁️ ' + (video.views?.toLocaleString() || '?'),
      id: 'ytplay_' + i + '_' + Buffer.from(video.url).toString('base64') + '_' + Buffer.from(video.title).toString('base64')
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'HINATA BOT - PLAY',
        subtitle: 'Selecciona una canción',
        hasMediaAttachment: !!media,
        imageMessage: media ? media.imageMessage : undefined
      },
      body: {
        text: '🎵 「 HINATA PLAY 」 🎵\n\n💫 » Búsqueda: ' + text + '\n\n> Elige una canción\n> 💎 1 diamante al descargar'
      },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🎵 RESULTADOS',
            sections: [{ title: '📋 ' + text.toUpperCase(), rows }]
          })
        }]
      }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
    }, { quoted: m })

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
    if (!user) {
      global.db.data.users[who] = { diamantes: 0, diamond: 0 }
      user = global.db.data.users[who]
    }

    let misDiamantes = user.diamantes || user.diamond || 0
    if (misDiamantes < 1) {
      await conn.sendMessage(m.chat, { text: '🎵 」\n\n💫 » No tienes 1 diamante\n\n> Usa #work para ganar' }, { quoted: m })
      return true
    }

    let parts = id.split('_')
    let urlBase64 = parts[2]
    let titleBase64 = parts[3]
    let videoUrl = Buffer.from(urlBase64, 'base64').toString()
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
      body: { text: '🎵 「 HINATA PLAY 」 🎵\n\n💫 » Elige el formato\n\n🎧 MP3 | 🎬 MP4\n💎 1 diamante' },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '📥 DESCARGAR',
            sections: sections
          })
        }]
      }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return true

  } catch (e) {
    console.log(e)
    return false
  }
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
    if (!user) {
      global.db.data.users[who] = { diamantes: 0, diamond: 0 }
      user = global.db.data.users[who]
    }

    let misDiamantes = user.diamantes || user.diamond || 0
    if (misDiamantes < 1) {
      await conn.sendMessage(m.chat, { text: '🎵 」\n\n💫 » No tienes 1 diamante' }, { quoted: m })
      return true
    }

    let parts = id.split('_')
    let tipo = parts[1]
    let urlBase64 = parts[2]
    let titleBase64 = parts[3]
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

    if (tipo === 'mp3') {
      let audioRes = await axios.get(downloadUrl, { responseType: 'arraybuffer', timeout: 120000 })
      await conn.sendMessage(m.chat, {
        audio: Buffer.from(audioRes.data),
        mimetype: 'audio/mpeg',
        fileName: finalTitle + '.mp3'
      }, { quoted: m })
    } else {
      let rawFile = path.join(TEMP_DIR, `yt_${Date.now()}.mp4`)
      
      try {
        let videoRes = await axios.get(downloadUrl, {
          responseType: 'stream',
          timeout: 120000,
          headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': '*/*' }
        })

        await pipeline(videoRes.data, fs.createWriteStream(rawFile))

        if (!fs.existsSync(rawFile)) throw new Error('No se pudo guardar el video')

        let size = fs.statSync(rawFile).size
        if (!size || size < 1000) throw new Error('Video vacío')

        if (size > VIDEO_AS_DOCUMENT_THRESHOLD) {
          await conn.sendMessage(m.chat, {
            document: { url: rawFile },
            mimetype: 'video/mp4',
            fileName: finalTitle + '.mp4',
            caption: '🎬 ' + finalTitle + '\n📦 Video grande enviado como documento'
          }, { quoted: m })
        } else {
          try {
            await conn.sendMessage(m.chat, {
              video: { url: rawFile },
              mimetype: 'video/mp4',
              fileName: finalTitle + '.mp4',
              caption: '🎬 ' + finalTitle
            }, { quoted: m })
          } catch {
            await conn.sendMessage(m.chat, {
              document: { url: rawFile },
              mimetype: 'video/mp4',
              fileName: finalTitle + '.mp4',
              caption: '🎬 ' + finalTitle
            }, { quoted: m })
          }
        }

      } finally {
        deleteFileSafe(rawFile)
      }
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