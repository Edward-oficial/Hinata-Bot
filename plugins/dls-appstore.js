// © 2026 EL VIGILANTE & BRAYANRK - HINATA BOT
// No quitar créditos

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const query = text?.trim()

  if (!query) return conn.sendMessage(m.chat, {
    text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ Busca apps en la App Store\n\n> ${usedPrefix}${command} <nombre de la app>\n> Ejemplo: ${usedPrefix}${command} WhatsApp`
  }, { quoted: m })

  await m.react('🔍')

  try {
    const res = await fetch(`https://api.delirius.store/search/appstore?q=${encodeURIComponent(query)}`)
    const json = await res.json()

    if (!json || !Array.isArray(json) || json.length === 0) {
      await m.react('❌')
      return conn.sendMessage(m.chat, {
        text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ No se encontraron resultados\n\n> No hay apps para *${query}*`
      }, { quoted: m })
    }

    const app = json[0]
    const precio = app.price === 0 ? 'Gratis' : `${app.price} ${app.currency || ''}`
    const score = app.score ? `⭐ ${Number(app.score).toFixed(1)}` : 'Sin calificación'
    const reviews = app.reviews ? `${app.reviews} reseñas` : ''
    const size = app.size || 'Desconocido'
    const version = app.version || 'Desconocida'
    const developer = app.developer || 'Desconocido'
    const genre = Array.isArray(app.genre) ? app.genre.join(', ') : app.genre || ''
    const updated = app.updated || ''
    const rating = app.rating || ''

    const caption = `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ *${app.title}*\n\n❀ Developer: *${developer}*\n❀ Categoría: *${genre}*\n❀ Versión: *${version}*\n❀ Tamaño: *${size}*\n❀ Precio: *${precio}*\n❀ Calificación: *${score}* (${reviews})\n❀ Clasificación: *${rating}*\n❀ Actualizado: *${updated}*\n\n> 🔗 ${app.url}`

    if (app.image) {
      await conn.sendMessage(m.chat, {
        image: { url: app.image },
        caption
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
    }

    await m.react('✅')

  } catch (e) {
    await m.react('❌')
    await conn.sendMessage(m.chat, {
      text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Error al buscar\n\n> ${e.message}`
    }, { quoted: m })
  }
}

handler.help = ['appstore']
handler.tags = ['downloader']
handler.command = /^(appstore|applestore|ipa)$/i
handler.desc = 'Busca apps en la App Store'

export default handler
