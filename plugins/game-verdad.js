import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {

    const verdades = [
        "¿Qué es lo más vergonzoso que has hecho?",
        "¿A quién le tienes más celos?",
        "¿Cuál es tu mayor secreto?",
        "¿Has mentido hoy?",
        "¿Te has enamorado de alguien imposible?",
        "¿Qué es lo que más miedo te da?",
        "¿A quién extrañas en secreto?",
        "¿Cuál ha sido tu peor decisión?"
    ]

    const random = verdades[Math.floor(Math.random() * verdades.length)]

    const interactiveMessage = proto.Message.InteractiveMessage.create({
        header: {
            title: '🌸 ELYSSIA MD - 🎮 VERDAD',
            subtitle: 'Juego de sinceridad',
            hasMediaAttachment: false
        },
        body: {
            text: `> 🌸 *VERDAD ACTIVADO* ⸜(｡˃ ᵕ ˂ )⸝♡

❖ *PREGUNTA ::*
${random}

❖ Responde con sinceridad...`
        },
        footer: {
            text: '⫏⫏ ELYSSIA MD 🌸'
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🎲 OTRA VERDAD',
                        id: 'verdad_nueva'
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '💀 RETO',
                        id: 'reto_random'
                    })
                }
            ]
        }
    })

    const msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {},
                    interactiveMessage
                }
            }
        },
        { quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react('🌸')
}

handler.help = ['verdad']
handler.tags = ['game']
handler.command = ['verdad']

export default handler