import fs from 'fs'
import path, { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

const tags = {
  main: 'ρяιη¢ιραℓ',
  group: 'ɢяυρσѕ',
  economy: 'є¢σησму',
  game: 'gαмє',
  serbot: 'ѕєявσт',
  owner: 'σωηєя',
  downloader: '∂σωηℓσα∂єя',
  info: 'ιηƒσ'
}

const defaultMenu = {
  before: `
> ¡Hola, buenas tardes! ⸜(｡˃ ᵕ ˂ )⸝♡ Soy 𓆩⚝𓆪 HINATA BOT 𓍯 𓆩⚝𓆪, un gusto conocerte. Estoy aquí para lo que necesites ♡

𑁍𓂃 𓈒𓏸 *DEVELOPERS ::* EL VIGILANTE & BRAYANRK
𑁍𓂃 𓈒𓏸 *TIPO ::* Bot
𑁍𓂃 𓈒𓏸 *SISTEMA/OPR ::* android
𑁍𓂃 𓈒𓏸 *TIME ::* %time
𑁍𓂃 𓈒𓏸 *USERS ::* %totalreg
𑁍𓂃 𓈒𓏸 *CMDS EJEC ::* %totalcmd
𑁍𓂃 𓈒𓏸 *MI TIEMPO ::* %uptime

%readmore
`,
  header: '\n`𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ %category ㅤ֢ㅤׄㅤׅ`\n',
  body: 'ׄㅤ𑁍ࠬܓε(´｡•᎑•`)っ ᜒ %cmd %desc',
  footer: '',
  after: `

> *HINATA BOT desarrollado por EL VIGILANTE & BRAYANRK* ૮(˶ᵔᵕᵔ˶)ა
`
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let user = global.db.data.users[m.sender]

    if (!user) {
      user = { exp: 0, level: 0 }
      global.db.data.users[m.sender] = user
    }

    const { exp, level } = user
    const { min, xp } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        desc: p.desc || ''
      }))

    let bannerFinal = 'https://files.catbox.moe/r60c8l.jpg' 

    let textoMenu = defaultMenu.before
      .replace(/%time/g, new Date().toLocaleString())
      .replace(/%totalcmd/g, Object.keys(global.plugins).length)
      .replace(/%uptime/g, process.uptime().toFixed(0) + 's')

    for (let tag of Object.keys(tags)) {
      const cmds = help
        .filter(menu => menu.tags?.includes(tag))
        .map(menu => menu.help.map(h =>
          defaultMenu.body
            .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
            .replace(/%desc/g, menu.desc ? `\n> ↆ ${menu.desc}` : '')
        ).join('\n')).join('\n')

      if (cmds) {
        textoMenu += defaultMenu.header.replace(/%category/g, tags[tag])
        textoMenu += '\n' + cmds
        textoMenu += '\n' + defaultMenu.footer
      }
    }

    textoMenu += defaultMenu.after

    const replace = {
      name,
      level,
      exp: exp - min,
      maxexp: xp,
      totalreg: Object.keys(global.db.data.users).length,
      readmore: readMore
    }

    let texto = textoMenu

    for (let key of Object.keys(replace)) {
      texto = texto.replace(new RegExp(`%${key}`, 'g'), replace[key])
    }

    await conn.sendMessage(m.chat, {
      image: { url: bannerFinal },
      caption: texto.trim()
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, { text: `❌ Error:\n${e}` }, { quoted: m })
  }
}

handler.help = ['menu', 'menú', 'help']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']
handler.register = false
handler.desc = 'Muestra el menú principal del bot'

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
