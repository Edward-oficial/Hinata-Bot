import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  try {
    // Validamos que haya una imagen
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image/.test(mime)) {
      return conn.reply(
        m.chat,
        '🖼️ Responde a una imagen con *.hd* para mejorar su calidad.',
        m
      )
    }

    await conn.reply(m.chat, '⏳ Mejorando la calidad de la imagen...', m)

    // Descargamos la imagen
    let media = await q.download()
    let tempFile = path.join('./', `temp_${Date.now()}.jpg`)
    fs.writeFileSync(tempFile, media)

    // Subimos la imagen a la API de ejemplo (puedes usar tu propia API)
    let formData = new FormData()
    formData.append('image', fs.createReadStream(tempFile))

    let res = await fetch('https://api.waifu.pics/sfw/hd', { // Aquí va tu API real
      method: 'POST',
      body: formData
    })

    let json = await res.json()
    if (!json.url) throw '❌ No se pudo mejorar la imagen.'

    // Enviamos la imagen HD al chat
    await conn.sendMessage(
      m.chat,
      {
        image: { url: json.url },
        caption: '✨ Imagen mejorada a HD 🌸 Elyssia Bot MD'
      },
      { quoted: m }
    )

    // Borramos el archivo temporal
    fs.unlinkSync(tempFile)
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Ocurrió un error al mejorar la imagen.', m)
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['hd']

export default handler