// Playlists shown in the Peg List tool.
// A playlist is an ordered set of key→value pairs the user practises.
// The historical number-peg list (00..99) lives in ./pegs; other playlists
// (e.g. the A..Z animals) are defined here.
import { PEGS, formatNumber } from './pegs';

export interface PlaylistEntry {
  /** Short label shown in the left column (e.g. "07" or "A"). */
  key: string;
  /** The associated word (e.g. "ski" or "Âne"). */
  value: string;
}

export interface Playlist {
  id: string;
  name: string;
  entries: readonly PlaylistEntry[];
}

// The existing 00..99 number pegs, adapted to the generic entry shape.
const numberEntries: readonly PlaylistEntry[] = PEGS.map((word, i) => ({
  key: formatNumber(i),
  value: word,
}));

// One French animal per letter, A→Z.
const animalEntries: readonly PlaylistEntry[] = [
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
  { key: 'L', value: 'Lion' },
  { key: 'M', value: 'Mouton' },
  { key: 'N', value: 'Narval' },
  { key: 'O', value: 'Ours' },
  { key: 'P', value: 'Panda' },
  { key: 'Q', value: 'Quokka' },
  { key: 'R', value: 'Renard' },
  { key: 'S', value: 'Serpent' },
  { key: 'T', value: 'Tigre' },
  { key: 'U', value: 'Urubu' },
  { key: 'V', value: 'Vache' },
  { key: 'W', value: 'Wallaby' },
  { key: 'X', value: 'Xénope' },
  { key: 'Y', value: 'Yak' },
  { key: 'Z', value: 'Zèbre' },
];

export const PLAYLISTS: readonly Playlist[] = [
  { id: 'numbers', name: '00–100', entries: numberEntries },
  { id: 'animals', name: 'Animaux', entries: animalEntries },
];
