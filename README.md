# Course Catalog (Lab 1)

This is a semester project for the "Advanced Web Technologies" course. It's a mock course catalog built with Next.js (App Router), TypeScript, and Tailwind CSS.

## What is implemented
- **Static routing**: Home (`/`) and About (`/about`) pages.
- **Dynamic routing**: Course details page at `/courses/[id]` using `generateStaticParams`.
- **Data fetching**: Simulated mock backend in `lib/courses.ts` with artificial delay.
- **Interactivity**: Client-side `LikeButton` component with `useState`.
- **Bonus Tasks**: 
  - Client-side search and filtering on the `/courses` page.
  - Custom `error.tsx` boundary (testable at `/courses/broken`).
  - Route group `(auth)` with a `/login` stub.
  
## Lab 2 Styling
- Integrated `shadcn/ui` components (Card, Button, Badge).
- Added responsive grid for course list (`grid-cols-1` to `xl:grid-cols-4`).
- Styled navigation with active states and custom brand colors.
- Full dark mode support using `dark:` classes and `oklch` variables.
  
## How to run locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
[Link to Vercel deployment] (replace this with your actual Vercel link if you deploy it)
