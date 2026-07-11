import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PEG_LISTS } from '../utils/pegLists';

export default function PegList() {
  const [pegListId, setPegListId] = useState(PEG_LISTS[0].id);
  const pegList = PEG_LISTS.find((p) => p.id === pegListId) ?? PEG_LISTS[0];

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

      {/* Peg list selector */}
      <div className="px-4 pb-2 flex justify-center">
        <div
          role="tablist"
          aria-label="Peg list"
          className="inline-flex gap-1 rounded-xl bg-gray-900/60 p-1"
        >
          {PEG_LISTS.map((p) => {
            const active = p.id === pegList.id;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={active}
                onClick={() => setPegListId(p.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-amber-500 text-gray-950'
                    : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ul className="max-w-md mx-auto w-full">
          {pegList.entries.map((entry, i) => {
            // Per-row background striping, plus a 3px left border whose color
            // alternates every 10 rows so each block is delimited.
            const evenBlock = Math.floor(i / 10) % 2 === 0;
            return (
              <li
                key={entry.key}
                className={`flex items-baseline gap-6 py-3 px-4 border-l-[3px] even:bg-gray-900/40 ${
                  evenBlock ? 'border-sky-500' : 'border-amber-500'
                }`}
              >
                <span className="text-gray-500 tabular-nums text-base w-8">
                  {entry.key}
                </span>
                <span className="text-gray-100 text-lg">{entry.value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
