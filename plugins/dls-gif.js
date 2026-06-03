import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: '🔍 「 HINATA TENOR 」 🔍\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n💫 » Busca GIFs animados\n\n> #tenor Goku\n> #tenor Naruto\n> #tenor meme\n\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦'
    }, { quoted: m })
  }

  await m.react('🔍')

  try {
    let apiUrl = `https://api.alyacore.xyz/search/tenor?query=${encodeURIComponent(text)}&key=api-9R960`
    let res = await fetch(apiUrl)
    let json = await res.json()

    if (!json.status || !json.medias || json.medias.length === 0) {
      await m.react('❌')
      return conn.sendMessage(m.chat, {
        text: '🔍 「 HINATA TENOR 」 🔍\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n💫 » Sin resultados\n\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦'
      }, { quoted: m })
    }

    let random = json.medias[Math.floor(Math.random() * json.medias.length)]

    if (random.type === 'video') {
      await conn.sendMessage(m.chat, {
        video: { url: random.data.url },
        caption: '🔍 「 HINATA TENOR 」 🔍\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n💫 » ' + text + '\n🎬 » ' + json.results + ' resultados\n\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦',
        gifPlayback: true
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        image: { url: random.data.url },
        caption: '🔍 「 HINATA TENOR 」 🔍\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n💫 » ' + text + '\n📷 » ' + json.results + ' resultados\n\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦'
      }, { quoted: m })
    }

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.react('❌')
    conn.sendMessage(m.chat, { text: '❌ Error al buscar' }, { quoted: m })
  }
}

handler.help = ['tenor']
handler.tags = ['downloader']
handler.command = /^(tenor|gif|stickerfinder)$/i
handler.desc = 'Busca GIFs en Tenor'

export default handler