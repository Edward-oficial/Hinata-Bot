import fetch from 'node-fetch'
import FormData from 'form-data'

let cooldown = new Map()

let handler = async (m, { conn, usedPrefix, command }) => {
  const id = m.sender

  if (cooldown.has(id)) {
    const time = cooldown.get(id) - Date.now()
    if (time > 0) return conn.reply(m.chat, `⏳ Espera ${Math.ceil(time/1000)}s para volver a usar HD`, m)
  }

  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!/image/.test(mime)) return conn.reply(m.chat, `🖼️ Responde a una imagen con *${usedPrefix + command}*`, m)

  cooldown.set(id, Date.now() + 15000) // 15 segundos

  await conn.reply(m.chat, `🌸 Elyssia Bot MD\n\n✨ Mejorando imagen a HD...`, m)

  try {
    // Descarga la imagen
    const stream = await q.download()
    const buffer = Buffer.from([])
    for await (const chunk of stream) buffer.push(chunk)
    
    // FormData
    const form = new FormData()
    form.append('file', buffer, { filename: 'image.jpg' })
    form.append('scale', '2')
    form.append('format', 'auto')

    // Llamada API DVYER
    const res = await fetch('https://api.dvyer.dev/image/hd/upload', {
      method: 'POST',
      body: form
    })

    if (!res.ok) throw new Error(`Error en la API: ${res.status}`)

    const resultBuffer = Buffer.from(await res.arrayBuffer())

    // Envía la imagen mejorada
    await conn.sendMessage(m.chat, {
      image: resultBuffer,
      caption: `🌸 *ELYSSIA BOT MD*\n✨ Imagen mejorada en HD`
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    cooldown.delete(id)
    conn.reply(m.chat, `❌ Error al mejorar la imagen.\n${e.message}`, m)
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['hd', 'remini']

export default handler