# Intellica

**``Intellica``**  is a modern AI chat application designed to deliver seamless, conversational experiences. Built for clarity, creativity, and speed, Intellica helps users brainstorm, ask questions, learn new things, and get help with tasks — all through a focused, text-only interface.

Designed with simplicity, responsiveness, and clarity in mind, Intellica integrates **``Google Generative AI``** for natural language responses, and is built using the modern **`` MERN stack (MongoDB, Express, React, Node.js) ``**, along with **`` TailwindCSS ``** and **`` TanStack Query ``** for a polished and reactive user experience.

### 🌐 [*View Live*](https://intellica-9fur.onrender.com/)

---
## 🚀 `` Features ``
- 🤖 **AI Chat** : Human-like, intelligent conversations powered by Google Generative AI. Handles multi-turn prompts with rich markdown rendering.

- 🧠 **Text-Only Responses** : Pure language responses, optimized for focus and clarity.
 
- 🖼️ **Optional Image Uploads** : Upload images to get context-aware text analysis.
 
- 💬 **Chat History** : View, continue, or delete past conversations in a responsive sidebar.
 
- 🔐 **Authentication** : Secure login & registration with Clerk integration.
 
- 📱 **Fully Responsive Design** : Built mobile-first with clean layouts for all screen sizes.
  
---
## 🧱 `` Tech Stack ``
### Frontend
- React
- TanStack Query
- TailwindCSS + Lucide Icons
- React Markdown
- React Router
- Clerk

### Backend
- Node.js with Express.js
- Google Generative AI (@google/generative-ai)
- MongoDB + Mongoose
- Cloudinary 
- Clerk Express

---

## 🌍 `` Deployment ``

The entire application is deployed on **Render** using a single **Web Service**.

- **Backend (Express + API)** and **Frontend (React)** are bundled together.
- React is built into static files and served by Express from the `/frontend/dist` folder in production.
