const sharp = require('sharp');
const path  = require('path');

const OUT = 'screenshots/blurred/';
require('fs').mkdirSync(OUT, { recursive: true });

// Gera SVG com retângulos de redação arredondados
function redact(rects) {
  const rs = rects.map(({ x, y, w, h }) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" ry="8" fill="#1a1a2e" opacity="0.97"/>`
  ).join('\n');
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><${rs.replace('<','')}</svg>`
    .replace('<svg xmlns="http://www.w3.org/2000/svg"><', `<svg xmlns="http://www.w3.org/2000/svg">${rs}`)
    .replace(/\n/g,'')
  );
}

function svgOverlay(w, h, rects) {
  const rs = rects.map(({ x, y, w: rw, h: rh }) =>
    `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" rx="10" ry="10" fill="#12131a" opacity="0.96"/>`
  ).join('');
  return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${rs}</svg>`);
}

async function process(file, ext, rects) {
  const input = `screenshots/${file}.${ext}`;
  const output = `${OUT}${file}.jpeg`;
  const meta = await sharp(input).metadata();
  const overlay = svgOverlay(meta.width, meta.height, rects);
  await sharp(input)
    .composite([{ input: overlay, blend: 'over' }])
    .jpeg({ quality: 92 })
    .toFile(output);
  console.log(`✓ ${file}.jpeg`);
}

// ── Coordenadas dos dados sensíveis (736×1600 exceto splash 780×1600) ──

// admin: nome clínica, data, email, cnpj, pacientes
process('admin', 'jpeg', [
  { x: 155, y: 875,  w: 450, h: 48 },   // "MR SOLUCOES EMPRESARIAIS"
  { x: 155, y: 925,  w: 280, h: 38 },   // "Desde 27/05/2026"
  { x: 105, y: 1030, w: 440, h: 40 },   // email
  { x: 105, y: 1080, w: 320, h: 40 },   // CNPJ
  { x: 105, y: 1125, w: 200, h: 38 },   // "2 pacientes"
]);

// home: saudação, nomes dos pacientes
process('home', 'jpeg', [
  { x: 40,  y: 130,  w: 430, h: 58 },   // "Olá, Robson Rodrigues"
  { x: 155, y: 1030, w: 340, h: 42 },   // "Lauren Rodrigues"
  { x: 155, y: 1155, w: 280, h: 42 },   // "Mayara Lima"
]);

// mode-select: "Bem-vindo, Robson" e nome da clínica
process('mode-select', 'jpeg', [
  { x: 165, y: 315,  w: 380, h: 52 },   // "Bem-vindo, Robson"
  { x: 115, y: 960,  w: 450, h: 52 },   // "MR SOLUCOES EMPRESARIAIS"
]);

// pacientes: fotos reais + nomes
process('pacientes', 'jpeg', [
  { x: 28,  y: 318,  w: 112, h: 112 },  // avatar Lauren (foto real)
  { x: 155, y: 323,  w: 340, h: 44 },   // "Lauren Rodrigues"
  { x: 28,  y: 445,  w: 112, h: 112 },  // avatar Mayara (foto real)
  { x: 155, y: 450,  w: 280, h: 44 },   // "Mayara Lima"
]);

// agenda: nomes pacientes e médicos nas consultas
process('agenda', 'jpeg', [
  { x: 135, y: 495,  w: 280, h: 38 },   // Mayara Lima (1)
  { x: 135, y: 538,  w: 240, h: 32 },   // Dr Mayara Lima
  { x: 135, y: 610,  w: 280, h: 38 },   // Mayara Lima (2)
  { x: 135, y: 653,  w: 260, h: 32 },   // Dr Robson Rodrigues
  { x: 135, y: 720,  w: 280, h: 38 },   // Mayara Lima (3)
  { x: 135, y: 763,  w: 260, h: 32 },   // Dr Robson Rodrigues
  { x: 135, y: 830,  w: 280, h: 38 },   // Mayara Lima (4)
  { x: 135, y: 873,  w: 260, h: 32 },   // Dr Robson Rodrigues
  { x: 135, y: 940,  w: 280, h: 38 },   // Mayara Lima (5)
  { x: 135, y: 983,  w: 260, h: 32 },   // Dr Robson Rodrigues
  { x: 135, y: 1050, w: 280, h: 38 },   // Mayara Lima (6)
  { x: 135, y: 1093, w: 260, h: 32 },   // Dr Robson Rodrigues
  // filtros de profissional (chips)
  { x: 132, y: 402,  w: 130, h: 40 },   // chip "Mayara"
  { x: 275, y: 402,  w: 140, h: 40 },   // chip "Robson"
]);

// agenda-lembretes: nomes no bottom sheet
process('agenda-lembretes', 'jpeg', [
  { x: 135, y: 870,  w: 280, h: 38 },   // Mayara Lima (1)
  { x: 135, y: 913,  w: 240, h: 32 },   // Dr Mayara Lima
  { x: 135, y: 975,  w: 280, h: 38 },   // Mayara Lima (2)
  { x: 135, y: 1018, w: 240, h: 32 },   // Dr Mayara Lima
  { x: 135, y: 1080, w: 280, h: 38 },   // Mayara Lima (3)
  { x: 135, y: 1123, w: 260, h: 32 },   // Dr Robson Rodrigues
  { x: 135, y: 1185, w: 280, h: 38 },   // Mayara Lima (4)
  { x: 135, y: 1228, w: 260, h: 32 },   // Dr Robson Rodrigues
  { x: 135, y: 1290, w: 280, h: 38 },   // Mayara Lima (5)
  { x: 135, y: 1333, w: 260, h: 32 },   // Dr Robson Rodrigues
  { x: 135, y: 1395, w: 280, h: 38 },   // Mayara Lima (6)
  { x: 135, y: 1438, w: 260, h: 32 },   // Dr Robson Rodrigues
  // banner do topo da agenda
  { x: 132, y: 402,  w: 130, h: 40 },   // chip "Mayara"
  { x: 275, y: 402,  w: 140, h: 40 },   // chip "Robson"
]);

// splash: sem dados sensíveis — copia direto
sharp('screenshots/splash.jpeg').jpeg({ quality: 92 }).toFile(`${OUT}splash.jpeg`)
  .then(() => console.log('✓ splash.jpeg'));
