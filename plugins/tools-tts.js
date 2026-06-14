import fs from 'fs'
import path from 'path'
import os from 'os'
import fetch from 'node-fetch'
import gtts from 'node-gtts'

const VOCES = {
  'chica':   { nombre: 'Chica Normal',  tipo: 'gtts',   lang: 'es'    },
  'hombre':  { nombre: 'Hombre',        tipo: 'gtts',   lang: 'es-us' },
  'ingles':  { nombre: 'Inglés',        tipo: 'gtts',   lang: 'en'    },
  'brasil':  { nombre: 'Portugués',     tipo: 'gtts',   lang: 'pt'    },
  'japones': { nombre: 'Japonés',       tipo: 'gtts',   lang: 'ja'    },
  'frances': { nombre: 'Francés',       tipo: 'gtts',   lang: 'fr'    },
  'timida':  { nombre: 'Chica Tímida',  tipo: 'stream', voz: 'Mia'     },
  'kawaii':  { nombre: 'Kawaii',        tipo: 'stream', voz: 'Lupe'    },
  'robot':   { nombre: 'Robot',         tipo: 'stream', voz: 'Brian'   },
  'viejo':   { nombre: 'Anciano',       tipo: 'stream', voz: 'Geraint' },
  'narrador':{ nombre: 'Narrador',      tipo: 'stream', voz: 'Matthew' },
  'emma':    { nombre: 'Emma',          tipo: 'stream', voz: 'Emma'    },
  'amy':     { nombre: 'Amy',           tipo: 'stream', voz: 'Amy'     },
  'russell': { nombre: 'Russell',       tipo: 'stream', voz: 'Russell' },
  'nicole':  { nombre: 'Nicole',        tipo: 'stream', voz: 'Nicole'  },
  'joey':    { nombre: 'Joey',          tipo: 'stream', voz: 'Joey'    },
}

async function generarGTTS(texto, lang) {
  const tts = gtts(lang)
  const tmpPath = path.join(os.tmpdir(), `tts_${Date.now()}.mp3`)

  await new Promise((resolve, reject) => {
    tts.save(tmpPath, texto, err => err ? reject(err) : resolve())
  })

  const buffer = fs.readFileSync(tmpPath)
  try { fs.unlinkSync(tmpPath) } catch {}
  return buffer
}

