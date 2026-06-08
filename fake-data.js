const sharp = require('sharp');
require('fs').mkdirSync('screenshots/blurred', { recursive: true });

// Dados falsos realistas
const FAKE = {
  clinicName:   'Instituto Estético Lumina',
  clinicSince:  'Desde 15/03/2025',
  email:        'contato@lumina.com.br',
  cnpj:         '23.456.789/0001-55',
  patients:     '5 pacientes',
  welcome:      'Bem-vindo, Dra. Camila',
  hello:        'Olá, Dra. Camila Rocha',
  patient1:     'Ana Paula Ferreira',
  patient1age:  '32 anos',
  patient2:     'Beatriz Souza Lima',
  patient2age:  '27 anos',
  doctor1:      'Dra. Camila Rocha',
  doctor2:      'Dr. Felipe Martins',
  chipDoc1:     '● Camila',
  chipDoc2:     '● Felipe',
};

// Gera SVG com retângulos de fundo + texto falso por cima
function overlay(W, H, items) {
  const els = items.map(({ x, y, w, h, bg = '#0d1120', text, color = '#EFEFEF', size = 22, bold = false, align = 'left' }) => {
    const tx = align === 'center' ? x + w / 2 : x + 10;
    const ty = y + h / 2 + size * 0.38;
    const anchor = align === 'center' ? 'middle' : 'start';
    const weight = bold ? '700' : '400';
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${bg}"/>
      ${text ? `<text x="${tx}" y="${ty}" font-family="Inter,Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${text}</text>` : ''}
    `;
  }).join('');
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${els}</svg>`);
}

async function process(file, items) {
  const src = `screenshots/${file}.jpeg`;
  const out = `screenshots/blurred/${file}.jpeg`;
  const { width: W, height: H } = await sharp(src).metadata();
  await sharp(src)
    .composite([{ input: overlay(W, H, items), blend: 'over' }])
    .jpeg({ quality: 93 })
    .toFile(out);
  console.log(`✓ ${file}`);
}

// ── admin ──────────────────────────────────────────────────────────────
process('admin', [
  // nome da clínica no card
  { x: 155, y: 862, w: 450, h: 50, bg: '#0d1120', text: FAKE.clinicName,  color: '#EFEFEF', size: 24, bold: true },
  // data
  { x: 155, y: 916, w: 280, h: 36, bg: '#0d1120', text: FAKE.clinicSince, color: 'rgba(255,255,255,0.45)', size: 20 },
  // email
  { x: 105, y: 1028, w: 450, h: 38, bg: '#0d1120', text: FAKE.email,      color: 'rgba(255,255,255,0.55)', size: 20 },
  // cnpj
  { x: 105, y: 1072, w: 330, h: 38, bg: '#0d1120', text: FAKE.cnpj,       color: 'rgba(255,255,255,0.55)', size: 20 },
  // pacientes
  { x: 105, y: 1116, w: 220, h: 36, bg: '#0d1120', text: FAKE.patients,   color: 'rgba(255,255,255,0.55)', size: 20 },
]);

// ── home ───────────────────────────────────────────────────────────────
process('home', [
  // saudação topo
  { x: 38,  y: 128, w: 440, h: 60, bg: '#080b12', text: FAKE.hello,    color: '#EFEFEF', size: 28, bold: true },
  // paciente 1 nome
  { x: 152, y: 1025, w: 340, h: 42, bg: '#0d1120', text: FAKE.patient1, color: '#EFEFEF', size: 22, bold: true },
  // paciente 2 nome
  { x: 152, y: 1150, w: 310, h: 42, bg: '#0d1120', text: FAKE.patient2, color: '#EFEFEF', size: 22, bold: true },
]);

// ── mode-select ────────────────────────────────────────────────────────
process('mode-select', [
  // "Bem-vindo, Robson"
  { x: 160, y: 310, w: 410, h: 54, bg: '#080b12', text: FAKE.welcome,   color: '#EFEFEF', size: 26, bold: false, align: 'center' },
  // nome da clínica no card
  { x: 110, y: 952, w: 470, h: 54, bg: '#0d1120', text: FAKE.clinicName, color: '#EFEFEF', size: 22, bold: true },
]);

// ── pacientes ──────────────────────────────────────────────────────────
process('pacientes', [
  // avatar 1 (foto real) → círculo colorido com inicial
  { x: 26,  y: 316, w: 110, h: 110, bg: '#1a1a3e' },
  { x: 26,  y: 316, w: 110, h: 110, bg: 'none',   text: 'A', color: '#00F2FE', size: 46, bold: true, align: 'center' },
  // nome 1
  { x: 152, y: 320, w: 340, h: 44, bg: '#0d1120', text: FAKE.patient1,    color: '#EFEFEF', size: 22, bold: true },
  { x: 152, y: 365, w: 200, h: 32, bg: '#0d1120', text: FAKE.patient1age, color: 'rgba(255,255,255,0.45)', size: 18 },
  // avatar 2 (foto real) → círculo colorido com inicial
  { x: 26,  y: 444, w: 110, h: 110, bg: '#1a0d2e' },
  { x: 26,  y: 444, w: 110, h: 110, bg: 'none',   text: 'B', color: '#7928CA', size: 46, bold: true, align: 'center' },
  // nome 2
  { x: 152, y: 448, w: 340, h: 44, bg: '#0d1120', text: FAKE.patient2,    color: '#EFEFEF', size: 22, bold: true },
  { x: 152, y: 493, w: 200, h: 32, bg: '#0d1120', text: FAKE.patient2age, color: 'rgba(255,255,255,0.45)', size: 18 },
]);

// ── agenda ─────────────────────────────────────────────────────────────
const agendaRows = [
  { y: 492  }, { y: 607  }, { y: 717  }, { y: 828  }, { y: 940  }, { y: 1050 },
];
const agendaSubRows = [
  { y: 536  }, { y: 651  }, { y: 761  }, { y: 872  }, { y: 984  }, { y: 1094 },
];
process('agenda', [
  // chips profissional
  { x: 130, y: 398, w: 135, h: 44, bg: '#0d1120', text: FAKE.chipDoc1, color: '#FF007A',          size: 20 },
  { x: 272, y: 398, w: 148, h: 44, bg: '#0d1120', text: FAKE.chipDoc2, color: 'rgba(255,255,255,0.6)', size: 20 },
  // linhas nome paciente
  ...agendaRows.map(({ y }) => ({ x: 132, y, w: 280, h: 40, bg: '#0a0d18', text: FAKE.patient1, color: '#EFEFEF', size: 21, bold: true })),
  // linhas médico (alternando)
  ...agendaSubRows.map(({ y }, i) => ({ x: 132, y, w: 270, h: 32, bg: '#0a0d18', text: i % 2 === 0 ? FAKE.doctor1 : FAKE.doctor2, color: 'rgba(255,255,255,0.45)', size: 18 })),
]);

// ── agenda-lembretes ───────────────────────────────────────────────────
const lembRows = [
  { y: 862  }, { y: 970  }, { y: 1075 }, { y: 1180 }, { y: 1285 }, { y: 1390 },
];
const lembSub = [
  { y: 906  }, { y: 1014 }, { y: 1119 }, { y: 1224 }, { y: 1329 }, { y: 1434 },
];
process('agenda-lembretes', [
  { x: 130, y: 398, w: 135, h: 44, bg: '#0d1120', text: FAKE.chipDoc1, color: '#FF007A',              size: 20 },
  { x: 272, y: 398, w: 148, h: 44, bg: '#0d1120', text: FAKE.chipDoc2, color: 'rgba(255,255,255,0.6)', size: 20 },
  ...lembRows.map(({ y }) => ({ x: 132, y, w: 280, h: 40, bg: '#0a0d18', text: FAKE.patient1, color: '#EFEFEF', size: 21, bold: true })),
  ...lembSub.map(({ y }, i)  => ({ x: 132, y, w: 270, h: 32, bg: '#0a0d18', text: i % 2 === 0 ? FAKE.doctor1 : FAKE.doctor2, color: 'rgba(255,255,255,0.45)', size: 18 })),
]);

// splash: sem dados sensíveis
sharp('screenshots/splash.jpeg').jpeg({ quality: 93 }).toFile('screenshots/blurred/splash.jpeg')
  .then(() => console.log('✓ splash'));
