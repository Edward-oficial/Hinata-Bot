import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'

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
        title: 'HINATA BOT - SPOTIFY',
        subtitle: 'Busca y descarga música',
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      },
      body: {
        text: '🟢 「 HINATA SPOTIFY 」 🟢\n\n💫 » Busca música en Spotify\n\n> ' + usedPrefix + command + ' <nombre>\n> Ejemplo: ' + usedPrefix + command + ' Aventura Amor de Madre\n> 💎 Cuesta 1 diamante por descarga'
      },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🎵 SPOTIFY',
            sections: [{
              title: '🔍 BUSCAR',
              rows: [{
                header: '🎧 MÚSICA',
                title: 'Buscar canción',
                description: '💎 1 diamante | Ejemplo: Aventura',
                id: 'spot '
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

  if ((user.diamantes || user.diamond || 0) < 1) {
    return conn.sendMessage(m.chat, {
      text: '🟢 「 HINATA SPOTIFY 」 🟢\n\n💫 » No tienes suficientes diamantes\n\n💎 Necesitas: 1 diamante\n💰 Tienes: ' + (user.diamantes || user.diamond || 0) + ' diamantes\n\n> Usa #work para ganar'
    }, { quoted: m })
  }

  await m.react('🔍')

  try {
    let searchUrl = `https://api.yupra.my.id/api/search/spotify?q=${encodeURIComponent(text)}`
    let searchRes = await fetch(searchUrl)
    let searchData = await searchRes.json()

    if (!searchData.status || !searchData.result?.length) {
      throw new Error('No se encontraron resultados')
    }

    let resultados = searchData.result.slice(0, 10)
    let primeraImagen = resultados[0].album?.images?.[0]?.url || ''

    let media = null
    if (primeraImagen) {
      media = await prepareWAMessageMedia({ image: { url: primeraImagen } }, { upload: conn.waUploadToServer })
    }

    let rows = resultados.map((track, i) => {
      let artistas = track.artists?.map(a => a.name).join(', ') || 'Desconocido'
      let duracion = Math.floor((track.duration_ms || 0) / 1000)
      let min = Math.floor(duracion / 60)
      let seg = duracion % 60
      return {
        header: '🎵 ' + artistas,
        title: track.name.substring(0, 35),
        description: '⏱️ ' + min + ':' + seg.toString().padStart(2, '0'),
        id: 'spot_' + i + '_' + Buffer.from(track.url).toString('base64') + '_' + Buffer.from(track.name).toString('base64')
      }
    })

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'HINATA BOT - SPOTIFY',
        subtitle: 'Selecciona una canción',
        hasMediaAttachment: !!media,
        imageMessage: media ? media.imageMessage : undefined
      },
      body: {
        text: '🟢 「 HINATA SPOTIFY 」 🟢\n\n💫 » Búsqueda: ' + text + '\n\n> Elige una canción\n> 💎 1 diamante al descargar'
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
    if (!id || !id.startsWith('spot_')) return false

    let who = m.sender
    let user = global.db.data.users[who]
    if (!user) {
      global.db.data.users[who] = { diamantes: 0, diamond: 0 }
      user = global.db.data.users[who]
    }

    let misDiamantes = user.diamantes || user.diamond || 0
    if (misDiamantes < 1) {
      await conn.sendMessage(m.chat, { text: '🟢 「 HINATA SPOTIFY 」 🟢\n\n💫 » No tienes 1 diamante\n\n> Usa #work para ganar' }, { quoted: m })
      return true
    }

    let parts = id.split('_')
    let urlBase64 = parts[2]
    let titleBase64 = parts[3]
    let spotifyUrl = Buffer.from(urlBase64, 'base64').toString()
    let titulo = Buffer.from(titleBase64, 'base64').toString()

    if (user.diamantes !== undefined) {
      user.diamantes = misDiamantes - 1
    } else {
      user.diamond = misDiamantes - 1
    }

    await m.react('⏳')
    await conn.sendMessage(m.chat, { text: '⏳ Descargando...\n💎 -1 diamante' }, { quoted: m })

    let downloadUrl = `https://api.yupra.my.id/api/downloader/spotify?url=${encodeURIComponent(spotifyUrl)}`
    let res = await fetch(downloadUrl)
    let json = await res.json()

    if (!json.status || !json.result?.download?.url) {
      if (user.diamantes !== undefined) {
        user.diamantes = misDiamantes
      } else {
        user.diamond = misDiamantes
      }
      throw new Error('No se pudo descargar, diamantes devueltos')
    }

    let total = user.diamantes !== undefined ? user.diamantes : (user.diamond || 0)

    await conn.sendMessage(m.chat, {
      audio: { url: json.result.download.url },
      mimetype: 'audio/mpeg',
      fileName: (json.result.title || titulo) + '.mp3'
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      image: { url: json.result.image || 'https://files.catbox.moe/r60c8l.jpg' },
      caption: '🟢 「 HINATA SPOTIFY 」 🟢\n\n💫 » Descarga completada\n\n🎵 » ' + (json.result.title || titulo) + '\n👤 » ' + (json.result.artist || '') + '\n💎 » Restantes: ' + total
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

handler.help = ['spotify']
handler.tags = ['downloader']
handler.command = /^(spotify|sp)$/i
handler.desc = 'Busca y descarga música de Spotify 💎1'

export default handler