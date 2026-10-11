# 🐾 PawDay — Your Daily Dog Companion

PawDay is a mobile-first web app for dog owners that provides daily personalised suggestions on food, treats, activities, training and health — based on the current weather, season, and what you're up to that day.

> ⚠️ This is currently a **public beta / demo**. Data does not persist between sessions. Some features (payments, push notifications, PDF export) are simulated.

---

## ✨ Features

### 🚀 Onboarding
- Step-by-step profile setup: name, photo, breed, size, age, health goals
- Breed picker with **live data from the Dog CEO API** (~250+ breeds)
- Multiple health goals selectable (Weight Management, Joint Health, Coat & Skin, and more)

### 🏠 Home
- Daily tip rotation
- Manual weather selector (7 conditions)
- Activity selector (10 activities — 5 free, 5 Pro)
- Quick view of today's reminders

### ✨ Suggest
- **AI Tips** — Claude-powered suggestions across 5 categories: Food & Nutrition, Treat Ideas, Tricks, Enrichment, General Tips. Context-aware: uses activity, weather, season, dog profile and health goals
- **Training Library** — 12 tricks from Beginner to Advanced, each with a full step-by-step instruction card

### 🍖 Recipes
- 12 handcrafted homemade dog treat recipes
- Filters by **season** (Spring / Summer / Fall / Winter) and **health goal**
- "Your Goal" badge on recipes matching the dog's health goals
- **AI Recipe Generator** (Pro) — generates a custom recipe based on dog profile, weather, season and activity
- Ingredients visible to all · Full cooking instructions unlocked with Pro

### 🏥 Health
- **Journal** — daily mood, energy, appetite, digestion log with notes
- **Weight Tracker** — manual weight log with interactive line chart (Pro)
- **Portion Calculator** — daily cups & kcal based on weight, activity level and food type · Precise grams unlocked with Pro+
- **SOS Vet Guide** — always free, 8 common symptoms with triage guidance (Monitor / Vet soon / Emergency)
- **Reminders** — toggleable health reminders, custom entries

### 🐶 Profile
- Dog profile: name, photo, breed, size, age, weight, allergies, health goals
- Active plan display (Free / Pro / Pro+)
- Multi-dog profiles (Pro+)

---

## 💳 Pricing

| Plan | Price | Key features |
|---|---|---|
| **Free** | $0 | 5 activities, 2 AI suggestions/category, recipe ingredients, basic journal, SOS Vet, basic portions |
| **Pro ⭐** | $9.99/mo or $59.99/yr | All activities, 4x AI suggestions, full recipes + AI generator, weight tracker, full journal history, PDF export, custom reminders, 6 training tricks |
| **Pro+ 💎** | $14.99/mo or $89.99/yr | Everything in Pro + multi-dog profiles, full training library (12 tricks), precision portion calculator, breed-specific insights |

> 7-day free trial included. Cancel anytime.

---

## 🚧 Demo limitations

The current version is a **frontend-only demo**. The following features are simulated and will be fully built in the production version:

- Data persistence (resets on page refresh) → requires backend + auth
- Paywall (Free/Pro/Pro+ toggle is manual) → requires RevenueCat or Stripe
- Push notifications (UI present, not functional) → requires Firebase Cloud Messaging
- PDF export (shows toast, no real file generated) → requires jsPDF or server-side rendering
- Weather (manual picker) → will use device geolocation + OpenWeatherMap API
- Seasonal recipes (static list) → will be fetched from a live database with weekly rotation

---

## 📬 Feedback

This app is currently in **private beta**. If you've been invited to test it, please share your feedback on:

- What you used most
- What confused you
- Whether you'd pay for a Pro subscription
- What you'd add or remove

---

## 📄 License

This project is currently **private and not open source**. All rights reserved.
---

*Built with ❤️ and a lot of 🐾*