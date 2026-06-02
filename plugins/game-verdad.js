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
        "¿Cuál ha sido tu peor decisión?",
"¿Qué es lo más vergonzoso que has hecho en público?",
"¿A quién stalkeas en secreto?",
"¿Cuál es tu mayor mentira?",
"¿Has llorado por alguien que no lo merecía?",
"¿Qué es lo que más te da inseguridad?",
"¿A quién extrañas pero no lo dices?",
"¿Has fingido estar bien cuando no lo estabas?",
"¿Qué harías si nadie pudiera juzgarte?",
"¿Cuál es tu mayor arrepentimiento?",
"¿Te has enamorado de alguien imposible?",
"¿Qué secreto nunca le contarías a tus amigos?",
"¿A quién le tienes envidia aunque no lo admitas?",
"¿Has hablado mal de alguien que quieres?",
"¿Qué es lo más tóxico que has hecho por amor?",
"¿Qué es lo peor que te han hecho y aún recuerdas?",
"¿Has mentido para evitar problemas?",
"¿Cuál ha sido tu peor decisión en la vida?",
"¿Qué es lo que más miedo te da perder?",
"¿Te has ilusionado con alguien que no sentía lo mismo?",
"¿Qué parte de ti ocultas a los demás?",
"¿Has fingido querer a alguien?",
"¿Cuál es tu secreto más oscuro?",
"¿Qué harías si desaparecieras un día entero?",
"¿Has revisado el celular de alguien sin permiso?",
"¿A quién no puedes olvidar?",
"¿Qué es lo que más te duele recordar?",
"¿Has sido egoísta con alguien que te quería?",
"¿Qué es lo que nunca perdonarías?",
"¿Te has sentido reemplazable alguna vez?",
"¿Qué es lo que más te avergüenza de ti?",
"¿Has sentido que no eres suficiente?",
"¿Qué persona te marcó para siempre?",
"¿Qué es lo que nunca dirías en voz alta?",
"¿Has amado en silencio?",
"¿Qué es lo que más te rompe por dentro?",
"¿A quién volverías si pudieras?"
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