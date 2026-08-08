// Peg words for 00..99, indexed by number.
// Personal list extracted from screen recording of Charles' peg system.
// Rule when the source entry had multiple options: prefer the French word.
// When several French options existed, the last (most-recent) was kept.
export const PEGS: readonly string[] = [
  'oasis',    // 00  (English: sauce)
  'assiette', // 01
  'cygne',    // 02
  'sumo',     // 03
  'Zorro',    // 04
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
  'note (de musique)',   // 21  (English: net)
  'nonne',    // 22  (English: nun)
  'Nemo',     // 23
  'Nero',     // 24  (Roman emperor)
  'Noël',     // 25  (English: nail)
  'nuage',    // 26
  'nougat',   // 27  (English: ink)
  'nymphe',   // 28  (English: knife)
  'nappe',    // 29  (English: NBA/basketball)
  'maison',   // 30  (English: mouse)
  'mouton',   // 31  (English: mat)
  'moine',    // 32
  'momie',    // 33
  'Mario',    // 34
  'moule',    // 35
  'mouche',   // 36
  'Mickey',   // 37
  'mafia',    // 38
  'myope',    // 39
  'rose',     // 40
  'radio',    // 41
  'reine',    // 42
  'rhum',     // 43
  'erreur',   // 44
  'Ariel',    // 45  (the little mermaid)
  'ruche',    // 46
  'requin',   // 47
  'rave',     // 48
  'robot',    // 49
  'lasso',    // 50
  'lutin',     // 51
  'lionne',   // 52
  'lama',     // 53
  'lard',  // 54
  'Lily',     // 55
  'luge',    // 56
  'lac',      // 57
  'éléphant',     // 58
  'lampe',    // 59
  'chaise',   // 60
  'chouette',  // 61
  'genie',    // 62
  'Jammy',      // 63
  'chariot',   // 64
  'chilli',   // 65
  'juge',     // 66
  'chèque',    // 67
  'chef',     // 68
  'chapeau',  // 69
  'caisse',   // 70
  'gâteau',   // 71
  'canoë',    // 72
  '(mini)keum',      // 73
  'car',      // 74
  'koala',    // 75
  'quiche',   // 76
  'cake',     // 77
  'café',     // 78
  'cube',     // 79  (Rubik's)
  'vase',     // 80
  'foot',     // 81
  'van',      // 82
  'femme',    // 83
  'phare',    // 84
  'filet',      // 85
  'vache',     // 86
  'figue',      // 87
  'fève',     // 88
  'Phoebe',   // 89  (from Friends)
  'poisson',      // 90
  'bâton',      // 91
  'piano',    // 92
  'pomme',    // 93
  'bière',     // 94
  'pelld',    // 95
  'bougie',   // 96
  'bague',    // 97
  'boeuf',    // 98
  'bébé',     // 99
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

export const MAX_PEG = PEGS.length - 1;

// Draw a peg number in the inclusive range [0, max]. `max` is clamped to the
// available pegs. When the range has more than one value, `exclude` is avoided
// so the same number isn't drawn twice in a row.
export function randomPegNumber(exclude?: PegNumber, max: PegNumber = MAX_PEG): PegNumber {
  const upper = Math.min(Math.max(Math.floor(max), 0), MAX_PEG);
  const canExclude = exclude !== undefined && upper > 0;
  let n: PegNumber;
  do {
    n = Math.floor(Math.random() * (upper + 1));
  } while (canExclude && n === exclude);
  return n;
}
