// api/rashi.js
import { moonposition, julian } from 'astronomia';

const RASHIS = [
  { sanskrit: 'Mesha',      english: 'Aries' },
  { sanskrit: 'Vrishabha',  english: 'Taurus' },
  { sanskrit: 'Mithuna',    english: 'Gemini' },
  { sanskrit: 'Karka',      english: 'Cancer' },
  { sanskrit: 'Simha',      english: 'Leo' },
  { sanskrit: 'Kanya',      english: 'Virgo' },
  { sanskrit: 'Tula',       english: 'Libra' },
  { sanskrit: 'Vrishchika', english: 'Scorpio' },
  { sanskrit: 'Dhanu',      english: 'Sagittarius' },
  { sanskrit: 'Makara',     english: 'Capricorn' },
  { sanskrit: 'Kumbha',     english: 'Aquarius' },
  { sanskrit: 'Meena',      english: 'Pisces' },
];

function lahiriAyanamsa(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.85306 + 1.396042 * T + 0.0003086 * T * T;
}

export function computeRashi(year, month, day, hour = 12, minute = 0, tzOffsetHours = 5.5) {
  const utcDecimalHours = (hour + minute / 60) - tzOffsetHours;
  const decimalDay = day + utcDecimalHours / 24;
  const jd = julian.CalendarGregorianToJD(year, month, decimalDay);

  const pos = moonposition.position(jd);
  let tropLon = (pos.lon * 180) / Math.PI;
  tropLon = ((tropLon % 360) + 360) % 360;

  const ayan = lahiriAyanamsa(jd);
  const sidLon = (((tropLon - ayan) % 360) + 360) % 360;

  const rashiIndex = Math.floor(sidLon / 30);
  return {
    rashi: RASHIS[rashiIndex],
    siderealLongitude: sidLon,
    degreeInSign: sidLon - rashiIndex * 30,
  };
}
