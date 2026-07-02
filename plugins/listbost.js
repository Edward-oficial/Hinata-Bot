import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('*_Solo el owner puede usar este comando_*')
  
  let texto = '*_LISTA DE BOTS ACTIVOS_*\n\n'
  
  const mainBot = conn.user?.jid || 'Desconocido'
  const mainName = conn.user?.name || 'Hinata-Bot'
  texto += '➮ BOT PRINCIPAL\n'
  texto += `✰ Nombre: *_${mainName}_*\n`
  texto += `✰ JID: *_${mainBot}_*\n`
  texto += `✰ Estado: *_${conn.ws?.readyState === 1 ? 'Conectado' : 'Desconectado'}_*\n\n`
  
  if (global.conns && global.conns.length > 0) {
    texto += '➮ SUBHINATA\n'
    let count = 0
    for (const bot of global.conns) {
      if (bot.user?.jid) {
        count++
        texto += `✰ SubHinata #${count}\n`
        texto += `   Nombre: *_${bot.user?.name || 'SubHinata'}_*\n`
        texto += `   JID: *_${bot.user?.jid}_*\n`
        texto += `   Estado: *_${bot.ws?.readyState === 1 ? 'Conectado' : 'Desconectado'}_*\n\n`
      }
    }
    if (count === 0) texto += '✰ No hay SubHinata activos\n'
  } else {
    texto += '➮ SUBHINATA\n✰ No hay SubHinata activos\n'
  }
  
  const subHinataPath = path.join(process.cwd(), 'subHinata')
  if (fs.existsSync(subHinataPath)) {
    const dirs = fs.readdirSync(subHinataPath).filter(d => 
      fs.statSync(path.join(subHinataPath, d)).isDirectory()
    )
    if (dirs.length > 0) {
      texto += '\n➮ SUBHINATA EN ESPERA\n'
      for (const dir of dirs) {
        const credsPath = path.join(subHinataPath, dir, 'creds.json')
        const tieneCreds = fs.existsSync(credsPath)
        texto += `✰ ${dir} ${tieneCreds ? '✅' : '⏳'}\n`
      }
    }
  }
  
  texto += '\n➮ TOTAL BOTS: *_' + (1 + (global.conns?.length || 0)) + '_*'
  
  await m.reply(texto)
}

handler.command = ['listbots', 'bots', 'subhinata']
handler.owner = true
handler.tags = ['owner']
handler.help = ['listbots - Ver todos los bots activos']

export default handler