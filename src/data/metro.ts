import type { MetroLine } from '../components/LineBadge';
import type { Name } from './types';

/**
 * Kharkiv metro with current names (after the 2022–2024 renamings:
 * Heroiv Pratsi → Saltivska, Prospekt Haharina → Levada, Zavod imeni Malysheva → Zavodska,
 * Pivdennyi Vokzal → Vokzalna, Pushkinska → Yaroslava Mudroho).
 * Sources: uk.wikipedia.org "Список станцій Харківського метрополітену"; Suspilne Kharkiv, Jul 2024.
 *
 * x / y place stations on the schematic map (viewBox 0 0 470 640), not geographically.
 * label: which side of the dot the name sits on.
 */
export interface Station {
  id: string;
  line: MetroLine;
  name: Name;
  x: number;
  y: number;
  /** l / r / t / b, or d: diagonal, running down-left from the dot (tight horizontal runs) */
  label: 'l' | 'r' | 't' | 'b' | 'd';
  stepFree?: boolean;
  /** Surface stops at the exits, by stop id */
  exits?: string[];
}

export interface Line {
  id: MetroLine;
  name: Name;
  /** Minutes between trains at rush hour */
  headway: number;
  /** Minutes between neighbouring stations */
  hop: number;
  stations: Station[];
}

const s = (id: string, line: MetroLine, en: string, uk: string, x: number, y: number, label: Station['label'], extra: Partial<Station> = {}): Station => ({
  id,
  line,
  name: { en, uk },
  x,
  y,
  label,
  ...extra,
});

export const LINES: Line[] = [
  {
    id: 1,
    name: { en: 'Kholodnohirsko-Zavodska', uk: 'Холодногірсько-Заводська' },
    headway: 4,
    hop: 2,
    stations: [
      s('kholodna-hora', 1, 'Kholodna Hora', 'Холодна гора', 74, 330, 'd'),
      s('vokzalna', 1, 'Vokzalna', 'Вокзальна', 114, 330, 'd', { stepFree: true, exits: ['vokzalna-sq'] }),
      s('tsentralnyi-rynok', 1, 'Tsentralnyi Rynok', 'Центральний ринок', 154, 330, 'd'),
      s('maidan-konstytutsii', 1, 'Maidan Konstytutsii', 'Майдан Конституції', 194, 330, 'd'),
      s('levada', 1, 'Levada', 'Левада', 222, 358, 'l'),
      s('sportyvna', 1, 'Sportyvna', 'Спортивна', 250, 386, 'l'),
      s('zavodska', 1, 'Zavodska', 'Заводська', 278, 414, 'l'),
      s('turboatom', 1, 'Turboatom', 'Турбоатом', 306, 442, 'l'),
      s('palats-sportu', 1, 'Palats Sportu', 'Палац Спорту', 334, 470, 'l'),
      s('armiiska', 1, 'Armiiska', 'Армійська', 362, 498, 'l'),
      s('maselskoho', 1, 'Imeni O. S. Maselskoho', 'Імені О. С. Масельського', 362, 536, 'l'),
      s('traktornyi-zavod', 1, 'Traktornyi Zavod', 'Тракторний завод', 362, 574, 'l'),
      s('industrialna', 1, 'Industrialna', 'Індустріальна', 362, 612, 'l'),
    ],
  },
  {
    id: 2,
    name: { en: 'Saltivska', uk: 'Салтівська' },
    headway: 5,
    hop: 2,
    stations: [
      s('saltivska', 2, 'Saltivska', 'Салтівська', 342, 58, 'r', { stepFree: true, exits: ['saltivska-metro', 'saltivske-shose'] }),
      s('studentska', 2, 'Studentska', 'Студентська', 342, 96, 'r', { exits: ['studentska-metro'] }),
      s('akademika-pavlova', 2, 'Akademika Pavlova', 'Академіка Павлова', 342, 134, 'r'),
      s('akademika-barabashova', 2, 'Akademika Barabashova', 'Академіка Барабашова', 310, 166, 'r'),
      s('kyivska', 2, 'Kyivska', 'Київська', 278, 198, 'r'),
      s('yaroslava-mudroho', 2, 'Yaroslava Mudroho', 'Ярослава Мудрого', 246, 230, 'r'),
      s('universytet', 2, 'Universytet', 'Університет', 214, 262, 'l'),
      s('istorychnyi-muzei', 2, 'Istorychnyi Muzei', 'Історичний музей', 214, 310, 'l'),
    ],
  },
  {
    id: 3,
    name: { en: 'Oleksiivska', uk: 'Олексіївська' },
    headway: 6,
    hop: 2,
    stations: [
      s('metrobudivnykiv', 3, 'Metrobudivnykiv', 'Метробудівників', 272, 366, 'r'),
      s('zakhysnykiv-ukrainy', 3, 'Zakhysnykiv Ukrainy', 'Захисників України', 272, 332, 'r'),
      s('arkhitektora-beketova', 3, 'Arkhitektora Beketova', 'Архітектора Бекетова', 272, 298, 'r'),
      s('derzhprom', 3, 'Derzhprom', 'Держпром', 242, 268, 'r', { stepFree: true }),
      s('naukova', 3, 'Naukova', 'Наукова', 242, 206, 'l'),
      s('botanichnyi-sad', 3, 'Botanichnyi Sad', 'Ботанічний сад', 242, 172, 'l'),
      s('23-serpnia', 3, '23 Serpnia', '23 Серпня', 242, 138, 'l'),
      s('oleksiivska', 3, 'Oleksiivska', 'Олексіївська', 242, 104, 'l'),
      s('peremoha', 3, 'Peremoha', 'Перемога', 242, 70, 'l'),
    ],
  },
];

/** Interchanges: walk between the two stations without a new fare */
export const TRANSFERS: [string, string][] = [
  ['istorychnyi-muzei', 'maidan-konstytutsii'],
  ['universytet', 'derzhprom'],
  ['sportyvna', 'metrobudivnykiv'],
];

export const STATIONS = LINES.flatMap((l) => l.stations);
export const stationById = (id: string) => STATIONS.find((x) => x.id === id)!;
export const lineById = (id: MetroLine) => LINES.find((l) => l.id === id)!;
export const transferOf = (id: string) => {
  const pair = TRANSFERS.find((p) => p.includes(id));
  return pair ? stationById(pair[0] === id ? pair[1] : pair[0]) : undefined;
};
