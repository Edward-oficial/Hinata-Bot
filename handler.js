  import { smsg } from './lib/simple.js'
import { format } from 'util' 
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(() => resolve(), ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()

    // Guardar tiempo de conexión
    if (!this.connectedAt) this.connectedAt = Date.now()

    if (!chatUpdate) return

    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return

    if (global.db.data == null) await global.loadDatabase()       

    try {
        m = smsg(this, m) || m
        if (!m) return

        // Inicializar propiedades
        m.exp = m.exp || 0
        m.coin = m.coin || 0

        const _user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
        if (!isNumber(_user.exp)) _user.exp = 0
        if (!isNumber(_user.coin)) _user.coin = 10
        if (!('name' in _user)) _user.name = m.name || `Usuario ${m.sender.split('@')[0]}`

        // Configuración de chat
        const chat = global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
        if (!('isBanned' in chat)) chat.isBanned = false

    } catch (e) {
        console.error(e)
    }

    // Variables de permisos
    const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
    const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
    const isOwner = isROwner || m.fromMe
    const isMods = isROwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
    const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender) || _user.premium === true

    if (m.isBaileys) return
    if (!m.text) m.text = ''

    // Procesar plugins
    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
    let usedPrefix = ''
    for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin || plugin.disabled) continue
        const __filename = join(___dirname, name)

        if (typeof plugin.all === 'function') {
            try { await plugin.all.call(this, m, { __dirname: ___dirname, __filename }) } 
            catch (e) { console.error(e) }
        }

        let _prefix = plugin.customPrefix || conn.prefix || global.prefix
        let match = (_prefix instanceof RegExp ? [[_prefix.exec(m.text), _prefix]] :
                    Array.isArray(_prefix) ? _prefix.map(p => [new RegExp(p).exec(m.text), new RegExp(p)]) :
                    [[new RegExp(_prefix).exec(m.text), new RegExp(_prefix)]]
        ).find(p => p[1])

        if (!match) continue
        usedPrefix = match[0][0] || ''
        let noPrefix = m.text.replace(usedPrefix, '')
        let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
        command = (command || '').toLowerCase()
        let fail = plugin.fail || global.dfail
        let isAccept = Array.isArray(plugin.command) ? plugin.command.includes(command) : plugin.command === command

        if (!isAccept) continue

        m.plugin = name
        let extra = { usedPrefix, noPrefix, args, command, m, conn: this }

        try { await plugin.call(this, m, extra) } 
        catch (e) { console.error(e); m.error = e }

        break
    }

    // Guardar stats y exp
    if (_user) {
        _user.exp += m.exp
        _user.coin -= m.coin * 1
    }

    // Imprimir en consola (opcional)
    try { if (!opts?.noprint) await (await import('./lib/print.js')).default(m, this) } 
    catch (e) { console.log(e) }
    
    // Autoread
    if (opts?.autoread) await this.readMessages([m.key])
}

// Función para calcular tiempo en formato "Xd Xh Xm Xs"
export function clockString(ms) {
    const d = Math.floor(ms / 86400000)
    const h = Math.floor(ms / 3600000) % 24
    const m = Math.floor(ms / 60000) % 60
    const s = Math.floor(ms / 1000) % 60
    return `${d}d ${h}h ${m}m ${s}s`
}

// Exporta dfail para mensajes de error
global.dfail = (type, m, conn, usedPrefix, command) => {
    const msg = {
        rowner: '🔐 Solo el Creador del Bot puede usar este comando.',
        owner: '👑 Solo el Creador y Sub Bots pueden usar este comando.',
        mods: '🛡️ Solo los Moderadores pueden usar este comando.',
        premium: '💎 Solo usuarios Premium pueden usar este comando.',
        group: '「✧」 Este comando es sólo para grupos.',
        private: '🔒 Solo en Chat Privado puedes usar este comando.',
        admin: '⚔️ Solo los Admins del Grupo pueden usar este comando.',
        botAdmin: 'El bot debe ser Admin para ejecutar esto.',
        unreg: '> 🔰 Debes estar Registrado para usar este comando.\n\n Ejemplo : #reg AmílcarGit.15',
        restrict: '⛔ Esta función está deshabilitada.'
    }[type]

    if (msg)
        return conn.reply(m.chat, msg, m, { contextInfo: rcanal }).then(() => conn.sendMessage(m.chat, { react: { text: '✖️', key: m.key } }))

    let file = global.__filename(import.meta.url, true)
    watchFile(file, async () => {
        unwatchFile(file)
        console.log(chalk.magenta("Se actualizo 'handler.js'"))

        if (global.conns && global.conns.length > 0) {
            const users = [...new Set([...global.conns
                .filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)
                .map(conn => conn)])]
            for (const userr of users) {
                userr.subreloadHandler(false)
            }
        }
    })
}