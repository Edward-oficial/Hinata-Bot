import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const charset = { 
  a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ', h:'ʜ', 
  i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ', m:'ᴍ', n:'ɴ', o:'ᴏ', p:'ᴘ', 
  q:'ǫ', r:'ʀ', s:'ꜱ', t:'ᴛ', u:'ᴜ', v:'ᴠ', w:'ᴡ', x:'x', y:'ʏ', z:'ᴢ' 
}
const textCyberpunk = t => t.replace(/[a-z]/gi, c => charset[c.toLowerCase()] || c)

const defaultMenu = {
  before: `
𝖧𝗂𝗇𝖺𝗍𝖺-𝖡𝗈𝗍

➮ *_INFORMACION_*
✰ *_Usuario_*: %name
✰ *_Experiencia_*: %exp / %maxexp
✰ *_Modo_*: %mode
✰ *_Activo_*: %muptime
✰ *_Registrados_*: %totalreg
✰ *_Tipo_*: %tipo

➮ *_ENLACES_*
✰ *_Canal_*: https://whatsapp.com/channel/0029VbCOTaJ9RZAQPdiZ4J1K
✰ *_GitHub_*: https://github.com/Edward-oficial/Hinata-bot

%readmore
`.trim(),
  header: '\n➮ *_%category_*',
  body: '✰ %cmd',
  footer: '',
  after: `

*_Hinata-Bot_*

➮ *_CREADORES_*
✰ *_Edward_*
✰ *_BrayanRK_*`
}

const menuDir = './media/menu'
fs.mkdirSync(menuDir, { recursive: true })

const getMenuMediaFile = jid =>
  path.join(menuDir, `menuMedia_${jid.replace(/[:@.]/g, '_')}.json`)

const loadMenuMedia = jid => {
  try {
    return JSON.parse(fs.readFileSync(getMenuMediaFile(jid)))
  } catch { return {} }
}

const fetchBuffer = url => fetch(url).then(r => r.arrayBuffer()).then(b => Buffer.from(b))

const defaultThumb = await fetchBuffer('https://files.catbox.moe/mln8cc.png')

let handler = async (m, { conn, usedPrefix }) => {
  await conn.sendMessage(m.chat, { react: { text: '✰', key: m.key } })

  const botJid = conn.user.jid
  const menuMedia = loadMenuMedia(botJid)
  const menu = global.subBotMenus?.[botJid] || defaultMenu

  const user = global.db.data.users[m.sender] || { level: 0, exp: 0 }
  const { min, xp } = xpRange(user.level, global.multiplier)

  let tipo = 'Bot Principal'
  if (global.conns) {
    for (const bot of global.conns) {
      if (bot.user?.jid === conn.user?.jid) {
        tipo = 'Sub-Bot'
        break
      }
    }
  }

  const replace = {
    name: await conn.getName(m.sender),
    level: user.level,
    exp: user.exp - min,
    maxexp: xp,
    totalreg: Object.keys(global.db.data.users).length,
    mode: global.opts.self ? 'Privado' : 'Publico',
    muptime: clockString(process.uptime() * 1000),
    readmore: String.fromCharCode(8206).repeat(4001),
    tipo: tipo
  }

  const plugins = Object.values(global.plugins || {}).filter(p => !p.disabled)

  const help = plugins.map(p => ({
    help: [].concat(p.help || []),
    tags: [].concat(p.tags || []),
    prefix: 'customPrefix' in p,
    desc: p.desc || ''
  }))

  const tags = {}
  help.forEach(({ tags: tg }) =>
    tg.forEach(t => t && !tags[t] && (tags[t] = textCyberpunk(t)))
  )

  const text = [
    menu.before,
    ...Object.keys(tags).map(tag => {
      const cmds = help
        .filter(p => p.tags.includes(tag))
        .flatMap(p => p.help.map(c =>
          menu.body.replace('%cmd', p.prefix ? c : usedPrefix + c) +
          (p.desc ? `\n> *_${p.desc}_*` : '')
        )).join('\n')
      return cmds ? `${menu.header.replace('%category', tags[tag])}\n${cmds}\n${menu.footer}` : ''
    }).filter(Boolean),
    menu.after
  ].join('\n').replace(/%(\w+)/g, (_, k) => replace[k] ?? '')

  const thumb = menuMedia.thumbnail && fs.existsSync(menuMedia.thumbnail)
    ? fs.readFileSync(menuMedia.thumbnail)
    : defaultThumb

  await conn.sendMessage(m.chat, {
    image: thumb,
    caption: text,
    contextInfo: {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363407253203904@newsletter',
        newsletterName: '𓆩⚝𓆪 ʜɪɴᴀᴛᴀ ᴏꜰɪᴄɪᴀʟ 𓆩⚝𓆪',
        serverMessageId: 1
      }
    }
  })
}

handler.help = ['menu', 'menú']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.desc = 'Muestra el menu de comandos'
handler.register = false

export default handler

const clockString = ms =>
  [3600000, 60000, 1000].map((v, i) =>
    String(Math.floor(ms / v) % (i ? 60 : 99)).padStart(2, '0')
  ).join(':')