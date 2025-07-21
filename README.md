# Land Management System

A modern, full-stack web application for Rwandan land registration and transfer, built for citizens, notaries, and administrators. This project uses Vue 3, Supabase, and Tailwind CSS for a beautiful, scalable, and real-world-ready experience.

## Features

- **User Authentication** (Supabase Auth, email/password)
- **Role-based Access** (Citizen, Notary, Admin via user metadata)
- **Land Registration**: Register land parcels, upload supporting document links, track status
- **Land Transfer**: Initiate, view, and manage land transfers with all required details
- **Responsive, Professional UI**: Modern navigation, beautiful landing page, and clean tables
- **Toasts, Modals, and Error Handling**: User-friendly feedback throughout
- **TypeScript & Pinia**: Type-safe, maintainable, and scalable

## Tech Stack

- **Frontend**: Vue 3 + Vite + TypeScript
- **Styling**: Tailwind CSS, Shadcn Vue UI components
- **State Management**: Pinia
- **Backend**: Supabase (Database, Auth, Storage)
- **Data Fetching**: Direct Supabase client (optionally Tanstack Query)
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Clone the Repository

```bash
# Clone the repo
https://github.com/your-org/land-management-system.git
cd land-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root with your Supabase credentials:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Supabase Setup

- Create a Supabase project at [supabase.com](https://supabase.com/)
- Create the `lands` and `transfers` tables using the provided SQL (see below)
- Enable Row Level Security (RLS) and set up policies as in the project brief
- [Optional] Create a `profiles` table for advanced user roles

#### Example Table SQL

```
-- lands table
create table public.lands (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  parcel_id text not null unique,
  size text not null,
  location text not null,
  ownership_type text not null,
  status text default 'pending' not null,
  documents text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- transfers table
create table public.transfers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  land_id uuid references public.lands(id) on delete cascade not null,
  parcel_id text not null,
  transferee_name text not null,
  transferee_email text not null,
  transfer_type text not null,
  reason text,
  status text default 'pending' not null,
  documents text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 5. Run the App Locally

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### 6. Deployment (Vercel)

- Push your code to GitHub
- Go to [vercel.com](https://vercel.com/) and import your repo
- Set the environment variables in the Vercel dashboard
- Deploy!

## Usage

- Sign up and log in as a user
- Register land parcels and upload supporting document links
- Initiate and manage land transfers
- Enjoy a beautiful, responsive, and real-world-ready UI

## Credits

- Built with Vue 3, Supabase, and Tailwind CSS
- UI inspired by modern SaaS best practices
- Designed for real-world use and CEO-level presentation

---

For any questions or contributions, please open an issue or pull request.
