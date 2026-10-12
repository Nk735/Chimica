# Chimica

Duolingo-style chemistry practice app built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Parses chemistry questions from `/src/data/chemistry-questions.txt` into a typed data model.
- Home dashboard with modules/topics and last-session progress summary.
- Quiz mode with:
  - 3-heart life system
  - XP scoring
  - top completion progress bar
  - instant correct/incorrect visual feedback and explanations
- Results summary with score, accuracy, XP earned, and lives remaining.
- Mistakes review mode that launches a quiz session using only previously missed questions.

## Project Structure

- `/src/components` - reusable quiz UI pieces.
- `/src/data` - raw question file and parser.
- `/src/hooks` - quiz state machine logic.
- `/src/screens` - Home, Quiz, and Results screens.
- `/src/types` - shared TypeScript models.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Notes on Question Data

Question entries in `src/data/chemistry-questions.txt` must follow this format:

```text
TOPIC: <topic>
QUESTION: <prompt>
TYPE: multiple-choice | true-false
OPTIONS: option 1|option 2|...
ANSWER: <must match one of OPTIONS>
EXPLANATION: <answer explanation>
---
```

The parser validates required fields and answer correctness before exposing the structured question set.
