import { exec } from 'child_process'

const handler = async (m, { conn }) => {
  let who = m.sender

  let textoEspera = '*_Hinata-Bot_*\n\n'
  textoEspera += '➮ *_ACTUALIZANDO_*\n'
  textoEspera += '✰ Buscando actualizaciones...\n'
  textoEspera += '✰ Espera un momento...'

  await conn.sendMessage(m.chat, { text: textoEspera }, { quoted: m })

  exec('git pull', async (err, stdout, stderr) => {
    if (err) {
      let error = err.message
      let motivo = 'Error inesperado'
      let solucion = error

      if (error.includes('not a git repository')) {
        motivo = 'No es un repositorio git'
        solucion = 'Clona el bot con git clone'
      } else if (error.includes('Could not resolve host')) {
        motivo = 'Sin conexion a internet'
        solucion = 'Verifica tu conexion'
      } else if (error.includes('Merge conflict')) {
        motivo = 'Conflicto de fusion detectado'
        solucion = 'Usa fixpull para forzar'
      } else if (error.includes('Please commit')) {
        motivo = 'Tienes cambios locales sin guardar'
        solucion = 'Usa fixpull para forzar'
      }

      let textoError = '*_Hinata-Bot_*\n\n'
      textoError += '➮ *_ERROR_*\n'
      textoError += '✰ *_Motivo_*: ' + motivo + '\n'
      textoError += '✰ *_Solucion_*: ' + solucion

      await conn.sendMessage(m.chat, { text: textoError }, { quoted: m })
      return
    }

    if (stdout.includes('Already up to date')) {
      let textoAlDia = '*_Hinata-Bot_*\n\n'
      textoAlDia += '➮ *_ESTADO_*\n'
      textoAlDia += '✰ Hinata ya esta en su mejor version\n'
      textoAlDia += '✰ No hay actualizaciones pendientes\n\n'
      textoAlDia += '➮ *_SOLICITADO POR_*\n'
      textoAlDia += '✰ @' + who.split('@')[0]

      await conn.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/b7a14a.png' },
        caption: textoAlDia,
        mentions: [who]
      }, { quoted: m })
      return
    }

    let creados = stdout.match(/create mode \d+ (.+)/g) || []
    let eliminados = stdout.match(/delete mode \d+ (.+)/g) || []

    let filesCreados = creados.map(c => c.split(' ').pop())
    let filesEliminados = eliminados.map(c => c.split(' ').pop())

    let texto = '*_Hinata-Bot Actualizada_*\n\n'

    texto += '➮ *_RESUMEN_*\n'
    texto += '✰ Hinata se ha renovado\n\n'

    if (filesCreados.length > 0) {
      texto += '➮ *_NUEVOS ARCHIVOS_*\n'
      for (let file of filesCreados.slice(0, 15)) {
        texto += '✰ ' + file + '\n'
      }
      if (filesCreados.length > 15) {
        texto += '> y ' + (filesCreados.length - 15) + ' archivo(s) mas\n'
      }
      texto += '\n'
    }

    let changedMatch = stdout.match(/(\d+) files? changed/)
    if (changedMatch) {
      texto += '➮ *_ARCHIVOS MODIFICADOS_*\n'
      texto += '✰ ' + changedMatch[1] + ' archivo(s)\n\n'
    }

    if (filesEliminados.length > 0) {
      texto += '➮ *_ARCHIVOS ELIMINADOS_*\n'
      for (let file of filesEliminados.slice(0, 15)) {
        texto += '✰ ' + file + '\n'
      }
      if (filesEliminados.length > 15) {
        texto += '> y ' + (filesEliminados.length - 15) + ' archivo(s) mas\n'
      }
      texto += '\n'
    }

    let summary = stdout.match(/\d+ files? changed, \d+ insertions?\(\+\), \d+ deletions?\(-\)/)
    if (summary) {
      let nums = summary[0].match(/\d+/g)
      texto += '➮ *_CAMBIOS DE CODIGO_*\n'
      texto += '✰ +' + nums[1] + ' linea(s) agregada(s)\n'
      texto += '✰ -' + nums[2] + ' linea(s) eliminada(s)\n\n'
    }

    texto += '➮ *_SOLICITADO POR_*\n'
    texto += '✰ @' + who.split('@')[0]

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/b7a14a.png' },
      caption: texto,
      mentions: [who]
    }, { quoted: m })

    setTimeout(() => {
      console.log('[UPDATE] Reiniciando proceso para aplicar cambios...')
      process.exit(0)
    }, 3000)
  })
}

handler.help = ['update', 'fix']
handler.tags = ['owner']
handler.command = /^(update|actualizar|fix|fixpull)$/i
handler.desc = 'Actualiza Hinata'
handler.owner = true

export default handler