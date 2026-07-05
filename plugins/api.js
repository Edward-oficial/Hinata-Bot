import axios from 'axios'

const API_URL = 'https://dv-edward.onrender.com'
const API_KEY = 'edward' // tu admin key

let handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, {
        text: '*_Hinata-Bot_*\n\n➮ *_API STATUS_*\n✰ Consultando estado...'
    }, { quoted: m })

    try {
        const [globalRes, statsRes] = await Promise.all([
            axios.get(`${API_URL}/api/auth/dashboard-global`),
            axios.get(`${API_URL}/api/auth/stats`)
        ])

        const global = globalRes.data
        const stats = statsRes.data

        const uptime = global.uptime
            ? (() => {
                const diff = Math.floor((Date.now() - global.uptime) / 1000)
                const h = Math.floor(diff / 3600).toString().padStart(2, '0')
                const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
                const s = (diff % 60).toString().padStart(2, '0')
                return `${h}:${m}:${s}`
            })()
            : 'N/A'

        const top5 = global.top5?.map((u, i) => `  ${i + 1}. ${u.username} — ${u.total} reqs`).join('\n') || '  Sin datos'

        await conn.sendMessage(m.chat, {
            text: `*_Hinata-Bot_*\n\n➮ *_EDWARD API_*\n\n` +
                `❀ *Estado:* _En línea_ ✅\n` +
                `❀ *Usuarios:* _${global.totalUsers || 0}_\n` +
                `❀ *Endpoints:* _${stats.endpoints || 0}_\n` +
                `❀ *Uptime:* _${uptime}_\n` +
                `❀ *Requests globales:* _${global.globalRequests || 0}_\n\n` +
                `➮ *Top 5 Usuarios*\n${top5}\n\n` +
                `✰ _${API_URL}_`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363407253203904@newsletter',
                    newsletterName: '𓆩⚝𓆪 ʜɪɴᴀᴛᴀ ᴏꜰɪᴄɪᴀʟ 𓆩⚝𓆪',
                    serverMessageId: 1
                }
            }
        }, { quoted: m })

    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: `*_Hinata-Bot_*\n\n➮ *_API STATUS_*\n\n❌ *Error:* _No se pudo conectar con la API_\n✰ ${e.message}`
        }, { quoted: m })
    }
}

handler.help = ['apistatus']
handler.tags = ['info']
handler.command = /^(apistatus|estadoapi|apiinfo)$/i
handler.desc = 'Muestra el estado de Edward API'

export default handler
