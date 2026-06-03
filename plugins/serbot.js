const { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import("@whiskeysockets/baileys"))
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
const { exec } = await import('child_process')
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let subCount = {}

let rtx = '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA SUB-BOT %num ㅤ֢ㅤׄㅤׅ\n\n❥ VINCULACIÓN POR QR\n\n> 1️⃣ Abre WhatsApp en tu teléfono\n> 2️⃣ Pulsa ⋮ → Dispositivos vinculados\n> 3️⃣ Presiona "Vincular un dispositivo"\n> 4️⃣ Escanea el código QR de abajo\n\n⫏⫏ HINATA BOT ✿'

let rtx2 = '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA SUB-BOT %num ㅤ֢ㅤׄㅤׅ\n\n❥ VINCULACIÓN POR CÓDIGO\n\n> 1️⃣ Abre WhatsApp en tu teléfono\n> 2️⃣ Pulsa ⋮ → Dispositivos vinculados\n> 3️⃣ Presiona "Vincular un dispositivo"\n> 4️⃣ Selecciona "Con número" e ingresa el código\n\n⫏⫏ HINATA BOT ✿'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const yukiJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let who = m.sender

  if (!subCount[who]) subCount[who] = 0

  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]

  if (subBots.length >= 10) {
    return conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/r60c8l.jpg' },
      caption: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❥ ❌ Límite de 10 Sub-Bots alcanzado\n\n⫏⫏ HINATA BOT ✿'
    }, { quoted: m })
  }

  subCount[who]++
  let numero = subCount[who]
  let id = 'Hinata-SubBot-' + numero
  let pathYukiJadiBot = path.join('./sessions/', id)
  if (!fs.existsSync(pathYukiJadiBot)) {
    fs.mkdirSync(pathYukiJadiBot, { recursive: true })
  }
  yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot
  yukiJBOptions.m = m
  yukiJBOptions.conn = conn
  yukiJBOptions.args = args
  yukiJBOptions.usedPrefix = usedPrefix
  yukiJBOptions.command = command
  yukiJBOptions.numero = numero
  yukiJBOptions.fromCommand = true
  yukiJadiBot(yukiJBOptions)
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
handler.desc = 'Vincula un sub-bot (máx 10)'
export default handler

export async function yukiJadiBot(options) {
  let { pathYukiJadiBot, m, conn, args, usedPrefix, command, numero } = options
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
  let txtCode, codeBot, txtQR
  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
  }
  const pathCreds = path.join(pathYukiJadiBot, "creds.json")
  if (!fs.existsSync(pathYukiJadiBot)) {
    fs.mkdirSync(pathYukiJadiBot, { recursive: true })
  }
  try {
    args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
  } catch {
    conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/r60c8l.jpg' },
      caption: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❥ ❌ Usa: ' + usedPrefix + command + ' code\n\n⫏⫏ HINATA BOT ✿'
    }, { quoted: m })
    return
  }

  let { version } = await fetchLatestBaileysVersion()
  const msgRetry = (MessageRetryMap) => { }
  const msgRetryCache = new NodeCache()
  const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)

  const connectionOptions = {
    logger: pino({ level: "fatal" }),
    printQRInTerminal: false,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
    msgRetry,
    msgRetryCache,
    browser: ['HINATA SUB-BOT ' + numero, 'Chrome', '2.0.0'],
    version: version,
    generateHighQualityLinkPreview: true
  }

  let sock = makeWASocket(connectionOptions)
  sock.isInit = false
  sock.numero = numero
  let isInit = true

  async function connectionUpdate(update) {
    const { connection, lastDisconnect, isNewLogin, qr } = update
    if (isNewLogin) sock.isInit = false
    if (qr && !mcode) {
      if (m?.chat) {
        txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.replace('%num', numero) }, { quoted: m })
      } else {
        return
      }
      if (txtQR && txtQR.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000)
      }
      return
    }
    if (qr && mcode) {
      let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
      secret = secret.match(/.{1,4}/g)?.join("-")
      txtCode = await conn.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/r60c8l.jpg' },
        caption: rtx2.replace('%num', numero)
      }, { quoted: m })
      codeBot = await conn.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/r60c8l.jpg' },
        caption: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA SUB-BOT ' + numero + ' ㅤ֢ㅤׄㅤׅ\n\n❥ CÓDIGO: ' + secret + '\n\n> Expira en 30 segundos\n\n⫏⫏ HINATA BOT ✿'
      }, { quoted: m })
    }
    if (txtCode && txtCode.key) {
      setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000)
    }
    if (codeBot && codeBot.key) {
      setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000)
    }

    const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
    if (connection === 'close') {
      if (reason === 428 || reason === 408 || reason === 500 || reason === 515) {
        console.log(chalk.bold.magentaBright('\nHINATA SUB-BOT ' + numero + ': Reconectando...'))
        await creloadHandler(true).catch(console.error)
      }
      if (reason === 440 || reason == 405 || reason == 401 || reason === 403) {
        console.log(chalk.bold.magentaBright('\nHINATA SUB-BOT ' + numero + ': Sesión cerrada'))
        try { fs.rmSync(pathYukiJadiBot, { recursive: true }) } catch { }
      }
    }
    if (connection == 'open') {
      let userName = sock.authState.creds.me.name || 'Hinata Sub-Bot ' + numero
      console.log(chalk.bold.cyanBright('\nHINATA SUB-BOT ' + numero + ': ' + userName + ' conectado'))
      sock.isInit = true
      global.conns.push(sock)
      for (const channelId of Object.values(global.ch || {})) {
        await sock.newsletterFollow(channelId).catch(() => {})
      }
    }
  }

  setInterval(async () => {
    if (!sock.user) {
      try { sock.ws.close() } catch (e) { }
      sock.ev.removeAllListeners()
      let i = global.conns.indexOf(sock)
      if (i < 0) return
      delete global.conns[i]
      global.conns.splice(i, 1)
    }
  }, 60000)

  let handler = await import('../handler.js')
  let creloadHandler = async function (restatConn) {
    try {
      const Handler = await import('../handler.js?update=' + Date.now()).catch(console.error)
      if (Object.keys(Handler || {}).length) handler = Handler
    } catch (e) {
      console.error('Error:', e)
    }
    if (restatConn) {
      const oldChats = sock.chats
      try { sock.ws.close() } catch { }
      sock.ev.removeAllListeners()
      sock = makeWASocket(connectionOptions, { chats: oldChats })
      isInit = true
    }
    if (!isInit) {
      sock.ev.off("messages.upsert", sock.handler)
      sock.ev.off("connection.update", sock.connectionUpdate)
      sock.ev.off('creds.update', sock.credsUpdate)
    }
    sock.handler = handler.handler.bind(sock)
    sock.connectionUpdate = connectionUpdate.bind(sock)
    sock.credsUpdate = saveCreds.bind(sock, true)
    sock.ev.on("messages.upsert", sock.handler)
    sock.ev.on("connection.update", sock.connectionUpdate)
    sock.ev.on("creds.update", sock.credsUpdate)
    isInit = false
    return true
  }
  creloadHandler(false)
}