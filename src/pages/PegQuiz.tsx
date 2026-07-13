import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PEGS,
  MAX_PEG,
  formatNumber,
  isCorrect,
  randomPegNumber,
  type PegNumber,
} from '../utils/pegs';

type State = 'asking' | 'correct' | 'wrong';

const AUTO_ADVANCE_MS = 700;

export default function PegQuiz() {
  const [maxN, setMaxN] = useState<PegNumber>(MAX_PEG);
  const [showOptions, setShowOptions] = useState(false);
  const [n, setN] = useState<PegNumber>(() => randomPegNumber(undefined, MAX_PEG));
  const [state, setState] = useState<State>('asking');
  const [guess, setGuess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const advance = useCallback(() => {
    setN((prev) => randomPegNumber(prev, maxN));
    setState('asking');
    setGuess('');
    // Refocus after React updates the DOM.
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [maxN]);

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setMaxN(0);
      return;
    }
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    const next = Math.min(Math.max(parsed, 0), MAX_PEG);
    setMaxN(next);
    // If the current question falls outside the new range, draw a fresh one so
    // we never quiz a number the user opted out of.
    if (state === 'asking' && n > next) {
      setN(randomPegNumber(undefined, next));
      setGuess('');
    }
  };

  const submit = useCallback(() => {
    if (state !== 'asking') return;
    if (guess.trim() === '') return;
    setState(isCorrect(guess, n) ? 'correct' : 'wrong');
  }, [state, guess, n]);

  // Auto-advance on correct.
  useEffect(() => {
    if (state !== 'correct') return;
    const id = setTimeout(advance, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [state, advance]);

  // Keep the input focused across state transitions so keyboard-only use keeps working.
  useEffect(() => {
    if (state === 'wrong') inputRef.current?.focus();
  }, [state]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (state === 'asking' && e.key === 'Enter') {
      e.preventDefault();
      submit();
      return;
    }
    if (state === 'wrong' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      advance();
    }
  };

  const cardTint =
    state === 'correct'
      ? 'bg-emerald-500/15 border-emerald-500'
      : state === 'wrong'
        ? 'bg-rose-500/15 border-rose-500'
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
          className={`w-full max-w-md rounded-2xl border-2 p-6 sm:p-8 flex flex-col items-center gap-5 transition-colors ${cardTint}`}
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
            onKeyDown={handleInputKeyDown}
            readOnly={state !== 'asking'}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            data-testid="guess-input"
            className={`w-full bg-gray-900/60 text-gray-100 text-2xl text-center rounded-lg border-2 px-4 py-3 outline-none transition-colors ${inputBorder}`}
          />

          {/* Feedback area — reserves ~2 lines so the layout doesn't jump. */}
          <div
            className="min-h-[3.5rem] flex flex-col items-center gap-1 text-center"
            data-testid="feedback"
          >
            {state === 'correct' && (
              <p className="text-emerald-400 text-xl font-semibold">✓ Correct</p>
            )}
            {state === 'wrong' && (
              <>
                <p className="text-rose-400 text-xl font-semibold">✗ Wrong</p>
                <p className="text-gray-100 text-lg">
                  The word is{' '}
                  <span className="font-bold text-rose-300">{PEGS[n]}</span>
                </p>
              </>
            )}
          </div>

          {state === 'asking' && (
            <button
              onClick={submit}
              disabled={guess.trim() === ''}
              className="w-full px-8 py-3 rounded-lg bg-amber-500 text-gray-950 font-semibold hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-lg"
            >
              Check
            </button>
          )}

          {state === 'wrong' && (
            <button
              onClick={advance}
              className="w-full px-8 py-3 rounded-lg bg-amber-500 text-gray-950 font-semibold hover:bg-amber-400 transition-colors text-lg"
            >
              Next
            </button>
          )}
        </div>

        {/* Options — discreet toggle sitting below the card. */}
        <div className="w-full max-w-md flex flex-col items-center">
          <button
            type="button"
            onClick={() => setShowOptions((v) => !v)}
            aria-expanded={showOptions}
            className="text-gray-600 hover:text-gray-400 text-xs uppercase tracking-wider transition-colors py-1"
          >
            {showOptions ? 'Hide options ▲' : 'Options ▾'}
          </button>

          {showOptions && (
            <div className="w-full mt-2 rounded-xl border border-gray-800 bg-gray-900/40 px-4 py-3 flex items-center justify-between gap-4">
              <label htmlFor="max-peg" className="text-gray-400 text-sm">
                Quiz up to
              </label>
              <input
                id="max-peg"
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_PEG}
                value={maxN}
                onChange={handleMaxChange}
                data-testid="max-input"
                className="w-20 bg-gray-900/60 text-gray-100 text-center rounded-lg border border-gray-700 focus:border-amber-500 px-2 py-1.5 outline-none transition-colors tabular-nums"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
