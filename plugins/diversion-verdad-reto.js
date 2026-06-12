import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

const VERDADES = [
  '¿Cuál es tu mayor miedo?',
  '¿Alguna vez has mentido a alguien que amas?',
  '¿Cuál es tu secreto más oscuro?',
  '¿A quién le tienes más envidia en este grupo?',
  '¿Cuál fue tu mayor vergüenza?',
  '¿Has robado algo alguna vez?',
  '¿De quién estás enamorado/a actualmente?',
  '¿Cuál es la peor mentira que has dicho?',
  '¿Alguna vez has traicionado a un amigo?',
  '¿Qué es lo más estúpido que has hecho por amor?',
  '¿A quién de aquí mandarías lejos?',
  '¿Cuántas personas has besado?',
  '¿Cuál es tu mayor arrepentimiento?',
  '¿Alguna vez has llorado por alguien que no valía la pena?',
  '¿Qué piensas realmente de tu mejor amigo/a?',
  '¿Cuál es tu tipo ideal de persona?',
  '¿Has leído conversaciones ajenas sin permiso?',
  '¿Qué harías con 10 millones de dólares?',
  '¿Alguna vez fingiste estar enfermo para no hacer algo?',
  '¿Cuál es la cosa más rara que has buscado en internet?',
  '¿A quién de este grupo bloquearías si pudieras?',
  '¿Cuál ha sido tu crush más vergonzoso?',
  '¿Alguna vez has hablado mal de alguien de este grupo?',
  '¿Cuál es tu mayor inseguridad?',
  '¿Qué es lo que más te avergüenza de ti mismo/a?',
  '¿Alguna vez has sentido celos de un amigo?',
  '¿Cuál fue la vez que más lloraste?',
  '¿Qué harías si supieras que te queda un día de vida?',
  '¿Has tenido sentimientos por alguien que no debías?',
  '¿Cuál es la cosa más mala que has hecho sin que nadie lo sepa?',
  '¿Alguna vez has mentido en una entrevista de trabajo?',
  '¿Cuántas veces revisas tu celular al día?',
  '¿A quién de aquí llamarías a las 3am si necesitas ayuda?',
  '¿Cuál es tu mayor adicción?',
  '¿Has fingido que te gustaba algo para caerle bien a alguien?',
  '¿Cuál es el insulto más feo que le has dicho a alguien?',
  '¿Alguna vez te has enamorado de un desconocido?',
  '¿Cuál es la cosa más inmadura que haces todavía?',
  '¿Qué es lo que más odias de ti mismo/a?',
  '¿Alguna vez has roto algo y culpado a otro?',
  '¿Cuál es tu mayor talento oculto?',
  '¿Has mentido sobre tu edad alguna vez?',
  '¿Qué es lo que más te da vergüenza admitir que te gusta?',
  '¿Alguna vez has espiado a alguien?',
  '¿Cuál es la peor travesura que has hecho?',
  '¿A quién envidias secretamente en tu vida?',
  '¿Has fingido no leer un mensaje para no responder?',
  '¿Cuál es la cosa más rara que te atrae de alguien?',
  '¿Alguna vez has hecho algo que te avergüenza mucho y nunca contaste?',
  '¿Qué harías si descubrieras que tu mejor amigo te traicionó?',
  '¿Cuál es tu peor hábito?',
  '¿Alguna vez has dicho "te quiero" sin sentirlo?',
  '¿Qué es lo que más te cuesta admitir?',
  '¿Has hecho algo malo y nunca pediste perdón?',
  '¿Cuál es la mentira que más veces has repetido?',
  '¿A quién de aquí le dirías algo que nunca te has atrevido?',
  '¿Cuál fue el momento en que más te arrepentiste de algo?',
  '¿Alguna vez has rechazado a alguien y lo lamentaste después?',
  '¿Qué es lo más loco que harías por dinero?',
  '¿Cuántas relaciones has tenido?',
  '¿Alguna vez has tenido un sueño muy vergonzoso con alguien de aquí?',
  '¿Cuál es tu mayor miedo en el amor?',
  '¿Has bloqueado a alguien sin razón?',
  '¿Qué es lo que nadie sabe de ti?',
  '¿Alguna vez has mentido para salir de una situación difícil?',
  '¿Cuál es la cosa más estúpida que has hecho estando enojado/a?',
  '¿A quién de este grupo le darías un abrazo ahora mismo?',
  '¿Cuál es tu mayor complejo físico?',
  '¿Has hecho algo que va en contra de tus valores?',
  '¿Cuál es la peor decisión que has tomado?',
  '¿Alguna vez has utilizado a alguien para conseguir algo?',
  '¿Qué es lo que más te cuesta perdonar?',
  '¿Cuál es la cosa más romántica que has hecho?',
  '¿Has mentido sobre tus sentimientos alguna vez?',
  '¿Cuál fue el día más difícil de tu vida?',
  '¿Alguna vez has hecho algo solo por encajar?',
  '¿Qué es lo que más te avergüenza de tu pasado?',
  '¿A quién de aquí admirás en secreto?',
  '¿Cuál es tu mayor sueño que nunca has contado?',
  '¿Has dicho algo hiriente a alguien y te arrepentiste?',
  '¿Cuál es la cosa más egoísta que has hecho?',
  '¿Alguna vez has sentido que no encajas en ningún lado?',
  '¿Qué es lo que más te cuesta decir en voz alta?',
  '¿Cuál es tu mayor secreto familiar?',
  '¿Has actuado diferente para gustarle a alguien?',
  '¿Cuál es la cosa más irresponsable que has hecho?',
  '¿Alguna vez has deseado ser otra persona?',
  '¿Qué harías si te enteraras que alguien de aquí te odia?',
  '¿Cuál es la cosa que más te da miedo perder?',
  '¿Has tenido un pensamiento del que te avergüenzas mucho?',
  '¿Cuál es la mayor injusticia que has cometido?',
  '¿Alguna vez has huido de un problema en vez de enfrentarlo?',
  '¿Qué es lo que más te cuesta cambiar de ti mismo/a?',
  '¿Cuál es la cosa más impulsiva que has hecho?',
  '¿Has herido a alguien sin querer y nunca lo supieron?',
  '¿Cuál es tu mayor debilidad?',
  '¿Alguna vez has actuado valiente cuando en realidad tenías miedo?',
  '¿Qué es lo que más extrañas de tu pasado?',
]

