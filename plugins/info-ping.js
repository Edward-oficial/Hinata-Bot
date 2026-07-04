let handler = async (m, { conn }) => {
  const start = Date.now()
  await conn.sendMessage(m.chat, { 
    text: '*_Hinata-Bot_*\n\n➮ *_PING_*\n✰ Midiendo latencia...' 
  }, { quoted: m })
  
  const end = Date.now()
  const ping = end - start
  
  await conn.sendMessage(m.chat, {
    text: `*_Hinata-Bot_*\n\n➮ *_PONG_*\n✰ Latencia: *_${ping}ms_*\n✰ Bot activo: *_${conn.ws?.readyState === 1 ? '✅ Conectado' : '❌ Desconectado'}_*`,
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
  }, { quoted: m })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping|pong|latencia)$/i
handler.desc = 'Mide la latencia del bot'

export default handler