import axios from 'axios'

const API_URL = 'https://dv-edward.onrender.com'
const API_KEY = 'edward' // tu admin key

let handler = async (m, { conn, args, isOwner }) => {
    if (!isOwner) return conn.sendMessage(m.chat, {
        text: '*_Hinata-Bot_*\n\n➮ *_CREAR CÓDIGO_*\n❌ _Solo el owner puede usar este comando._'
    }, { quoted: m })

    // Uso: !crearcodigo CODIGO 500 10
    if (args.length < 3) {
        return conn.sendMessage(m.chat, {
            text: `*_Hinata-Bot_*\n\n➮ *_CREAR CÓDIGO_*\n\n✰ *Uso correcto:*\n_!crearcodigo CODIGO solicitudes maxusos_\n\n*Ejemplo:*\n_!crearcodigo AMILCARGIT 500 10_`
        }, { quoted: m })
    }

    const [code, requests, maxUses] = args

    try {
        const res = await axios.post(`${API_URL}/api/auth/admin/create-code`, {
            adminKey: API_KEY,
            code: code.toUpperCase(),
            requests: parseInt(requests),
            maxUses: parseInt(maxUses)
        })

        const data = res.data

        if (!data.status) {
            return conn.sendMessage(m.chat, {
                text: `*_Hinata-Bot_*\n\n➮ *_CREAR CÓDIGO_*\n\n❌ _${data.error}_`
            }, { quoted: m })
        }

        // Confirmación al owner estilo Hinata
        await conn.sendMessage(m.chat, {
            text: `*_Hinata-Bot_*\n\n` +
                `╭─「 🎁 *_CÓDIGO CREADO_* 」\n` +
                `│\n` +
                `├ ✰ *_Código:_* _${data.data.code}_\n` +
                `├ ❀ *_Solicitudes:_* _+${data.data.requests}_\n` +
                `├ ❀ *_Máx. usos:_* _${data.data.maxUses}_\n` +
                `├ ❀ *_Estado:_* _Activo ✅_\n` +
                `│\n` +
                `╰─「 ✰ _Mensaje para compartir enviado abajo_ 」`,
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

        // Mensaje para compartir estilo Hinata
        const mensajeCompartir =
            `*_Hinata-Bot_*\n\n` +
            `╭─「 🎁 *_CÓDIGO DE REGALO_* 」\n` +
            `│\n` +
            `├ ✰ *_Código:_* _${data.data.code}_\n` +
            `├ ❀ *_Solicitudes:_* _+${data.data.requests}_\n` +
            `├ ❀ *_Usos disponibles:_* _${data.data.maxUses}_\n` +
            `│\n` +
            `├ 📌 *_¿Cómo canjearlo?_*\n` +
            `├ _1. Entra al dashboard_\n` +
            `├ _2. Busca "Canjear Código"_\n` +
            `├ _3. Ingresa el código y listo_\n` +
            `│\n` +
            `├ 🌐 _${API_URL}/dash_\n` +
            `│\n` +
            `╰─「 ✰ _Compártelo antes de que se agote_ 」`

        await conn.sendMessage(m.chat, {
            text: mensajeCompartir,
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
            text: `*_Hinata-Bot_*\n\n➮ *_CREAR CÓDIGO_*\n\n❌ _Error al conectar con la API_\n✰ ${e.message}`
        }, { quoted: m })
    }
}

handler.help = ['crearcodigo']
handler.tags = ['owner']
handler.command = /^(crearcodigo|createcode|newcode)$/i
handler.desc = 'Crea un código de regalo para la API (solo owner)'

export default handler
