import fs from 'fs'
import path from 'path'

// ============================================
// BOT ON/OFF POR GRUPO (ADMINS Y OWNERS)
// ============================================
const BOT_STATE_FILE = path.join(process.cwd(), 'storage', 'bot_state.json');

function loadBotState() {
  try {
    if (!fs.existsSync(BOT_STATE_FILE)) {
      const dir = path.dirname(BOT_STATE_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(BOT_STATE_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    return JSON.parse(fs.readFileSync(BOT_STATE_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveBotState(data) {
  try {
    const dir = path.dirname(BOT_STATE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BOT_STATE_FILE, JSON.stringify(data, null, 2));
  } catch {}
}

function isBotOff(groupId) {
  const state = loadBotState();
  return state[groupId] === true;
}

function setBotState(groupId, enabled) {
  const state = loadBotState();
  if (enabled) {
    delete state[groupId];
  } else {
    state[groupId] = true;
  }
  saveBotState(state);
}

// ============================================
// COMANDO aparte para admins
// ============================================
let handler = async (m, { conn, isAdmin, isOwner }) => {
  const from = m.chat
  
  if (!isAdmin && !isOwner) {
    return m.reply('*_Solo administradores o owners pueden usar este comando_*')
  }
  
  const args = m.text.split(' ')
  if (args.length < 2) {
    return m.reply(
      `*_BOT CONTROL_*\n\n` +
      `➮ Uso:\n` +
      `✰ .bot on  - Encender bot en este grupo\n` +
      `✰ .bot off - Apagar bot en este grupo\n\n` +
      `➮ Estado actual: *_${isBotOff(from) ? 'Apagado' : 'Encendido'}_*`
    )
  }
  
  const action = args[1].toLowerCase()
  
  if (action === 'on') {
    setBotState(from, true)
    await m.reply('*_Bot encendido en este grupo_*')
  } else if (action === 'off') {
    setBotState(from, false)
    await m.reply('*_Bot apagado en este grupo_*')
  } else {
    m.reply('*_Usa .bot on o .bot off_*')
  }
}

handler.command = ['bot']
handler.group = true
handler.admin = true
handler.tags = ['grupo']
handler.help = ['bot on/off']

export default handler