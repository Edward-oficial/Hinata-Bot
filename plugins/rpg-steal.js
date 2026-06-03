let cooldownsRob = {}

let handler = async (m, { conn }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { diamantes: 0, bank: 0, exp: 0, level: 0 }
    user = global.db.data.users[who]
  }

  let now = Date.now()
  let cd = cooldownsRob[who] || 0
  let tiempoRestante = Math.ceil((cd - now) / 1000)

  if (now < cd) {
    let minutos = Math.floor(tiempoRestante / 60)
    let segundos = tiempoRestante % 60
    return conn.sendMessage(m.chat, {
      text: '⚔️ 「 HINATA STEAL 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n⏳ » Escondido de la policía\n🕐 » ' + minutos + 'm ' + segundos + 's\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔'
    }, { quoted: m })
  }

  let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
  if (!target) return conn.sendMessage(m.chat, { text: '⚔️ 「 HINATA STEAL 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n🎯 » Menciona a quien robar\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n> #steal @usuario' }, { quoted: m })
  if (target === who) return conn.sendMessage(m.chat, { text: '⚔️ 「 HINATA STEAL 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n🤡 » No te robes a ti mismo\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔' }, { quoted: m })

  let victim = global.db.data.users[target]
  if (!victim) { global.db.data.users[target] = { diamantes: 0, bank: 0 }; victim = global.db.data.users[target] }

  if ((victim.diamantes || 0) <= 0) {
    return conn.sendMessage(m.chat, {
      text: '⚔️ 「 HINATA STEAL 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n📭 » @' + target.split('@')[0] + ' no tiene diamantes\n💡 » Están en el banco, seguros\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔',
      mentions: [target]
    }, { quoted: m })
  }

  cooldownsRob[who] = now + 2700000

  if (Math.random() < 0.55) {
    let maxRobo = Math.floor(victim.diamantes * 0.6)
    let robado = Math.floor(Math.random() * maxRobo) + 1
    victim.diamantes -= robado
    user.diamantes = (user.diamantes || 0) + robado
    user.exp = (user.exp || 0) + Math.floor(Math.random() * 15) + 5

    let mensajes = ['🥷 Entraste sigilosamente mientras dormía. Encontraste ' + robado + ' 💎 bajo el colchón.', '🥷 Le diste un susto por la espalda y le vaciaste los bolsillos: ' + robado + ' 💎.', '🥷 Te disfrazaste de repartidor. Cuando abrió lo empujaste y agarraste ' + robado + ' 💎.', '🥷 Lo seguiste al callejón oscuro. "Esto es un asalto". Te entregó ' + robado + ' 💎.', '🥷 Estaba distraído con el teléfono. Le birlaste ' + robado + ' 💎 de la mochila.']

    await conn.sendMessage(m.chat, {
      text: '⚔️ 「 HINATA STEAL 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n✅ » ROBO EXITOSO\n\n🎯 » @' + target.split('@')[0] + '\n💎 » Robaste: ' + robado + ' diamantes\n💰 » Tu total: ' + user.diamantes + ' 💎\n\n' + mensajes[Math.floor(Math.random() * mensajes.length)] + '\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n> ⏳ 45 minutos',
      mentions: [target]
    }, { quoted: m })
  } else {
    let multa = Math.floor(Math.random() * 8) + 3
    user.diamantes = Math.max(0, (user.diamantes || 0) - multa)
    let mensajes = ['🚔 Activaste la alarma. La policía llegó en segundos. Multa: ' + multa + ' 💎.', '🚔 Era un policía encubierto. Te esposó. Fianza: ' + multa + ' 💎.', '🚔 Cinturón negro en karate. Te aplicó una llave. Multa: ' + multa + ' 💎.', '🚔 Te esperaban sus cinco hermanos boxeadores. Perdiste ' + multa + ' 💎.', '🚔 Las cámaras grabaron todo. Multa de ' + multa + ' 💎 para no ir preso.']

    await conn.sendMessage(m.chat, {
      text: '⚔️ 「 HINATA STEAL 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❌ » TE ATRAPARON\n\n🎯 » @' + target.split('@')[0] + '\n💸 » Multa: ' + multa + ' diamantes\n💰 » Tu total: ' + user.diamantes + ' 💎\n\n' + mensajes[Math.floor(Math.random() * mensajes.length)] + '\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n> ⏳ 45 minutos',
      mentions: [target]
    }, { quoted: m })
  }
}

handler.help = ['steal']
handler.tags = ['rpg']
handler.command = /^(steal|robar|rob)$/i
handler.desc = 'Roba diamantes a otros usuarios'

export default handler