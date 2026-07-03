let handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender

  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = {
      exp: 0, level: 0, diamantes: 0, bank: 0,
      health: 100, maxHealth: 100, attack: 10, defense: 5,
      mana: 50, maxMana: 50, class: 'Novato', inventory: [],
      equipment: { weapon: null, armor: null, accessory: null }
    }
    user = global.db.data.users[who]
  }

  if (!('health' in user)) user.health = 100
  if (!('maxHealth' in user)) user.maxHealth = 100
  if (!('mana' in user)) user.mana = 50
  if (!('maxMana' in user)) user.maxMana = 50
  if (!('attack' in user)) user.attack = 10
  if (!('defense' in user)) user.defense = 5
  if (!('class' in user)) user.class = 'Novato'
  if (!('inventory' in user)) user.inventory = []
  if (!('equipment' in user)) user.equipment = { weapon: null, armor: null, accessory: null }
  if (!('bank' in user)) user.bank = 0
  if (!('diamantes' in user)) user.diamantes = 0
  if (!('exp' in user)) user.exp = 0
  if (!('level' in user)) user.level = 0

  let name = await conn.getName(who)
  let pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://i.ibb.co/cSCf8VWv/perfil.png')

  let expSiguiente = (user.level + 1) * 100
  let porcentajeExp = Math.min(100, Math.floor((user.exp / expSiguiente) * 100))

  let crearBarra = (actual, maximo, longitud = 10) => {
    let porcentaje = Math.max(0, Math.min(1, actual / maximo))
    let llenas = Math.round(porcentaje * longitud)
    let vacias = longitud - llenas
    return '█'.repeat(llenas) + '░'.repeat(vacias)
  }

  let barraVida = crearBarra(user.health, user.maxHealth)
  let barraMana = crearBarra(user.mana, user.maxMana)
  let barraExp = crearBarra(user.exp, expSiguiente)

  let totalNeto = (user.diamantes || 0) + (user.bank || 0)

  let texto = '*_Hinata-Bot_*\n\n'
  
  texto += '➮ *_PERFIL_*\n'
  texto += '✰ *_Nombre_*: ' + name + '\n'
  texto += '✰ *_Clase_*: ' + user.class + '\n'
  texto += '✰ *_Nivel_*: ' + user.level + '\n\n'

  texto += '➮ *_EXPERIENCIA_*\n'
  texto += '✰ ' + barraExp + '\n'
  texto += '> ' + user.exp + ' / ' + expSiguiente + ' (' + porcentajeExp + '%)\n\n'

  texto += '➮ *_COMBATE_*\n'
  texto += '✰ *_Vida_*\n' + barraVida + '\n'
  texto += '> ' + user.health + ' / ' + user.maxHealth + '\n'
  texto += '✰ *_Mana_*\n' + barraMana + '\n'
  texto += '> ' + user.mana + ' / ' + user.maxMana + '\n'
  texto += '✰ *_Ataque_*: ' + user.attack + '\n'
  texto += '✰ *_Defensa_*: ' + user.defense + '\n\n'

  texto += '➮ *_ECONOMIA_*\n'
  texto += '✰ *_Diamantes_*: ' + user.diamantes + '\n'
  texto += '✰ *_Banco_*: ' + user.bank + '\n'
  texto += '✰ *_Total neto_*: ' + totalNeto + '\n\n'

  texto += '➮ *_EQUIPAMIENTO_*\n'
  texto += '✰ *_Inventario_*: ' + (user.inventory?.length || 0) + ' items\n'
  texto += '✰ *_Arma_*: ' + (user.equipment?.weapon || 'Ninguna') + '\n'
  texto += '✰ *_Armadura_*: ' + (user.equipment?.armor || 'Ninguna') + '\n'
  texto += '✰ *_Accesorio_*: ' + (user.equipment?.accessory || 'Ninguno') + '\n'

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: texto,
    mentions: [who],
    contextInfo: {
      mentionedJid: [who],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363407253203904@newsletter',
        newsletterName: '𓆩⚝𓆪 ʜɪɴᴀᴛᴀ ᴏꜰɪᴄɪᴀʟ 𓆩⚝𓆪',
        serverMessageId: 1
      }
    }
  })
}

handler.help = ['perfil']
handler.tags = ['rpg']
handler.command = /^(perfil|profile|stats|status)$/i
handler.desc = 'Muestra tu perfil RPG'

export default handler