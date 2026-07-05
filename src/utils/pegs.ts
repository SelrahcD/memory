// Peg words for 00..99, indexed by number.
// Seeded from the classic English Major System (0=s/z, 1=t/d, 2=n, 3=m,
// 4=r, 5=l, 6=j/sh/ch, 7=k/g, 8=f/v, 9=p/b). Swap this array for a
// personal list at any time — nothing else in the app depends on the words.
export const PEGS: readonly string[] = [
  'sauce',  // 00
  'suit',   // 01
  'sun',    // 02
  'sumo',   // 03
  'sour',   // 04
  'seal',   // 05
  'sash',   // 06
  'sock',   // 07
  'safe',   // 08
  'soap',   // 09
  'toes',   // 10
  'tot',    // 11
  'tin',    // 12
  'tomb',   // 13
  'tire',   // 14
  'tail',   // 15
  'dish',   // 16
  'tack',   // 17
  'dove',   // 18
  'tape',   // 19
  'nose',   // 20
  'net',    // 21
  'nun',    // 22
  'name',   // 23
  'Nero',   // 24
  'nail',   // 25
  'notch',  // 26
  'neck',   // 27
  'knife',  // 28
  'knob',   // 29
  'mouse',  // 30
  'mat',    // 31
  'moon',   // 32
  'mummy',  // 33
  'mare',   // 34
  'mule',   // 35
  'match',  // 36
  'mug',    // 37
  'movie',  // 38
  'map',    // 39
  'rose',   // 40
  'rat',    // 41
  'rain',   // 42
  'ram',    // 43
  'rear',   // 44
  'rail',   // 45
  'roach',  // 46
  'rock',   // 47
  'roof',   // 48
  'rope',   // 49
  'lace',   // 50
  'light',  // 51
  'lion',   // 52
  'lamb',   // 53
  'lyre',   // 54
  'lily',   // 55
  'leech',  // 56
  'log',    // 57
  'leaf',   // 58
  'lap',    // 59
  'cheese', // 60
  'sheet',  // 61
  'chain',  // 62
  'jam',    // 63
  'chair',  // 64
  'jail',   // 65
  'judge',  // 66
  'check',  // 67
  'chef',   // 68
  'ship',   // 69
  'case',   // 70
  'cat',    // 71
  'can',    // 72
  'comb',   // 73
  'car',    // 74
  'coal',   // 75
  'cage',   // 76
  'cake',   // 77
  'cave',   // 78
  'cap',    // 79
  'fez',    // 80
  'fate',   // 81
  'fan',    // 82
  'foam',   // 83
  'fur',    // 84
  'file',   // 85
  'fish',   // 86
  'fog',    // 87
  'fife',   // 88
  'fob',    // 89
  'base',   // 90
  'bat',    // 91
  'bun',    // 92
  'beam',   // 93
  'bear',   // 94
  'bell',   // 95
  'beach',  // 96
  'book',   // 97
  'beef',   // 98
  'pipe',   // 99
] as const;

export type PegNumber = number;

export function formatNumber(n: PegNumber): string {
  return n.toString().padStart(2, '0');
}

export function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function isCorrect(guess: string, n: PegNumber): boolean {
  return normalize(guess) === normalize(PEGS[n]);
}

export function randomPegNumber(exclude?: PegNumber): PegNumber {
  let n: PegNumber;
  do {
    n = Math.floor(Math.random() * PEGS.length);
  } while (exclude !== undefined && n === exclude);
  return n;
}
