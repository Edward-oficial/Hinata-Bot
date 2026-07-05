import axios from 'axios'

const API_URL = 'https://dv-edward.onrender.com'
const API_KEY = 'edward'

let handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, {
        text: `*_Hinata-Bot_*\n\n➮ *_CÓDIGOS API_*\n✰ Consultando códigos...`
    }, { quoted: m })

    try {
        const res = await axios.get(`${API_URL}/api/auth/admin/codes?apiKey=${API_KEY}`)
        const data = res.data

        if (!data.status || data.total === 0) {
            return conn.sendMessage(m.chat, {
                text: `*_Hinata-Bot_*\n\n➮ *_CÓDIGOS API_*\n\n❀ _No hay códigos creados aún._`
            }, { quoted: m })
        }

        const activos = data.data.filter(c => c.active)
        const agotados = data.data.filter(c => !c.active)

        let texto = `*_Hinata-Bot_*\n\n╭─「 🎁 *_CÓDIGOS API_* 」\n│\n├ ✰ *_Total:_* _${data.total}_\n├ ✅ *_Activos:_* _${activos.length}_\n├ ❌ *_Agotados:_* _${agotados.length}_\n│\n`

        if (activos.length > 0) {
            texto += `├ 🟢 *_ACTIVOS_*\n`
            activos.forEach(c => {
                texto += `├ ❀ \`${c.code}\` — _+${c.requests} reqs_ · _${c.uses}/${c.maxUses} usos_\n`
            })
            texto += `│\n`
        }

        if (agotados.length > 0) {
            texto += `├ 🔴 *_AGOTADOS_*\n`
            agotados.forEach(c => {
                texto += `├ ❀ \`${c.code}\` — _+${c.requests} reqs_ · _${c.uses}/${c.maxUses} usos_\n`
            })
            texto += `│\n`
        }

        texto += `╰─「 ✰ _Edward API_ 」`

        await conn.sendMessage(m.chat, {
            text: texto,
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
            text: `*_Hinata-Bot_*\n\n➮ *_CÓDIGOS API_*\n\n❌ _Error al conectar con la API_\n✰ ${e.message}`
        }, { quoted: m })
    }
}

handler.help = ['vercodigos']
handler.tags = ['owner']
handler.command = /^(vercodigos|listcodigos|codigos)$/i
handler.desc = 'Ver todos los códigos de la API'
handler.owner = true

export default handler
