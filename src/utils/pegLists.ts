// Peg lists shown in the Peg List tool.
// A peg list is an ordered set of key→value pairs the user practises.
// The historical number-peg list (00..99) lives in ./pegs; other peg lists
// (e.g. the A..Z animals) are defined here.
import { PEGS, formatNumber } from './pegs';

export interface PegListEntry {
  /** Short label shown in the left column (e.g. "07" or "A"). */
  key: string;
  /** The associated word (e.g. "ski" or "Âne"). */
  value: string;
}

export interface PegList {
  id: string;
  name: string;
  entries: readonly PegListEntry[];
}

// The existing 00..99 number pegs, adapted to the generic entry shape.
const numberEntries: readonly PegListEntry[] = PEGS.map((word, i) => ({
  key: formatNumber(i),
  value: word,
}));

// One French animal per letter, A→Z.
const animalEntries: readonly PegListEntry[] = [
  { key: 'A', value: 'Âne' },
  { key: 'B', value: 'Baleine' },
  { key: 'C', value: 'Chat' },
  { key: 'D', value: 'Dauphin' },
  { key: 'E', value: 'Éléphant' },
  { key: 'F', value: 'Fourmi' },
  { key: 'G', value: 'Girafe' },
  { key: 'H', value: 'Hibou' },
  { key: 'I', value: 'Iguane' },
  { key: 'J', value: 'Jaguar' },
  { key: 'K', value: 'Kangourou' },
  { key: 'L', value: 'Lapin' },
  { key: 'M', value: 'Mouton' },
  { key: 'N', value: 'Narval' },
  { key: 'O', value: 'Ours' },
  { key: 'P', value: 'Panda' },
  { key: 'Q', value: 'Quokka' },
  { key: 'R', value: 'Renard' },
  { key: 'S', value: 'Singe' },
  { key: 'T', value: 'Tigre' },
  { key: 'U', value: 'Urubu' },
  { key: 'V', value: 'Vache' },
  { key: 'W', value: 'Wapiti' },
  { key: 'X', value: 'Xénope' },
  { key: 'Y', value: 'Yak' },
  { key: 'Z', value: 'Zèbre' },
];

const numberShape: readonly PegListEntry[] = [
  { key: '0', value: 'Œuf' },
  { key: '1', value: 'Bougie' },
  { key: '2', value: 'Cygne' },
  { key: '3', value: 'Trident' },
  { key: '4', value: 'Bateau à voile' },
  { key: '5', value: 'Hameçon' },
  { key: '6', value: 'Club de golf' },
  { key: '7', value: 'Hache' },
  { key: '8', value: 'Bonhomme de neige' },
  { key: '9', value: 'Ballon accroché à une ficelle' },
];

export const PEG_LISTS: readonly PegList[] = [
  { id: 'numbers', name: '00–100', entries: numberEntries },
  { id: 'animals', name: 'Animaux', entries: animalEntries },
  { id: 'shape', name: 'Number shapes', entries: numberShape },
];
