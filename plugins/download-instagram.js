import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text ? text.trim() : (m.quoted?.text || null)

    if (!query)
        return conn.reply(
            m.chat,
            `🌸 *Ingresa un enlace de Instagram para descargar*\n\n> *Ejemplo:* ${usedPrefix + command} https://instagram.com/p/…`,
            m
        )

    await m.react('🫣')

    try {
        const apiKey = 'dwk-NhZym8RK-IeYezUMe'
        const apiUrl =
            `https://dvwilkerofc-v1.onrender.com/api/download/instagram?url=${encodeURIComponent(query)}&apiKey=${apiKey}`

        const { data } = await axios.get(apiUrl)

        if (!data) {
            await m.react('❌')
            return m.reply('⚠️ *No se pudo obtener el contenido.*', m)
        }

        const downloadUrl =
            data.result?.url ||
            data.url ||
            data.download ||
            data.video ||
            data.image

        if (!downloadUrl) {
            await m.react('❌')
            return m.reply('⚠️ *La API no devolvió ningún enlace de descarga.*', m)
        }

        const mediaType = data.result?.type || (downloadUrl.endsWith('.mp4') ? 'video' : 'image')
        const quality = data.result?.quality || 'HD'

        const ui = `
╭━━━〔 📥 INSTAGRAM DL 〕━━━⬣
┃ 🌸 Elyssia Downloader
┃
┃ 🎬 Tipo: ${mediaType.toUpperCase()}
┃ 🎞 Calidad: ${quality}
┃ 🔗 Instagram
┃ ✨ Elyssia MD
╰━━━━━━━━━━━━━━━━━━⬣
`

        if (mediaType === 'video') {
            await conn.sendMessage(
                m.chat,
                {
                    video: { url: downloadUrl },
                    caption: ui,
                    mimetype: 'video/mp4'
                },
                { quoted: m }
            )
        } else {
            await conn.sendMessage(
                m.chat,
                {
                    image: { url: downloadUrl },
                    caption: ui,
                    mimetype: 'image/jpeg'
                },
                { quoted: m }
            )
        }

        await m.react('🌸')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ *Error al conectar con la API. Inténtalo más tarde.*', m)
    }
}

handler.help = ['ig', 'instagram']
handler.tags = ['descargas']
handler.command = /^(ig|instagram|insta)$/i

export default handler