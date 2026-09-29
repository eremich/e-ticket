import type { Name, Route, Stop } from './types';

/**
 * Surface transport around Saltivka (the rider's home) and Vokzalna (work). Mock data:
 * route numbers and timings are illustrative, stop names follow nearby metro stations and landmarks.
 */

const n = (en: string, uk: string): Name => ({ en, uk });

export const STOP_NAMES: Record<string, Name> = {
  'saltivska-metro': n('Saltivska metro', 'Метро «Салтівська»'),
  'saltivske-shose': n('Saltivske Shose', 'Салтівське шосе'),
  'studentska-metro': n('Studentska metro', 'Метро «Студентська»'),
  'pavlova-metro': n('Akademika Pavlova metro', 'Метро «Академіка Павлова»'),
  'barabashova-market': n('Barabashova Market', 'Ринок Барабашова'),
  'kyivska-metro': n('Kyivska metro', 'Метро «Київська»'),
  'tsentralnyi-rynok': n('Tsentralnyi Rynok', 'Центральний ринок'),
  'vokzalna-sq': n('Vokzalna Square', 'Привокзальна площа'),
  'kholodna-hora': n('Kholodna Hora', 'Холодна гора'),
  'sumska': n('Sumska Street', 'вулиця Сумська'),
};

export const ROUTES: Route[] = [
  {
    id: 'tram-27',
    transport: 'tram',
    number: '27',
    towards: n('Tsentralnyi Rynok', 'Центральний ринок'),
    headway: 9,
    lowFloor: true,
    stops: [
      { id: 'saltivska-metro', at: 0 },
      { id: 'studentska-metro', at: 4 },
      { id: 'pavlova-metro', at: 8 },
      { id: 'barabashova-market', at: 12 },
      { id: 'kyivska-metro', at: 17 },
      { id: 'tsentralnyi-rynok', at: 31 },
    ],
    path: [[318, 70], [300, 150], [262, 232], [214, 300], [150, 360], [60, 430]],
  },
  {
    id: 'tram-16a',
    transport: 'tram',
    number: '16A',
    towards: n('Kyivska metro', 'Метро «Київська»'),
    headway: 12,
    stops: [
      { id: 'saltivska-metro', at: 0 },
      { id: 'pavlova-metro', at: 7 },
      { id: 'kyivska-metro', at: 16 },
    ],
    path: [[318, 70], [360, 150], [340, 260], [270, 330], [190, 420]],
  },
  {
    id: 'tram-8',
    transport: 'tram',
    number: '8',
    towards: n('Barabashova Market', 'Ринок Барабашова'),
    headway: 11,
    stops: [
      { id: 'studentska-metro', at: 0 },
      { id: 'barabashova-market', at: 9 },
    ],
    path: [[40, 120], [140, 150], [262, 232], [330, 300]],
  },
  {
    id: 'trolleybus-35',
    transport: 'trolleybus',
    number: '35',
    towards: n('Sumska Street', 'вулиця Сумська'),
    headway: 10,
    lowFloor: true,
    stops: [
      { id: 'saltivske-shose', at: 0 },
      { id: 'studentska-metro', at: 5 },
      { id: 'sumska', at: 24 },
    ],
    path: [[210, 40], [236, 120], [262, 232], [250, 330], [230, 440]],
  },
  {
    id: 'bus-115',
    transport: 'bus',
    number: '115',
    towards: n('Kholodna Hora', 'Холодна гора'),
    headway: 15,
    stops: [
      { id: 'saltivske-shose', at: 0 },
      { id: 'studentska-metro', at: 6 },
      { id: 'kholodna-hora', at: 41 },
    ],
    path: [[370, 40], [300, 110], [210, 170], [120, 260], [30, 330]],
  },
  {
    id: 'tram-7',
    transport: 'tram',
    number: '7',
    towards: n('Sumska Street', 'вулиця Сумська'),
    headway: 8,
    lowFloor: true,
    stops: [
      { id: 'vokzalna-sq', at: 0 },
      { id: 'tsentralnyi-rynok', at: 6 },
      { id: 'sumska', at: 15 },
    ],
    path: [],
  },
];

/** Stops near the rider. walkMin / meters are from home near Saltivska; Vokzalna Square is used at the trip's end. */
export const STOPS: Stop[] = [
  {
    id: 'saltivska-metro',
    name: STOP_NAMES['saltivska-metro'],
    walkMin: 3,
    meters: 220,
    x: 318,
    y: 70,
    station: 'saltivska',
    services: [
      { routeId: 'tram-27', next: 3 },
      { routeId: 'tram-16a', next: 7 },
    ],
  },
  {
    id: 'saltivske-shose',
    name: STOP_NAMES['saltivske-shose'],
    walkMin: 5,
    meters: 380,
    x: 236,
    y: 120,
    services: [
      { routeId: 'trolleybus-35', next: 0 },
      { routeId: 'bus-115', next: 11 },
    ],
  },
  {
    id: 'studentska-metro',
    name: STOP_NAMES['studentska-metro'],
    walkMin: 9,
    meters: 700,
    x: 262,
    y: 232,
    station: 'studentska',
    services: [
      { routeId: 'tram-8', next: 6 },
      { routeId: 'tram-27', next: 7 },
      { routeId: 'bus-115', next: 17 },
    ],
  },
  {
    id: 'vokzalna-sq',
    name: STOP_NAMES['vokzalna-sq'],
    walkMin: 2,
    meters: 120,
    station: 'vokzalna',
    services: [{ routeId: 'tram-7', next: 4 }],
  },
];

/** Stops listed on Home (near the rider) */
export const HOME_STOPS = ['saltivska-metro', 'saltivske-shose', 'studentska-metro'];

export const routeById = (id: string) => ROUTES.find((r) => r.id === id)!;
export const stopById = (id: string) => STOPS.find((s) => s.id === id)!;
export const stopName = (id: string) => STOP_NAMES[id];
