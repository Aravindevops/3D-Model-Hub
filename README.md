# 3D Digital Asset Manager

![Project Screenshot](docs/screenshot.png) 
*(Note: Replace `docs/screenshot.png` with the actual path to your screenshot image!)*

A full-stack web application designed for managing, hosting, and dynamically viewing interactive 3D models (GLB format). Built with a focus on premium, minimalist design and high-performance WebGL rendering.

## 🚀 Features

- **Interactive 3D Gallery**: View uploaded models in a responsive grid. Click and drag to orbit around the 3D assets in real-time.
- **Admin Dashboard**: Securely upload binary `.glb` files directly to cloud storage.
- **Relational Metadata**: Store and manage asset metadata (titles, descriptions, timestamps) alongside cloud storage URLs.
- **Minimalist UI**: Clean, distraction-free interface utilizing glassmorphism and modern typography.
- **Server-Side Rendering**: Built with Next.js App Router for optimal SEO and lightning-fast page loads.

## 🛠️ Tech Stack

- **Frontend**: React, Next.js (App Router), Vanilla CSS
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **Backend & Database**: Supabase (PostgreSQL)
- **Cloud Storage**: Supabase Storage
- **Icons**: Lucide React

## 💻 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn
- A [Supabase](https://supabase.com/) account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YourUsername/3d-asset-manager.git
   cd 3d-asset-manager
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the Database
   Run the provided `schema.sql` file in your Supabase SQL Editor to create the necessary tables, storage buckets, and security policies.

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🗄️ Database Schema
The application relies on a single `models` table and a `models` storage bucket.
- `id` (UUID)
- `title` (Text)
- `description` (Text)
- `glb_url` (Text) - Points to the binary file in the storage bucket.
- `created_at` (Timestamp)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
