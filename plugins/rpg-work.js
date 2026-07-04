let cooldownsWork = {}

let handler = async (m, { conn }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { diamantes: 0, exp: 0, level: 0 }
    user = global.db.data.users[who]
  }

  let now = Date.now()
  let cd = cooldownsWork[who] || 0
  let tiempoRestante = Math.ceil((cd - now) / 1000)

  if (now < cd) {
    let minutos = Math.floor(tiempoRestante / 60)
    let segundos = tiempoRestante % 60
    return conn.sendMessage(m.chat, {
      text: `*_Hinata-Bot_*\n\n➮ *_WORK_*\n✰ Descansando...\n✰ Tiempo restante: *_${minutos}m ${segundos}s_*`,
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

  let random = Math.random()
  let diamantes = 1
  let exp = Math.floor(Math.random() * 20) + 5
  let rareza = ''

  if (random < 0.15) {
    diamantes = 2
    rareza = '**'
  } else if (random < 0.05) {
    diamantes = 3
    rareza = '***'
  }

  let trabajos = [
    { texto: 'Programaste una app y te pagaron', exp: 15, diamantes: 2 },
    { texto: 'Cocinaste en un restaurante', exp: 10, diamantes: 1 },
    { texto: 'Repartiste paquetes por la ciudad', exp: 12, diamantes: 1 },
    { texto: 'Cantaste en la calle y te dieron propina', exp: 8, diamantes: 2 },
    { texto: 'Trabajaste en construccion', exp: 18, diamantes: 2 },
    { texto: 'Vendiste seguros por telefono', exp: 10, diamantes: 1 },
    { texto: 'Vendiste un dibujo en la plaza', exp: 5, diamantes: 3 },
    { texto: 'Diste clases particulares', exp: 20, diamantes: 2 },
    { texto: 'Hiciste delivery de comida', exp: 12, diamantes: 1 },
    { texto: 'Trabajaste como mesero', exp: 14, diamantes: 1 },
    { texto: 'Fuiste DJ en una fiesta', exp: 16, diamantes: 2 },
    { texto: 'Diste un concierto en la plaza', exp: 22, diamantes: 3 },
    { texto: 'Trabajaste como diseñador grafico', exp: 18, diamantes: 2 },
    { texto: 'Hiciste un trabajo de edicion de video', exp: 20, diamantes: 2 },
    { texto: 'Vendiste ropa en el mercado', exp: 10, diamantes: 1 },
    { texto: 'Trabajaste como fotografo', exp: 15, diamantes: 2 },
    { texto: 'Hiciste un curso de programacion y ganaste', exp: 25, diamantes: 3 },
    { texto: 'Trabajaste en una tienda de mascotas', exp: 12, diamantes: 1 },
    { texto: 'Fuiste guia turistico', exp: 16, diamantes: 2 },
    { texto: 'Trabajaste como escritor freelancer', exp: 20, diamantes: 2 },
    { texto: 'Hiciste un trabajo de traduccion', exp: 15, diamantes: 1 },
    { texto: 'Trabajaste como community manager', exp: 18, diamantes: 2 },
    { texto: 'Hiciste un curso de cocina y vendiste tus platos', exp: 22, diamantes: 3 },
    { texto: 'Trabajaste en un cine', exp: 10, diamantes: 1 },
    { texto: 'Fuiste animador de eventos', exp: 14, diamantes: 2 },
    { texto: 'Trabajaste como diseñador de interiores', exp: 20, diamantes: 2 },
    { texto: 'Hiciste una venta de arte', exp: 8, diamantes: 3 },
    { texto: 'Trabajaste como musico callejero', exp: 12, diamantes: 2 },
    { texto: 'Diste un discurso motivacional', exp: 25, diamantes: 3 },
    { texto: 'Trabajaste como personal trainer', exp: 18, diamantes: 2 },
    { texto: 'Hiciste un curso de marketing digital', exp: 22, diamantes: 2 },
    { texto: 'Trabajaste como recepcionista', exp: 10, diamantes: 1 },
    { texto: 'Fuiste voluntario en un refugio', exp: 15, diamantes: 2 },
    { texto: 'Trabajaste como ilustrador', exp: 20, diamantes: 2 },
    { texto: 'Hiciste un trabajo de investigacion', exp: 25, diamantes: 3 },
    { texto: 'Trabajaste como creador de contenido', exp: 18, diamantes: 2 },
    { texto: 'Hiciste una obra de caridad', exp: 30, diamantes: 4 },
    { texto: 'Trabajaste como estratega de negocios', exp: 28, diamantes: 3 },
    { texto: 'Hiciste un emprendimiento exitoso', exp: 35, diamantes: 5 },
    { texto: 'Trabajaste como analista de datos', exp: 22, diamantes: 2 },
    { texto: 'Hiciste un viaje de trabajo y te pagaron bien', exp: 30, diamantes: 4 }
  ]

  let perdidas = [
    { texto: 'Te estafaron con un trabajo falso', diamantes: -1, exp: -5 },
    { texto: 'Apostaste tu pago y perdiste', diamantes: -1, exp: -5 },
    { texto: 'Te robaron el dinero del dia', diamantes: -2, exp: -10 },
    { texto: 'El cliente no te pago', diamantes: -1, exp: -8 },
    { texto: 'Te enfermaste y no pudiste trabajar', diamantes: -1, exp: -5 },
    { texto: 'Perdiste tu billetera con el pago', diamantes: -2, exp: -10 },
    { texto: 'Te despidieron injustamente', diamantes: -1, exp: -8 },
    { texto: 'Tu negocio quebro', diamantes: -3, exp: -15 },
    { texto: 'Te multaron por no tener permisos', diamantes: -2, exp: -5 },
    { texto: 'El banco te cobro una comision alta', diamantes: -1, exp: -3 },
    { texto: 'Perdiste tu trabajo por llegar tarde', diamantes: -1, exp: -8 },
    { texto: 'El proyecto se cancelo', diamantes: -1, exp: -10 },
    { texto: 'Te robaron la computadora del trabajo', diamantes: -3, exp: -15 },
    { texto: 'Tu socio te estafo', diamantes: -3, exp: -10 },
    { texto: 'La empresa cerro y no te pagaron', diamantes: -2, exp: -12 },
    { texto: 'Te equivocaste en un proyecto importante', diamantes: -2, exp: -15 },
    { texto: 'Te robaron en la calle', diamantes: -2, exp: -5 },
    { texto: 'El cliente te devolvio el trabajo', diamantes: -1, exp: -8 },
    { texto: 'Te estafaron con una inversion', diamantes: -3, exp: -10 },
    { texto: 'Perdiste tu cartera con el dinero', diamantes: -2, exp: -8 },
    { texto: 'No te pagaron por un trabajo completado', diamantes: -1, exp: -10 },
    { texto: 'La crisis economica te afecto', diamantes: -2, exp: -12 },
    { texto: 'Tu equipo de trabajo fallo', diamantes: -1, exp: -8 },
    { texto: 'Te robaron el celular del trabajo', diamantes: -2, exp: -5 },
    { texto: 'El banco te cobro intereses altos', diamantes: -1, exp: -3 },
    { texto: 'Tu negocio tuvo perdidas', diamantes: -3, exp: -15 },
    { texto: 'Te descontaron por llegar tarde', diamantes: -1, exp: -5 },
    { texto: 'El cliente te pidio un reembolso', diamantes: -2, exp: -10 },
    { texto: 'Te estafaron con un curso falso', diamantes: -2, exp: -8 },
    { texto: 'La devaluacion te afecto', diamantes: -2, exp: -10 },
    { texto: 'Perdiste una demanda laboral', diamantes: -3, exp: -15 },
    { texto: 'Te robaron las herramientas de trabajo', diamantes: -2, exp: -5 },
    { texto: 'Tu jefe te rebajo el sueldo', diamantes: -1, exp: -8 },
    { texto: 'La pandemia afecto tu trabajo', diamantes: -2, exp: -12 },
    { texto: 'Te estafaron con un producto', diamantes: -2, exp: -8 },
    { texto: 'Perdiste tu puesto por recorte', diamantes: -2, exp: -10 }
  ]

  let esPerdida = random < 0.10
  let trabajo
  let cambioDiamantes
  let cambioExp

  if (esPerdida) {
    trabajo = perdidas[Math.floor(Math.random() * perdidas.length)]
    cambioDiamantes = trabajo.diamantes
    cambioExp = trabajo.exp || -5
  } else {
    trabajo = trabajos[Math.floor(Math.random() * trabajos.length)]
    cambioDiamantes = trabajo.diamantes || diamantes
    cambioExp = trabajo.exp || exp
  }

  user.diamantes = Math.max(0, (user.diamantes || 0) + cambioDiamantes)
  user.exp = Math.max(0, (user.exp || 0) + cambioExp)
  cooldownsWork[who] = now + 120000

  let texto = `*_Hinata-Bot_*\n\n`
  texto += `➮ *_WORK_*\n`
  texto += `✰ ${trabajo.texto}\n`
  texto += `✰ Diamantes: ${cambioDiamantes > 0 ? '+' : ''}${cambioDiamantes} ${rareza}\n`
  texto += `✰ Experiencia: ${cambioExp > 0 ? '+' : ''}${cambioExp}\n`
  texto += `✰ Total diamantes: ${user.diamantes}\n`
  texto += `✰ Total exp: ${user.exp}\n\n`
  texto += `➮ *_COOLDOWN_*\n✰ 2 minutos`

  await conn.sendMessage(m.chat, {
    text: texto,
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

handler.help = ['work']
handler.tags = ['rpg']
handler.command = /^(work|trabajar|chamba)$/i
handler.desc = 'Trabaja para ganar diamantes y exp'

export default handler