const RETOS = [
  'Imita a alguien de este grupo',
  'Di algo bonito a cada persona del grupo',
  'Canta 30 segundos de tu canción favorita',
  'Haz 20 sentadillas ahora mismo',
  'Escribe un poema de amor en 1 minuto',
  'Habla con acento extraño los próximos 5 mensajes',
  'Envía una foto haciendo una cara graciosa',
  'Di 10 trabalenguas sin equivocarte',
  'Escríbele un mensaje cursi a alguien del grupo',
  'Cuenta un chiste ahora mismo',
  'Di el nombre de todos los presentes al revés',
  'Haz una voz de dibujo animado por 1 minuto',
  'Escribe con los ojos cerrados una oración',
  'Mueve los pies como si bailaras por 30 segundos',
  'Di tres piropos a diferentes personas del grupo',
  'Haz tu mejor imitación de un robot',
  'Cuenta algo embarazoso que te haya pasado',
  'Escribe un trabalenguas inventado',
  'Describe a alguien del grupo sin decir su nombre',
  'Escribe un rap de 4 líneas ahora mismo',
  'Di el alfabeto al revés',
  'Haz 10 flexiones ahora mismo',
  'Envía un mensaje de voz cantando',
  'Escribe un haiku sobre este grupo',
  'Di tres cosas que admiras de alguien del grupo',
  'Imita a tu cantante favorito por 30 segundos',
  'Escribe un cuento de 5 líneas con emojis solamente',
  'Di una frase motivacional inventada por ti',
  'Haz tu mejor cara de sorpresa en foto',
  'Escribe una adivinanza y que el grupo la adivine',
  'Di 5 palabras en un idioma que no dominas',
  'Cuenta un secreto que no sea tan secreto',
  'Haz una reverencia de samuray por escrito',
  'Escribe el nombre de alguien del grupo en código morse',
  'Di 3 cosas que nunca harías',
  'Describe tu día de hoy en forma de telenovela',
  'Haz una declaración de amor dramática a nadie en especial',
  'Escribe 5 palabras que rimen con tu nombre',
  'Cuenta cuántos pasos hay desde tu silla hasta la puerta',
  'Describe tu personalidad con solo 3 emojis',
  'Di el nombre de 10 países en menos de 20 segundos',
  'Escribe una disculpa dramática por algo que no hiciste',
  'Haz tu mejor discurso presidencial en 3 líneas',
  'Nombra 15 animales en menos de 30 segundos',
  'Escribe una receta de cocina con ingredientes imposibles',
  'Di algo en inglés con acento exagerado',
  'Inventa un superhéroe y descríbelo en 2 líneas',
  'Escribe un titular de periódico sobre ti mismo/a',
  'Haz 3 chistes malos seguidos',
  'Describe al amor de tu vida sin mencionar apariencia física',
  'Di una mentira tan creíble que el grupo crea que es verdad',
  'Escribe la letra de una canción inventada en 1 minuto',
  'Haz tu mejor grito de guerra',
  'Nombra 10 personajes de anime en 15 segundos',
  'Escribe un villancico sobre este grupo',
  'Di 5 cosas positivas sobre ti mismo/a',
  'Escribe un monólogo dramático de 4 líneas',
  'Imita el sonido de 5 animales diferentes',
  'Cuenta el chiste más largo que sepas',
  'Escribe los 10 primeros países que vengan a tu mente',
  'Di una frase filosófica inventada que suene profunda',
  'Escribe una canción de cuna para alguien del grupo',
  'Haz tu mejor imitación de un noticiero',
  'Describe este juego como si fuera una película de terror',
  'Di 10 nombres de persona que empiecen con la misma letra',
  'Escribe un anuncio publicitario de ti mismo/a',
  'Nombra 5 películas con la misma primera letra de tu nombre',
  'Haz una oración con cada letra de tu nombre',
  'Escribe un epitafio gracioso para ti mismo/a',
  'Di el nome de 10 comidas sin repetir ninguna',
  'Haz tu mejor cara de villano de película',
  'Escribe un telegrama urgente sobre algo completamente trivial',
  'Nombra 8 capitales del mundo en 20 segundos',
  'Haz una lista de 10 cosas que harías si fueras invisible',
  'Escribe una promesa solemne sobre algo ridículo',
  'Di el nombre de todos los meses en inglés sin equivocarte',
  'Describe tu cuarto como si fuera un museo',
  'Haz tu mejor imitación de un chef famoso',
  'Escribe una constitución de 3 artículos para este grupo',
  'Di 5 cosas que te gustaría aprender antes de morir',
  'Escribe un mensaje de texto como si vinieras del futuro',
  'Nombra 10 objetos que tengas a la vista ahora mismo',
  'Haz tu mejor grito de karate',
  'Escribe una reseña de 3 estrellas sobre tu propia personalidad',
  'Di algo en japonés aunque lo inventes',
  'Describe tu trabajo soñado de la forma más dramática posible',
  'Escribe un aviso de "se busca" sobre ti mismo/a',
  'Nombra 5 marcas de carros sin repetir',
  'Haz una predicción del futuro de alguien del grupo',
  'Escribe un contrato de amistad con alguien del grupo',
  'Di 10 palabras que empiecen con la letra Z',
  'Describe tu película favorita en solo 3 palabras',
  'Haz tu mejor imitación de un bebé llorando',
  'Escribe una carta de renuncia a la pereza',
  'Nombra 7 frutas exóticas en menos de 15 segundos',
  'Di una frase motivacional cada vez que alguien te hable por los próximos 5 minutos',
  'Escribe un horóscopo inventado para cada signo en 1 minuto',
  'Haz una presentación de PowerPoint mental sobre tu vida en 3 diapositivas',
  'Di 3 cosas que cambiarías del mundo si pudieras',
  '¿Cuál es el reto más difícil que has superado en tu vida? Cuéntalo',
]

