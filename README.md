# Uni Grade & GPA Tracker

Uni Grade & GPA Tracker is a React + TypeScript web application for Nigerian university students who want to calculate, understand, and monitor their GPA and CGPA across multiple semesters.

It is designed to do more than show a final number. The app exposes the actual grading logic behind each semester, shows how every course contributes to weighted quality points, tracks cumulative CGPA correctly, and makes it easier to reason about academic standing over time.

## Why This Was Built

Many students do GPA calculations in scattered notebooks, WhatsApp messages, rough spreadsheets, or mental math. That usually creates three problems:

- the final CGPA is sometimes computed incorrectly as an average of semester GPAs
- students do not always know how close they are to the next classification band
- course records can disappear or become hard to audit later

This project was built to solve that with a simple browser-based tool that is:

- immediate: every change recalculates instantly
- transparent: the formula and course-by-course breakdown are visible
- practical: no account is required and data persists locally
- locally relevant: it uses the Nigerian 5.0 grading system and degree classifications

## What The App Does

- Manage multiple semesters with add/remove controls
- Add and edit courses inline
- Calculate semester GPA from course grade points and credit units
- Calculate cumulative CGPA correctly using total quality points divided by total credit units
- Show live degree classification and the gap to the next band
- Visualize GPA trend across semesters
- Visualize grade distribution across all recorded courses
- Support zero-unit courses that are tracked but excluded from GPA/CGPA
- Save data in `localStorage`
- Export all course records to CSV
- Stay usable on mobile, tablet, and smaller laptop screens

## Grading Logic

The app uses the Nigerian 5.0 grading system:

- `A = 5.0`
- `B = 4.0`
- `C = 3.0`
- `D = 2.0`
- `E = 1.0`
- `F = 0.0`

Classification bands:

- `First Class: 4.50 - 5.00`
- `Second Class Upper: 3.50 - 4.49`
- `Second Class Lower: 2.40 - 3.49`
- `Third Class: 1.50 - 2.39`
- `Pass: 1.00 - 1.49`
- `Fail: 0.00 - 0.99`

Important calculation note:

- Semester GPA is calculated as `total weighted quality points / total credit units`
- CGPA is calculated as `total cumulative quality points / total cumulative credit units`
- CGPA is not computed as the average of semester GPAs

## Zero-Unit Courses

Some university courses must be taken but do not affect CGPA. The app supports that case explicitly.

- You can leave a new units field blank and use the placeholder hint
- You can enter `0` when a course should be tracked but excluded from GPA/CGPA
- Zero-unit courses still appear in the semester record, export, and grade tracking context
- They do not contribute to total credit units or total quality points

## Tech Stack

- React
- TypeScript
- Vite
- Recharts
- CSS with custom properties for theming
- Browser `localStorage` for persistence

## How To Run It

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Then open the local URL shown in the terminal.

### 3. Create a production build

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` runs TypeScript build checks and creates a production bundle
- `npm run preview` serves the built app locally
- `npm run lint` runs ESLint

## Key Decisions And Why

### 1. React + TypeScript

This app has a lot of derived state and academic calculation rules. TypeScript makes the grade model, semester model, CSV export shape, and calculation output safer and easier to evolve.

### 2. No external state library

The product scope is contained enough that React hooks are sufficient. Using `useState`, `useMemo`, and `useEffect` keeps the state flow straightforward and easier for future contributors to follow.

### 3. Utility-driven calculation layer

The GPA/CGPA logic lives in typed utility functions rather than being embedded directly inside components. That separation keeps the UI simpler and makes the academic rules easier to review.

### 4. Local-first persistence

This project does not need authentication or a backend to be useful. `localStorage` makes the tool fast, private by default, and practical for students who just want to open the app and continue where they stopped.

### 5. Inline editing over form-heavy flows

Course tables are meant to feel quick and spreadsheet-like. A student should be able to open the app, type directly into a row, and see the GPA update immediately without extra save buttons or modals.

### 6. Recharts for feedback and motivation

Numbers matter, but trends matter too. The GPA trend line and grade distribution chart help students spot improvement, decline, and overall grade patterns without reading raw tables only.

### 7. Explicit support for zero-unit courses

This was an important local academic reality. A generic GPA tracker might assume every course has positive units, but that would be inaccurate for some institutions and course types.

### 8. Responsive behavior tuned beyond mobile

The layout was adjusted not only for phones, but also for smaller laptop screens where side panels can become cramped. The sidebar and semester table change behavior at different breakpoints so the app remains readable and usable.

### 9. Always-visible reference context

Students often need to remember the grading scale and classification ranges while entering data. Keeping the reference guide in the interface reduces context switching and mistakes.

## Project Structure

```text
src/
  components/
    charts/
  data/
  hooks/
  types/
  utils/
```

High-level intent:

- `components/` contains UI building blocks
- `components/charts/` contains Recharts-based visualizations
- `data/` contains grading constants and classification bands
- `hooks/` contains reusable React hooks such as local storage persistence
- `types/` contains the academic domain types
- `utils/` contains calculation, formatting, ID creation, and CSV export logic

## Product Notes

- This tool is a planning and tracking aid, not an official academic record system
- Final GPA, CGPA, and degree class should always be verified against department or school records
- Data is stored in the browser, so clearing site storage will remove saved records

## Future Improvements

- Import from CSV
- Print or PDF export
- Multi-scale support for institutions outside the 5.0 system
- Optional cloud sync
- Shareable read-only reports

## CV Description

> Developed Uni Grade & GPA Tracker, an academic tool to help university students calculate and monitor GPA progress over multiple semesters. Created an intuitive React frontend for seamless user input and data visualization.
