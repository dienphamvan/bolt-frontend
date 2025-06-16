# Bolt Frontend

This is a Next.js project for the Bolt assignment.

## Project Structure

```
.
├── app/                # App directory (Next.js app router)
├── components/         # Reusable UI and feature components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and API helpers
├── public/             # Static assets
├── styles/             # Global and component styles
├── types/              # TypeScript type definitions
├── .env.example        # Example environment variables
├── next.config.mjs     # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── package.json        # Project metadata and scripts
└── ...
```

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Copy environment variables

```sh
cp .env.example .env
```
Edit `.env` with your own values as needed.

### 3. Run the development server

```sh
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```sh
npm run build
npm start
```

## Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm start` – Start the production server
- `npm run lint` – Lint the codebase

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

## License

This project is for the Bolt assignment and is not licensed for production use.