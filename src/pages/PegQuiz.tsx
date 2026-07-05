import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PEGS,
  formatNumber,
  isCorrect,
  randomPegNumber,
  type PegNumber,
} from '../utils/pegs';

type State = 'asking' | 'correct' | 'wrong';

const AUTO_ADVANCE_MS = 700;

export default function PegQuiz() {
  const [n, setN] = useState<PegNumber>(() => randomPegNumber());
  const [state, setState] = useState<State>('asking');
  const [guess, setGuess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const advance = useCallback(() => {
    setN((prev) => randomPegNumber(prev));
    setState('asking');
    setGuess('');
    setTimeout(focusInput, 0);
  }, []);

  const submit = useCallback(() => {
    if (state !== 'asking') return;
    if (guess.trim() === '') return;
    setState(isCorrect(guess, n) ? 'correct' : 'wrong');
  }, [state, guess, n]);

  // Auto-advance on correct
  useEffect(() => {
    if (state !== 'correct') return;
    const id = setTimeout(advance, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [state, advance]);

  // Global keyboard handling for the "wrong" state (Space or Enter → next)
  useEffect(() => {
    if (state !== 'wrong') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state, advance]);

  const cardTint =
    state === 'correct'
      ? 'bg-emerald-500/10 border-emerald-500/40'
      : state === 'wrong'
        ? 'bg-rose-500/10 border-rose-500/40'
        : 'border-gray-800';

  const inputBorder =
    state === 'correct'
      ? 'border-emerald-500 focus:border-emerald-500'
      : state === 'wrong'
        ? 'border-rose-500 focus:border-rose-500'
        : 'border-gray-700 focus:border-amber-500';

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
        <span className="text-gray-500 text-sm">Peg Quiz</span>
      </div>

      {/* Main */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-6 px-4 sm:px-6">
        <div
          className={`w-full max-w-md rounded-2xl border p-6 sm:p-8 flex flex-col items-center gap-5 transition-colors ${cardTint}`}
        >
          <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
            Enter the word for
          </p>
          <h2 className="text-6xl sm:text-7xl font-bold text-gray-100 tabular-nums">
            {formatNumber(n)}
          </h2>

          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
            readOnly={state !== 'asking'}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className={`w-full bg-gray-900/60 text-gray-100 text-2xl text-center rounded-lg border-2 px-4 py-3 outline-none transition-colors ${inputBorder}`}
          />

          {/* Reserved feedback line */}
          <p
            className={`min-h-[1.5rem] text-base ${
              state === 'wrong' ? 'text-rose-400' : 'invisible'
            }`}
          >
            {state === 'wrong'
              ? `Correct answer: ${PEGS[n]}`
              : 'placeholder'}
          </p>
        </div>

        {state === 'wrong' && (
          <button
            onClick={advance}
            className="px-8 py-3 rounded-lg bg-amber-500 text-gray-950 font-semibold hover:bg-amber-400 transition-colors text-lg w-full sm:w-auto max-w-md"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
