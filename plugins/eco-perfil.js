const handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  // Asegúrate que existan los datos
  user.money = user.money || 0
  user.exp = user.exp || 0
  user.level = user.level || 1
  user.piedra = user.piedra || 0
  user.hierro = user.hierro || 0
  user.plata = user.plata || 0
  user.oro = user.oro || 0
  user.diamante = user.diamante || 0

  // Calcula el progreso de nivel (simple)
  let expParaNivel = user.level * 500
  let progreso = Math.floor((user.exp / expParaNivel) * 10)
  let barra = '█'.repeat(progreso) + '░'.repeat(10 - progreso)

  // Mensaje estilo Elyssia 🌸
  let texto = `
🌸 *PERFIL DE MINERA* 🌸

👤 Nombre: @${m.sender.split('@')[0]}
🌷 Nivel: ${user.level}
✨ Experiencia: ${user.exp} / ${expParaNivel}
📊 Progreso: [${barra}]

💰 Coins: ${user.money}
⛏️ Minerales:
  🪨 Piedra: ${user.piedra}
  ⛓️ Hierro: ${user.hierro}
  🥈 Plata: ${user.plata}
  🥇 Oro: ${user.oro}
  💎 Diamante: ${user.diamante}

🌟 ¡Sigue explorando para conseguir tesoros más raros!
💖 Elyssia te acompaña en cada aventura~
`

  conn.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: m })
}

handler.help = ['perfil']
handler.tags = ['eco']
handler.command = ['perfil', 'profile']

export default handler