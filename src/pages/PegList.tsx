import { Link } from 'react-router-dom';
import { PEGS, formatNumber } from '../utils/pegs';

export default function PegList() {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* Compact header with back link */}
      <div className="flex items-center gap-3 px-4 py-2">
        <Link
          to="/"
          className="text-gray-400 hover:text-gray-100 transition-colors text-2xl leading-none p-2 -m-2"
        >
          &larr;
        </Link>
        <span className="text-gray-500 text-sm">Peg List</span>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ul className="max-w-md mx-auto w-full">
          {PEGS.map((word, i) => (
            <li
              key={i}
              className="flex items-baseline gap-6 py-3 px-4 even:bg-gray-900/40"
            >
              <span className="text-gray-500 tabular-nums text-base w-8">
                {formatNumber(i)}
              </span>
              <span className="text-gray-100 text-lg">{word}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
