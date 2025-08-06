# 💬 Real-Time Chat App - Zimmer Marketing Coding Challenge

This is a real-time chat application built with **Svelte** for the frontend and **PocketBase** for the backend. This was built for a coding challenge for Zimmer Marketing.

It features real-time updates, secure user authentication, persistent login sessions, and a modern, mobile-friendly interface. 

---

## 🚀 Features 

- 🔐 User authentication (register + login)
- 💬 Real-time messaging using PocketBase subscriptions
- 📱 Responsive design (mobile and desktop)
- ⏱️ Auto-scroll to newest message
- ⏰ Timestamp formatting (local time)
- 🧠 Cookie-based session persistence
- ✅ Clean, modern chat UI

---

## 📦 Tech Stack

Frontend | Svelte + Vite
Backend | PocketBase
Realtime | PocketBase Subscriptions

---

## ⚙️ Local Development Setup

### 1. Clone this repo

```bash
git clone git@github.com:Zyncster/zimmmer-chat-app.git
cd zimmer-chat-app
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Start PocketBase (backend)

Make sure you've downloaded the [PocketBase binary](https://pocketbase.io/docs)

```bash
./pocketbase serve --http://=0.0.0.0:8090
```

If you run into port issues, try:

```bash
sudo kill $(lsof -ti:8090)
```

### 4. run the Svelte frontend
```bash
npm run dev -- --host
```

Open  `http:/localhost:5173` in your browser

---

## 🛠 Project Notes

- New users created through the app automatically have `emailVisibility = true` so names show up in chat.
- All messages are sorted from oldest to newest.
- Live updates are powered by PocketBase’s real-time subscriptions.
- App is mobile responsive and scrolls to the latest message on load and on new message.

---

## 🧾 Submission Details

This project was completed by **Zachary Bishop** as part of the Web Developer Challenge for Zimmer Marketing (August 2025).  
It showcases front-end polish, basic full-stack structure, and problem-solving.

---

## 📬 Contact

Feel free to reach out:
- Email: zacharytbishop@outlook.com
- GitHub: [github.com/Zyncster](https://github.com/Zyncster)

---