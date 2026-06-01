import fetch from 'node-fetch'
import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    // Verificamos que haya una imagen
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
    let tempFile = `temp_${Date.now()}.jpg`
    fs.writeFileSync(tempFile, media)

    // Convertimos la imagen a base64
    let b64 = fs.readFileSync(tempFile, { encoding: 'base64' })

    // Llamada a la API de Mitsuki
    let res = await fetch('https://api.mitsukiapi.xyz/image/hd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'sk-b9c406e478c20c53a588ea4b875339fff5d60464d52b05f795a54e4b94554ef5' // Tu API Key
      },
      body: JSON.stringify({ image: `data:image/jpeg;base64,${b64}` })
    })

    let json = await res.json()
    if (!json.result) throw '❌ No se pudo mejorar la imagen.'

    // Enviamos la imagen HD al chat
    await conn.sendMessage(
      m.chat,
      {
        image: { url: json.result },
        caption: '✨ Imagen mejorada a HD 🌸 Elyssia Bot MD'
      },
      { quoted: m }
    )

    fs.unlinkSync(tempFile)
  } catch (e) {
    console.error(e)
    conn.reply(
      m.chat,
      '❌ Ocurrió un error al mejorar la imagen.\nAsegúrate de que la API Key sea válida y la imagen sea compatible.',
      m
    )
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['hd']

export default handler