async function generarStream(texto, voz) {
  const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voz}&text=${encodeURIComponent(texto)}`
  const res = await Promise.race([
    fetch(url),
    new Promise((_, rej) => setTimeout(() => rej('timeout'), 10000))
  ])

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  return buffer
}

const handler = async (m, { conn, text }) => {

  if (!text) {
    let listaVoces = Object.entries(VOCES)
      .map(([k, v]) => '❧ ' + k + '\n> ' + v.nombre)
      .join('\n')

    let texto = '࿇ ══━━━✥◈✥━━━══ ࿇\n'
    texto += '    𝕳𝖎𝖓𝖆𝖙𝖆 𝕿𝖙𝖘\n'
    texto += '࿇ ══━━━✥◈✥━━━══ ࿇\n\n'

    texto += '𖣔 ᴜsᴏ ˚ʚ♡ɞ˚\n'
    texto += '❧ #tts <texto>\n'
    texto += '❧ #tts <voz>:<texto>\n\n'

    texto += '𖣔 ᴇᴊᴇᴍᴘʟᴏs ˚ʚ♡ɞ˚\n'
    texto += '❧ #tts Hola soy Hinata\n'
    texto += '❧ #tts timida:Hola me da pena\n'
    texto += '❧ #tts robot:Soy un robot\n\n'

    texto += '𖣔 ᴠᴏᴄᴇs ᴅɪsᴘᴏɴɪʙʟᴇs ˚ʚ♡ɞ˚\n'
    texto += listaVoces + '\n\n'

    texto += '࿇ ══━━━✥◈✥━━━══ ࿇'

    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  let vozKey = 'chica'
  let textoFinal = text.trim()

  const matchVoz = textoFinal.match(/^([a-záéíóúñ]+):(.+)$/i)
  if (matchVoz) {
    const clave = matchVoz[1].toLowerCase()
    if (VOCES[clave]) {
      vozKey = clave
      textoFinal = matchVoz[2].trim()
    }
  }

  if (textoFinal.length > 500) {
    let texto = '࿇ ══━━━✥◈✥━━━══ ࿇\n'
    texto += '    𝕳𝖎𝖓𝖆𝖙𝖆 𝕿𝖙𝖘\n'
    texto += '࿇ ══━━━✥◈✥━━━══ ࿇\n\n'

    texto += '𖣔 ᴇʀʀᴏʀ ˚ʚ♡ɞ˚\n'
    texto += '❧ Texto muy largo\n'
    texto += '> Máximo: 500 caracteres\n'
    texto += '> Tienes: ' + textoFinal.length + '\n\n'

    texto += '࿇ ══━━━✥◈✥━━━══ ࿇'

    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  const vozInfo = VOCES[vozKey]
  await conn.sendMessage(m.chat, { react: { text: '❧', key: m.key } })

  try {
    let audioBuffer

    if (vozInfo.tipo === 'gtts') {
      audioBuffer = await generarGTTS(textoFinal, vozInfo.lang)
    } else {
      audioBuffer = await generarStream(textoFinal, vozInfo.voz)
    }

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m })

    let resumen = textoFinal.length > 50 ? textoFinal.slice(0, 50) + '...' : textoFinal

    let texto = '࿇ ══━━━✥◈✥━━━══ ࿇\n'
    texto += '    𝕳𝖎𝖓𝖆𝖙𝖆 𝕿𝖙𝖘\n'
    texto += '࿇ ══━━━✥◈✥━━━══ ࿇\n\n'

    texto += '𖣔 ᴀᴜᴅɪᴏ ɢᴇɴᴇʀᴀᴅᴏ ˚ʚ♡ɞ˚\n'
    texto += '❧ Voz\n> ' + vozInfo.nombre + '\n'
    texto += '❧ Texto\n> ' + resumen + '\n'
    texto += '❧ Caracteres\n> ' + textoFinal.length + '\n\n'

    texto += '> Usa #tts para ver todas las voces\n\n'
    texto += '࿇ ══━━━✥◈✥━━━══ ࿇'

    await conn.sendMessage(m.chat, { text: texto }, { quoted: m })

  } catch (e) {
    console.error('[TTS] Error:', e.message)

    if (vozInfo.tipo === 'stream') {
      try {
        let fallback = await generarGTTS(textoFinal, 'es')
        await conn.sendMessage(m.chat, {
          audio: fallback,
          mimetype: 'audio/mpeg',
          ptt: false
        }, { quoted: m })

        let textoFallback = '࿇ ══━━━✥◈✥━━━══ ࿇\n'
        textoFallback += '    𝕳𝖎𝖓𝖆𝖙𝖆 𝕿𝖙𝖘\n'
        textoFallback += '࿇ ══━━━✥◈✥━━━══ ࿇\n\n'

        textoFallback += '𖣔 ᴀᴠɪsᴏ ˚ʚ♡ɞ˚\n'
        textoFallback += '❧ La voz ' + vozInfo.nombre + ' no está disponible\n'
        textoFallback += '> Se usó la voz predeterminada\n\n'

        textoFallback += '࿇ ══━━━✥◈✥━━━══ ࿇'

        await conn.sendMessage(m.chat, { text: textoFallback }, { quoted: m })
        return
      } catch {}
    }

    let textoError = '࿇ ══━━━✥◈✥━━━══ ࿇\n'
    textoError += '    𝕳𝖎𝖓𝖆𝖙𝖆 𝕿𝖙𝖘\n'
    textoError += '࿇ ══━━━✥◈✥━━━══ ࿇\n\n'

    textoError += '𖣔 ᴇʀʀᴏʀ ˚ʚ♡ɞ˚\n'
    textoError += '❧ Error al generar el audio\n'
    textoError += '> Intenta de nuevo\n\n'

    textoError += '࿇ ══━━━✥◈✥━━━══ ࿇'

    await conn.sendMessage(m.chat, { text: textoError }, { quoted: m })
  }
}

handler.help = ['tts <texto>']
handler.tags = ['tools']
handler.command = ['tts', 'voz', 'hablar']
handler.desc = 'Convierte texto a voz con múltiples voces'

export default handler
