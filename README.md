# Project Astera

**Every note, sorted like it was made for your class.**

Project Astera is a free, modern educational library built for students everywhere. We collect study guides, worksheets, and past papers from a global community of volunteers, and file them by country, curriculum, grade, and subject. This structured catalog ensures that finding the exact study material you need takes seconds, not endless searches.

## Key Features

- **Global Curriculum Catalog:** Resources organized neatly by country, board (e.g. CBSE, Common Core, GCSE), grade, and subject.
- **Dedicated Dashboards:** 
  - **Students:** Track your favorite resources and subjects.
  - **Volunteers:** Easily upload and catalog study materials to help students worldwide.
  - **Admins:** Review and curate submissions to ensure high-quality content.
- **Lightning-Fast Search:** Instantly query across thousands of indexed educational documents.
- **Modern Tech Stack:** Built with Next.js, Prisma ORM, and styled with Tailwind CSS for a seamless, fast, and beautiful user experience.

---

## Getting Started

Follow the instructions below to run the Astera project locally on your machine.

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun
- A SQL Database (e.g., PostgreSQL or SQLite depending on your Prisma configuration)

### Installation & Setup

1. **Clone the repository (if you haven't already):**
   ```bash
   git clone YOUR_GITHUB_REPO_URL
   cd astera
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your database URL and any other required secrets.
   ```bash
   DATABASE_URL="your_database_url_here"
   ```

4. **Initialize the Database:**
   Run Prisma to push the schema to your database and generate the Prisma Client.
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```

6. **View the App:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

To create an optimized production build, run:
```bash
npm run build
npm run start
```
