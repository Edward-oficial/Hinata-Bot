#!/usr/bin/env node
// build-edw.cjs — corre ANTES de "node index.js"
// Busca todos los .edw dentro de las carpetas indicadas, los transpila a .js,
// y si alguno tiene un error de sintaxis, PARA el arranque del bot con un
// mensaje claro (en vez de dejar que el bot truene raro más adelante).

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { transpile } = require('./edw2js.cjs');

// Carpetas donde el bot busca comandos/plugins. Ajusta si tu estructura es otra.
const CARPETAS_A_REVISAR = ['plugins', 'comandos-edw'];

function buscarArchivosEdw(dir) {
  if (!fs.existsSync(dir)) return [];
  let resultados = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      resultados = resultados.concat(buscarArchivosEdw(full));
    } else if (entry.name.endsWith('.edw')) {
      resultados.push(full);
    }
  }
  return resultados;
}

function validarSintaxis(rutaJs) {
  // Node valida sintaxis sin ejecutar el archivo. Copiamos a .mjs temporal
  // porque el proyecto es ESM y así --check respeta "import/export".
  const temp = rutaJs.replace(/\.js$/, '.__check__.mjs');
  fs.copyFileSync(rutaJs, temp);
  try {
    execFileSync(process.execPath, ['--check', temp], { stdio: 'pipe' });
  } finally {
    fs.unlinkSync(temp);
  }
}

let huboError = false;
let totalCompilados = 0;

for (const carpeta of CARPETAS_A_REVISAR) {
  const archivos = buscarArchivosEdw(carpeta);
  for (const archivoEdw of archivos) {
    const archivoJs = archivoEdw.replace(/\.edw$/, '.js');
    try {
      const fuente = fs.readFileSync(archivoEdw, 'utf8');
      const js = transpile(fuente);
      fs.writeFileSync(archivoJs, js);
      validarSintaxis(archivoJs);
      totalCompilados++;
      console.log(`✅ ${archivoEdw} -> ${archivoJs}`);
    } catch (err) {
      huboError = true;
      console.error(`\n❌ Error compilando ${archivoEdw}:`);
      console.error(err.message.split('\n').slice(0, 6).join('\n'));
      console.error('');
    }
  }
}

if (huboError) {
  console.error('🚫 Hay archivos .edw con errores. El bot NO va a arrancar hasta que los corrijas.');
  process.exit(1);
}

if (totalCompilados > 0) {
  console.log(`\n🍥 EDW LANG: ${totalCompilados} archivo(s) compilado(s) correctamente.\n`);
}
