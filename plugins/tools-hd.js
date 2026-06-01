import fetch from 'node-fetch'

let cooldown = new Map()

let handler = async (m, { conn, usedPrefix, command }) => {
  let id = m.sender

  if (cooldown.has(id)) {
    let time = cooldown.get(id) - Date.now()
    if (time > 0) {
      return conn.reply(m.chat, `⏳ Espera ${Math.ceil(time / 1000)}s para volver a usar HD`, m)
    }
  }

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!/image/.test(mime)) {
    return conn.reply(m.chat, `🖼️ Responde a una imagen con *${usedPrefix + command}*`, m)
  }

  cooldown.set(id, Date.now() + 15000)

  await conn.reply(m.chat, `🌸 Elyssia Bot MD\n\n✨ Mejorando imagen a HD...`, m)

  try {
    let media = await q.download()

    let form = new FormData()
    form.append('file', new Blob([media]), 'image.jpg')
    form.append('scale', '2')
    form.append('format', 'auto')

    let res = await fetch('https://api.dvyer.dev/image/hd/upload', {
      method: 'POST',
      body: form
    })

    if (!res.ok) throw new Error('Error en la API')

    let buffer = Buffer.from(await res.arrayBuffer())

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `🌸 *ELYSSIA BOT MD*\n✨ Imagen mejorada en HD`
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    conn.reply(m.chat, '❌ Error al mejorar la imagen.', m)
    cooldown.delete(id)
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['hd', 'remini']

export default handler