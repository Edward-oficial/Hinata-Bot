const handler = async (m, { conn, args }) => {

  let user = global.db.data.users[m.sender]
  const costo = 50 // costo en coins por tirada

  if (user.coin < costo)
    return m.reply(`💖 No tienes suficientes coins para tirar el gacha.\nNecesitas: ${costo} coins.`)

  user.coin -= costo

  // Definir los premios
  const premios = [
    { name: '🌸 Elyssia Sticker', type: 'sticker', chance: 40 },
    { name: '💎 Diamante', type: 'diamond', amount: 1, chance: 25 },
    { name: '🪙 Coins extra', type: 'coin', amount: 50, chance: 20 },
    { name: '🔥 Item raro', type: 'item', chance: 10 },
    { name: '👑 Elyssia Legendaria', type: 'legend', chance: 5 }
  ]

  // Tirada aleatoria
  const rand = Math.random() * 100
  let acumulado = 0
  let premio
  for (let p of premios) {
    acumulado += p.chance
    if (rand <= acumulado) {
      premio = p
      break
    }
  }

  // Dar el premio
  let textoPremio = ''
  switch (premio.type) {
    case 'diamond':
      user.diamond += premio.amount
      textoPremio = `💎 Ganaste ${premio.amount} Diamante(s)!`
      break
    case 'coin':
      user.coin += premio.amount
      textoPremio = `🪙 Ganaste ${premio.amount} Coins!`
      break
    case 'sticker':
      user.stickers = (user.stickers || 0) + 1
      textoPremio = `🌸 Ganaste un Sticker Elyssia!`
      break
    case 'item':
      user.items = (user.items || [])
      user.items.push('🔥 Item raro')
      textoPremio = `🔥 Ganaste un Item Raro!`
      break
    case 'legend':
      user.legend = (user.legend || [])
      user.legend.push('👑 Elyssia Legendaria')
      textoPremio = `👑 Ganaste la Elyssia Legendaria!`
      break
  }

  await conn.sendMessage(m.chat, { text: `🎲 **GACHA ELYSSIA**\n\n${textoPremio}\n\n💖 Coins restantes: ${user.coin}` }, { quoted: m })
}

handler.command = /^(gacha|tirar)$/i
handler.tags = ['gacha']
handler.help = ['tirar']
export default handler