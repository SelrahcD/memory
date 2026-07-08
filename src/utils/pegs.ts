// Peg words for 00..99, indexed by number.
// Personal list extracted from screen recording of Charles' peg system.
// Rule when the source entry had multiple options: prefer the French word.
// When several French options existed, the last (most-recent) was kept.
export const PEGS: readonly string[] = [
  'oasis',    // 00  (English: sauce)
  'assiette', // 01
  'cygne',    // 02
  'sumo',     // 03
  'sœur',     // 04  (English: sir/knight)
  'sel',      // 05  (English: soul)
  'sushi',    // 06
  'ski',      // 07
  'sofa',     // 08
  'espion',   // 09  (English: soap)
  'tasse',    // 10
  'tête',     // 11  (English: dad)
  'tonneau',  // 12  (English: DNA/double helix)
  'diamant',  // 13  (English: Adam)
  'Thor',     // 14
  'Dalí',     // 15
  'donjon',   // 16  (English: DJ)
  'ticket',   // 17  (English: dog)
  'dauphin',  // 18  (English: TV)
  'tuba',     // 19
  'nasse',    // 20  (English: nose)
  'Nantes',   // 21  (English: net)
  'nonne',    // 22  (English: nun)
  'Nemo',     // 23
  'Nero',     // 24  (Roman emperor)
  'Noël',     // 25  (English: nail)
  'nuage',    // 26
  'Nagui',    // 27  (English: ink)
  'navet',    // 28  (English: knife)
  'nappe',    // 29  (English: NBA/basketball)
  'maison',   // 30  (English: mouse)
  'mat',      // 31
  'moine',    // 32
  'momie',    // 33
  'Mario',    // 34
  'moule',    // 35
  'mouche',   // 36
  'Mickey',   // 37
  'mafia',    // 38
  'MP3',      // 39
  'rose',     // 40
  'radio',    // 41
  'rain',     // 42  (umbrella)
  'rhum',     // 43
  'erreur',   // 44
  'Ariel',    // 45  (the little mermaid)
  'ruche',    // 46
  'Rocky',    // 47
  'roof',     // 48
  'robot',    // 49
  'lasso',    // 50
  'lady',     // 51
  'lionne',   // 52
  'lama',     // 53
  'Hillary',  // 54  (Clinton)
  'Lily',     // 55
  'leech',    // 56
  'leek',     // 57
  'lava',     // 58
  'lip',      // 59
  'cheese',   // 60
  'cheetah',  // 61
  'genie',    // 62
  'jam',      // 63
  'cherry',   // 64
  'chilli',   // 65
  'yo-yo',    // 66
  'chick',    // 67
  'chef',     // 68
  'chapeau',  // 69
  'caisse',   // 70
  'gâteau',   // 71
  'canoë',    // 72
  'gum',      // 73
  'car',      // 74
  'koala',    // 75
  'quiche',   // 76
  'cake',     // 77
  'café',     // 78
  'cube',     // 79  (Rubik's)
  'vase',     // 80
  'foot',     // 81
  'fan',      // 82
  'foam',     // 83
  'phare',    // 84
  'fly',      // 85
  'fish',     // 86
  'fig',      // 87
  'FIFA',     // 88
  'Phoebe',   // 89  (from Friends)
  'bus',      // 90
  'bat',      // 91
  'piano',    // 92
  'pomme',    // 93
  'beer',     // 94
  'apple',    // 95
  'bush',     // 96
  'book',     // 97
  'beef',     // 98
  'pope',     // 99
] as const;

export type PegNumber = number;

export function formatNumber(n: PegNumber): string {
  return n.toString().padStart(2, '0');
}

export function normalize(s: string): string {
  // NFD decomposes accented characters; the range covers combining diacritical marks (U+0300..U+036F).
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
