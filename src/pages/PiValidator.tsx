import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PI_DIGITS, PI_LENGTH, isDigitCorrect } from '../utils/pi';

// Cell geometry (px): input is w-14 (56) and cells sit 12px apart.
const CELL_W = 56;
const CELL_FULL = CELL_W + 12;
// Only render this many cells on each side of the active one — keeps the DOM
// light (≤21 inputs) so the slide stays fluid instead of moving 100 nodes.
const WINDOW = 10;
// px of wheel travel that advances the selection by one cell.
const WHEEL_STEP = 40;

export default function PiValidator() {
  const [digits, setDigits] = useState<string[]>(() =>
    Array(PI_LENGTH).fill(''),
  );
  const [validated, setValidated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const wheelAcc = useRef(0);

  const filledCount = digits.filter((d) => d !== '').length;

  const focusInput = useCallback((index: number) => {
    // preventScroll: the track is centered by transform, not by the browser
    // scrolling the focused input into view.
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

  // Let a mouse wheel / trackpad move through the decimals (handy for review),
  // stepping the selection cell by cell without a native scrollbar.
  const handleWheel = (e: React.WheelEvent) => {
    const raw =
      Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!raw) return;
    wheelAcc.current += raw;
    let steps = Math.trunc(wheelAcc.current / WHEEL_STEP);
    if (steps === 0) return;
    wheelAcc.current -= steps * WHEEL_STEP;
    // Never jump past the rendered window so the target input still has a ref.
    steps = Math.max(-WINDOW, Math.min(WINDOW, steps));
    const target = Math.max(0, Math.min(PI_LENGTH - 1, activeIndex + steps));
    if (target !== activeIndex) focusInput(target);
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

  // Slide the track so the active cell's center lands at the container center.
  const trackShift = -(activeIndex * CELL_FULL + CELL_W / 2);
  const lo = Math.max(0, activeIndex - WINDOW);
  const hi = Math.min(PI_LENGTH - 1, activeIndex + WINDOW);
  const windowIndices: number[] = [];
  for (let i = lo; i <= hi; i++) windowIndices.push(i);

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

          {/* Decimal inputs on a sliding track. Only a window of cells around
              the active one is rendered; the track translates so the active
              input stays centered, and a wheel moves through the decimals. */}
          <div className="w-full overflow-hidden" onWheel={handleWheel}>
            <div className="relative h-24">
              <div
                className="absolute top-0 left-1/2 transition-transform duration-200 ease-out"
                style={{ transform: `translateX(${trackShift}px)` }}
              >
                {windowIndices.map((i) => {
                  const digit = digits[i];
                  const wrong = validated && !isDigitCorrect(digit, i);
                  return (
                    <div
                      key={i}
                      className="absolute top-0 flex flex-col items-center gap-1"
                      style={{ left: i * CELL_FULL, width: CELL_W }}
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
                      {/* Reserve the slot so the row height never jumps; show
                          the correct decimal under a wrong answer. */}
                      <span className="h-5 text-sm font-semibold text-emerald-400 tabular-nums">
                        {wrong ? PI_DIGITS[i] : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
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
