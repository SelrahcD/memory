import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PI_DIGITS, PI_LENGTH, isDigitCorrect } from '../utils/pi';

export default function PiValidator() {
  const [digits, setDigits] = useState<string[]>(() =>
    Array(PI_LENGTH).fill(''),
  );
  const [validated, setValidated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the active input centered in the scroll area, while still leaving the
  // row free for the user to scroll left/right by hand (e.g. when reviewing).
  useEffect(() => {
    inputRefs.current[activeIndex]?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
    });
  }, [activeIndex]);

  const filledCount = digits.filter((d) => d !== '').length;

  const focusInput = useCallback((index: number) => {
    // preventScroll: let our own centering effect drive the scroll position
    // instead of the browser scrolling the focused input to the nearest edge.
    inputRefs.current[index]?.focus({ preventScroll: true });
  }, []);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // Keep only the last typed digit; ignore any non-digit input.
    const raw = e.target.value.replace(/\D/g, '');
    if (e.target.value !== '' && raw === '') return;
    const digit = raw.slice(-1);

    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setValidated(false);

    // Move to the next input once a digit has been entered.
    if (digit !== '' && index < PI_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && digits[index] === '' && index > 0) {
      // Step back into the previous input when the current one is already empty.
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < PI_LENGTH - 1) {
      e.preventDefault();
      focusInput(index + 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      validate();
    }
  };

  const validate = () => setValidated(true);

  const reset = () => {
    setDigits(Array(PI_LENGTH).fill(''));
    setValidated(false);
    setActiveIndex(0);
    focusInput(0);
  };

  const correctCount = validated
    ? digits.filter((d, i) => isDigitCorrect(d, i)).length
    : 0;

  const borderFor = (index: number): string => {
    if (!validated) {
      return index === activeIndex
        ? 'border-orange-500'
        : 'border-gray-700 focus:border-orange-500';
    }
    return isDigitCorrect(digits[index], index)
      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
      : 'border-rose-500 bg-rose-500/10 text-rose-300';
  };

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
        <span className="text-gray-500 text-sm">Pi Validator</span>
      </div>

      {/* Main */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 sm:px-6 py-4">
        <div className="w-full max-w-3xl flex flex-col items-center gap-8">
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-bold text-gray-100">π =</h2>
            <span className="text-4xl font-bold text-amber-400 tabular-nums">
              3.
            </span>
          </div>

          {/* Counter */}
          <div
            className="text-gray-400 text-sm"
            data-testid="pi-counter"
            aria-live="polite"
          >
            <span className="text-gray-100 font-semibold tabular-nums">
              {filledCount}
            </span>{' '}
            decimal{filledCount === 1 ? '' : 's'} / {PI_LENGTH}
            {validated && (
              <>
                {' · '}
                <span className="text-emerald-400 font-semibold tabular-nums">
                  {correctCount}
                </span>{' '}
                correct
              </>
            )}
          </div>

          {/* Decimal inputs in a horizontally scrollable row. The active input
              is auto-centered, and the user can scroll left/right to review all
              of them. The 50% side padding lets the first/last cells reach the
              center too. */}
          <div
            ref={scrollRef}
            className="w-full overflow-x-auto overscroll-x-contain py-3"
          >
            <div className="flex gap-3 w-max px-[50%]">
              {digits.map((digit, i) => {
                const wrong = validated && !isDigitCorrect(digit, i);
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 w-14 shrink-0"
                  >
                    <input
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleChange(i, e)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onFocus={() => setActiveIndex(i)}
                      autoComplete="off"
                      autoFocus={i === 0}
                      aria-label={`Decimal ${i + 1}`}
                      data-testid={`pi-input-${i}`}
                      className={`w-14 h-14 bg-gray-900/60 text-gray-100 text-2xl text-center rounded-lg border-2 outline-none caret-transparent transition-colors ${borderFor(
                        i,
                      )}`}
                    />
                    {/* Reserve the slot so the row height never jumps; show the
                        correct decimal under a wrong answer. */}
                    <span className="h-5 text-sm font-semibold text-emerald-400 tabular-nums">
                      {wrong ? PI_DIGITS[i] : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!validated && (
              <button
                onClick={validate}
                className="px-8 py-3 rounded-lg bg-amber-500 text-gray-950 font-semibold hover:bg-amber-400 transition-colors text-lg"
              >
                Check
              </button>
            )}
            <button
              onClick={reset}
              className="px-6 py-3 rounded-lg border-2 border-gray-700 text-gray-300 font-semibold hover:border-gray-500 hover:text-gray-100 transition-colors text-lg"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
