import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const getMimeFromFilename = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map = {
    apk: 'application/vnd.android.package-archive',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    mp4: 'video/mp4',
    mkv: 'video/x-matroska',
    mp3: 'audio/mpeg',
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    exe: 'application/x-msdownload',
    iso: 'application/x-iso9660-image',
  }
  return map[ext] || 'application/octet-stream'
}

const scrapeMediafire = async (pageUrl) => {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  }

  const res = await fetch(pageUrl, { headers, redirect: 'follow', timeout: 30000 })
  const html = await res.text()
  const $ = cheerio.load(html)

  let directLink = null

  const btn = $('a#downloadButton, a.input.btn.btn-skyblue[href*="download"]')
  if (btn.length) directLink = btn.first().attr('href')

  if (!directLink) {
    $('script').each((_, el) => {
      const src = $(el).html() || ''
      const match = src.match(/https:\/\/download\d+\.mediafire\.com\/[^"'\s]+/)
      if (match) directLink = match[0]
    })
  }

  if (!directLink) {
    const match = html.match(/https:\/\/download\d+\.mediafire\.com\/[^"'\s<>]+/)
    if (match) directLink = match[0]
  }

  if (!directLink) throw new Error('No se encontró link de descarga (archivo eliminado o captcha)')

  directLink = directLink.replace(/&amp;/g, '&').trim()

  const filename = $('div.filename, .dl-btn-label, #filename').first().text().trim()
    || directLink.split('/').pop().replace(/\+/g, ' ') || 'archivo'

  const sizeText = $('ul.details li:nth-child(2) span, .dl-btn-data').first().text().trim() || '?'

  return { link: directLink, filename, sizeText }
}

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: '📥 「 HINATA MEDIAFIRE 」 📥\n\n💫 » Descarga archivos de MediaFire\n\n> #mediafire <link>\n> #mf <link>'
    }, { quoted: m })
  }

  if (!text.includes('mediafire.com')) {
    return conn.sendMessage(m.chat, {
      text: '📥 「 HINATA MEDIAFIRE 」 📥\n\n💫 » Solo links de MediaFire'
    }, { quoted: m })
  }

  await m.react('⏳')

  try {
    const { link, filename, sizeText } = await scrapeMediafire(text)
    const ext = filename.split('.').pop() || '?'
    const mimetype = getMimeFromFilename(filename)

    let texto = '📥 「 HINATA MEDIAFIRE 」 📥\n\n'
    texto += '📁 » *' + filename + '*\n'
    texto += '📦 » Tamaño: ' + sizeText + '\n'
    texto += '📄 » Formato: .' + ext + '\n\n'
    texto += '> Enviando archivo...'

    await conn.sendMessage(m.chat, { text: texto }, { quoted: m })

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer': 'https://www.mediafire.com/',
    }

    const fileRes = await fetch(link, { headers, redirect: 'follow', timeout: 300000 })
    if (!fileRes.ok) throw new Error(`HTTP ${fileRes.status}`)

    const ct = fileRes.headers.get('content-type')
    if (ct?.includes('text/html')) throw new Error('Mediafire bloqueó la descarga')

    const fileBuffer = Buffer.from(await fileRes.arrayBuffer())
    if (fileBuffer.length < 1024) throw new Error('Archivo muy pequeño, link inválido')

    await conn.sendMessage(m.chat, {
      document: fileBuffer,
      fileName: filename,
      mimetype: mimetype
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.react('❌')
    conn.sendMessage(m.chat, {
      text: '📥 「 HINATA MEDIAFIRE 」 📥\n\n💫 » Error al descargar\n\n> ' + e.message
    }, { quoted: m })
  }
}

handler.help = ['mediafire']
handler.tags = ['downloader']
handler.command = /^(mediafire|mf)$/i
handler.desc = 'Descarga archivos de MediaFire'

export default handler
