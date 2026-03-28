
---

# 🥘 Savanna Kitchen

### **Authentic Tanzanian Cuisine | Modern Web Experience**

Savanna Kitchen is a premium full-stack restaurant web application built for a modern dining experience in Dar es Salaam.

It combines a dynamic menu system, real-time reservations, and an embedded CMS to give restaurant owners full control while delivering a fast, mobile-first experience to customers.

---

## ✨ Overview

This project is designed with **performance, scalability, and usability** in mind — tailored specifically for users in Tanzania, including support for slower network conditions (3G/4G).

---

## 🚀 Features

* **🍽 Dynamic Menu**
  Managed via **Sanity CMS**, allowing real-time updates to dishes, pricing, and availability.

* **🧠 Embedded CMS Studio**
  Fully integrated Sanity Studio available at `/studio` for seamless content management.

* **📅 Reservation System**
  Real-time booking powered by **Supabase**, with planned email notifications via **Resend**.

* **📱 Mobile-First Design**
  Optimized for smartphones and low-bandwidth environments.

* **⚡ High Performance**
  Built with **Next.js 14 (App Router)** and **ISR (Incremental Static Regeneration)** for fast loading.

---

## 🛠️ Tech Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| **Frontend**   | Next.js, React, TypeScript, Tailwind CSS |
| **CMS**        | Sanity.io                                |
| **Database**   | Supabase (PostgreSQL)                    |
| **Styling**    | Tailwind CSS + Styled Components         |
| **Deployment** | Vercel                                   |

---

## 📂 Project Structure

```bash
savanna-kitchen/
│
├── app/                     # Next.js App Router
│   ├── studio/              # Embedded Sanity Studio
│   ├── reservations/        # Booking system (Supabase)
│
├── components/              # Reusable UI components
├── lib/                     # Clients & utilities (Sanity, Supabase)
├── studio-savanah-kitchen/  # CMS schemas & config
├── public/                  # Static assets
│
└── README.md
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/engibrah/savanna-kitchen.git
cd savanna-kitchen
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Contact
NEXT_PUBLIC_CONTACT_PHONE="+255..."
```

---

### 4️⃣ Run Development Server

```bash
npm run dev
```

Visit:

* 🌐 App → [http://localhost:3000](http://localhost:3000)
* 🧠 CMS → [http://localhost:3000/studio](http://localhost:3000/studio)

---

## 🧭 Roadmap

* [x] Integrate Sanity Studio with Next.js App Router
* [x] Create Menu & Category Schemas
* [x] Setup Project Architecture
* [ ] Connect Reservation System to Supabase
* [ ] Add Email Notifications (Resend)
* [ ] SEO Optimization for Local Search (Dar es Salaam)
* [ ] Admin Dashboard for Orders & Analytics

---

## 🔐 Environment & Security Notes

* Never commit `.env.local`
* Use **server-side Supabase (service role)** securely
* Protect admin routes (important for production)

---

## 🤝 Contributing

This is a private client project.
However, feedback, ideas, and improvements are welcome via issues.

---

## 📄 License

**Private Project — All Rights Reserved**

---

## 💡 GitHub Best Practices

Before pushing your code, ensure your `.gitignore` includes:

```bash
node_modules/
.next/
.env.local
```

---

## 🚀 Future Improvements

* WhatsApp Order Tracking Integration
* AI-based Dish Recommendations
* Analytics Dashboard for Restaurant Owners

---


