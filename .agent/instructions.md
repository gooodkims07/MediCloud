# MediCloud Project Context

## Overview
MediCloud is a medical management dashboard built with React and Vite. It allows tracking patients, medical records, and appointments.

## Tech Stack
- **Frontend:** React 19, Vite 7
- **Styling:** Vanilla CSS (using CSS variables in `index.css`)
- **State Management:** React `useState` for tab navigation

## Project Structure
- `src/components/`: Core UI components (Sidebar, Dashboard, PatientList, etc.)
- `src/App.jsx`: Main entry point handling tab navigation
- `src/index.css`: Global styles and design tokens (colors, spacing, etc.)

## Coding Standards
- Use functional components and hooks.
- Follow the design system defined in `index.css`.
- Ensure all interactive elements have descriptive IDs.

## Key Instructions
- When adding new features, maintain the clean, premium medical UI aesthetic.
- '예약 현황' (Appointment Status) has been renamed to '당일 예약자' (Today's Reservation Holders) in the Sidebar.