let handler = async (m, { conn, usedPrefix, command }) => {
  const interactiveMessage = proto.Message.InteractiveMessage.create({
    header: {
      title: '𑁍ࠬܓ HINATA BOT 𑁍ࠬܓ',
      subtitle: 'Verdad o Reto',
      hasMediaAttachment: false
    },
    body: {
      text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ ¿Te atreves a jugar?\n\n> Elige tu destino...`
    },
    footer: { text: '⫏⫏ HINATA BOT ✿' },
    nativeFlowMessage: {
      buttons: [{
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: '🎮 ELEGIR',
          sections: [{
            title: '¿Qué eliges?',
            rows: [
              { header: '💬', title: 'VERDAD', description: 'Una pregunta que debes responder con honestidad', id: 'vr_verdad' },
              { header: '⚡', title: 'RETO', description: 'Un desafío que debes cumplir', id: 'vr_reto' }
            ]
          }]
        })
      }]
    }
  })

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
  }, { quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  let id
  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    id = data.id || data.selectedId || data.selectedRowId || null
  } catch { return false }

  if (!id) return false

  if (id === 'vr_verdad') {
    const verdad = VERDADES[Math.floor(Math.random() * VERDADES.length)]
    await conn.sendMessage(m.chat, {
      video: { url: 'https://files.catbox.moe/og381s.mp4' },
      gifPlayback: true,
      caption: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n💬 *VERDAD*\n\n❀ ${verdad}\n`
    }, { quoted: m })
    return true
  }

  if (id === 'vr_reto') {
    const reto = RETOS[Math.floor(Math.random() * RETOS.length)]
    await conn.sendMessage(m.chat, {
      video: { url: 'https://files.catbox.moe/og381s.mp4' },
      gifPlayback: true,
      caption: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n🎧 *RETO*\n\n❀ ${reto}\n`
    }, { quoted: m })
    return true
  }

  return false
}

handler.help = ['verdad', 'reto']
handler.tags = ['diversion']
handler.command = /^(verdad|reto|vr|verdadOreto)$/i
handler.desc = 'Juego de verdad o reto'

export default handler
