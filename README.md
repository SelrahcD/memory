# Memory Tools

Personal tools to practice a memory peg system, built with React + TypeScript + Tailwind CSS.

## Tools

### Peg List

A reference sheet of all 100 number→word pairs (00–99).

### Peg Quiz

A random two-digit number is shown; you type the associated peg word. Correct → green flash and auto-advance. Wrong → red flash and the right answer is displayed. Space or Enter moves on.

## Data

The peg list lives in a single file: [`src/utils/pegs.ts`](src/utils/pegs.ts). Edit that array to swap in your own list.

## Getting Started

```sh
npm install
npm run dev
```

## Tech Stack

- [Vite](https://vite.dev)
- [React](https://react.dev) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
