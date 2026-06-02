import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text)
        return conn.reply(
            m.chat,
            `🌸 *ELYSSIA AI* 🌸\n\n✦ Escribe lo que deseas decirle a Elyssia\n\n> Ejemplo: ${usedPrefix + command} Hola, ¿cómo estás?`,
            m
        )

    await m.react('🌀')

    try {
        const apiKey = 'sk-b9c406e478c20c53a588ea4b875339fff5d60464d52b05f795a54e4b94554ef5'

        const prompt = encodeURIComponent(
            'Eres Elyssia, una inteligencia artificial femenina, elegante, calmada, ligeramente misteriosa y emocional. Respondes en español con estilo poético y humano.'
        )

        const query = encodeURIComponent(text.trim())

        const apiUrl = `https://api.mitzuki.xyz/ia/gpt?text=${query}&model=llama&prompt=${prompt}&apikey=${apiKey}`

        const { data } = await axios.get(apiUrl)

        if (!data || !data.result) {
            await m.react('❌')
            return conn.reply(m.chat, '⚠️ *ELYSSIA no pudo generar respuesta en este momento.*', m)
        }

        const reply = data.result

        const ui = `
╭━━━〔 🌸 ELYSSIA AI 〕━━━⬣
┃ ✨ Inteligencia Elyssia
┃
┃ 🪶 Pregunta:
┃ ${text}
┃
┃ 💬 Respuesta:
╰━━━━━━━━━━━━━━━━━━⬣
${reply}
        `

        await conn.sendMessage(
            m.chat,
            { text: ui },
            { quoted: m }
        )

        await m.react('🌸')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        conn.reply(
            m.chat,
            '🌸 *ELYSSIA no está disponible en este momento...*',
            m
        )
    }
}

handler.help = ['chat']
handler.tags = ['ia', 'ai']
handler.command = /^(elyssia|ai|chat)$/i

export default handler