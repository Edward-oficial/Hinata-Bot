import { exec } from 'child_process'

const handler = async (m, { conn }) => {
  let who = m.sender
  
  await conn.sendMessage(m.chat, { text: '⏳ Actualizando HINATA BOT...' }, { quoted: m })

  exec('git pull', async (err, stdout, stderr) => {
    if (err) {
      let error = err.message
      if (error.includes('not a git repository')) {
        await conn.sendMessage(m.chat, { text: '❌ No es un repositorio git' }, { quoted: m })
        return
      }
      if (error.includes('Could not resolve host')) {
        await conn.sendMessage(m.chat, { text: '❌ Sin conexión a internet' }, { quoted: m })
        return
      }
      await conn.sendMessage(m.chat, { text: '❌ Error:\n' + error }, { quoted: m })
      return
    }

    if (stdout.includes('Already up to date')) {
      await conn.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/5tegkb.png' },
        caption: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\nׄㅤ𑁍ࠬܓε(´｡•᎑•`)っ ᜒ ✅ Ya estás en la última versión de HINATA BOT\n\n> Solicitado por @' + who.split('@')[0],
        mentions: [who]
      }, { quoted: m })
      return
    }

    let cambios = stdout.match(/\d+ files? changed/g)
    let inserciones = stdout.match(/\d+ insertions?/g)
    let borrados = stdout.match(/\d+ deletions?/g)

    let texto = '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ACTUALIZADO ㅤ֢ㅤׄㅤׅ\n\n'
    texto += 'ׄㅤ𑁍ࠬܓε(´｡•᎑•`)っ ᜒ ✅ Actualización exitosa\n\n'
    if (cambios) texto += '📁 ' + cambios.join(', ') + '\n'
    if (inserciones) texto += '➕ ' + inserciones.join(', ') + '\n'
    if (borrados) texto += '➖ ' + borrados.join(', ') + '\n'
    texto += '\n> Solicitado por @' + who.split('@')[0]

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/5tegkb.png' },
      caption: texto,
      mentions: [who]
    }, { quoted: m })
  })
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = /^(update)$/i
handler.desc = 'Actualiza la bot a la última versión'
handler.owner = true

export default handler
