// Código de WILKER OFC

import { execSync } from 'child_process';

const keywords = ['update', 'up', 'fix'];

// Ejecutar comandos Git de forma segura
function runGit(command) {
  try {
    return execSync(command, { stdio: 'pipe' }).toString().trim();
  } catch (error) {
    throw new Error(error.message || '❌ Error al ejecutar Git.');
  }
}

// Detectar archivos en conflicto
function getConflictedFiles() {
  try {
    const status = runGit('git status --porcelain');
    if (!status) return [];

    return status
      .split('\n')
      .map(line => line.slice(3))
      .filter(file =>
        !file.startsWith('.npm/') &&
        !file.startsWith('Sessions/Principal/') &&
        !file.startsWith('node_modules/') &&
        !file.startsWith('package-lock.json') &&
        !file.startsWith('database.json') &&
        !file.startsWith('.cache/') &&
        !file.startsWith('tmp/')
      );
  } catch (err) {
    console.error('⚠️ Error al verificar conflictos:', err);
    return [];
  }
}

const handler = async (m, { conn, args }) => {
  try {
    await conn.reply(m.chat, '⏳ *_Actualizando Elyssia MD... Por favor espera..._*', m);

    // Ejecutar git pull
    const gitCmd = 'git pull' + (args.length ? ' ' + args.join(' ') : '');
    const output = runGit(gitCmd);

    const isUpdated = output.includes('Already up to date');
    const updateMsg = isUpdated
      ? '✨ *Elyssia MD🌸 ya está a la última ACTUALIZACIÓN. ¡Nada que actualizar!*'
      : `✅ *Actualización completada con éxito:*\n\n${output}`;

    await conn.reply(m.chat, updateMsg, m);

  } catch (error) {
    console.error('❌ Error al actualizar:', error);

    const conflictedFiles = getConflictedFiles();
    let conflictMsg = '❌ *Hubo un problema al actualizar Elyssia MD.*';

    if (conflictedFiles.length > 0) {
      conflictMsg = `⚠️ *Conflictos detectados en archivos importantes:*\n\n` +
        conflictedFiles.map(f => `• ${f}`).join('\n') +
        `\n\n🔧 *Sugerencia Elyssia:* resuelve los conflictos manualmente o reinstala el bot.`;
    }

    await conn.reply(m.chat, conflictMsg, m);
  }
};

// Configuración de comandos
handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update', 'up', 'fix'];
handler.rowner = true;

// Activación automática por palabra clave
handler.all = async function (m) {
  if (!m.text || typeof m.text !== 'string') return;

  const input = m.text.trim().toLowerCase();
  if (keywords.includes(input)) {
    return handler(m, { conn: this, args: [] });
  }
};

export default handler;