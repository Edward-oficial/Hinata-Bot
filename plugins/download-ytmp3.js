import yts from 'yt-search'
import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🎵 Ingresa el nombre o enlace de YouTube.')

  await m.react('🎧')

  try {
    let url = text
    let video

    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(text)) {
      const search = await yts(text)

      if (!search.videos.length) {
        return m.reply('❌ No encontré resultados.')
      }

      video = search.videos[0]
      url = video.url
    } else {
      const search = await yts({ videoId: getVideoId(text) })

      if (!search) {
        return m.reply('❌ No pude obtener información del video.')
      }

      video = search
    }

    const info = `
✧━───『 𝙰𝚄𝙳𝙸𝙾 𝚈𝚃 』───━✧

🎼 *Título:* ${video.title}
📺 *Canal:* ${video.author?.name || 'Desconocido'}
⏳ *Duración:* ${video.timestamp || 'Desconocida'}
👁️ *Vistas:* ${formatViews(video.views)}
🔗 *URL:* ${url}

🌸 Powered by ElyssiaMD 🌸
`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: video.thumbnail },
        caption: info
      },
      { quoted: m }
    )

    const wait = await conn.sendMessage(
      m.chat,
      { text: '⏳ Descargando audio...' },
      { quoted: m }
    )

    const api = `https://dv-yer-api.online/ytmp3?url=${encodeURIComponent(url)}`
    const res = await fetch(api)

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const data = await res.json()

    console.log('DV-YER:', data)

    const audioUrl =
      data.download ||
      data.url ||
      data.result?.download ||
      data.result?.url

    if (!audioUrl) {
      throw new Error('No se encontró el enlace del audio.')
    }

    const title = cleanName(
      data.title ||
      data.result?.title ||
      video.title ||
      'audio'
    )

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      },
      { quoted: m }
    )

    try {
      await conn.sendMessage(
        m.chat,
        {
          text: `✅ Audio enviado\n\n🎼 ${title}`,
          edit: wait.key
        }
      )
    } catch {}

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`Error:\n${e.message}`)
  }
}

function cleanName(text) {
  return String(text)
    .replace(/[^\w\s.-]/g, '')
    .substring(0, 60)
}

function formatViews(views) {
  const n = Number(views)

  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'

  return String(n || 0)
}

function getVideoId(url) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
  )

  return match ? match[1] : null
}

handler.help = ['mp3 <texto|url>']
handler.tags = ['descargas']
handler.command = ['mp3', 'yta', 'ytmp3']

export default handler