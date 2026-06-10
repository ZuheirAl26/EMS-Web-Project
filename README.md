Exhibition Management System

A modern, scalable frontend application designed to manage exhibitor experiences, booth statistics, and profile configurations. This project prioritizes a clean UI/UX and a modular, feature-based architecture to ensure long-term maintainability.

🌟 Overview

A unified, modern web application designed to manage the entire lifecycle of an exhibition. This repository contains the centralized frontend system for both **Administrators** and **Exhibitors**, providing distinct, role-based dashboards within a single scalable codebase. 

Through this platform, **Administrators** hold full operational control to orchestrate booth approvals, manage services, and monitor overall event health. Simultaneously, **Exhibitors** are empowered to seamlessly book spaces via an interactive map, manage their public profiles, schedule events, and track attendee engagement. Built with a focus on intuitive UI/UX and a modular, feature-based architecture, this project ensures a streamlined and premium management experience for all event stakeholders.

---
✨ Features

🏢 Exhibitor Experience
* **Secure Access & Profile Management:** Exhibitors can securely register, log in, and manage their company profiles and public descriptions.
* **Booth & Event Management:** Upon admin approval, exhibitors can fully manage their booth data, company details, and schedule special events within the exhibition.
* **Lead Generation & Analytics:** A dedicated dashboard allows exhibitors to track users interested in their offerings and view general statistics regarding their booths and events.
* **Direct Support:** Built-in email communication gateway to easily reach exhibition administrators.

🛡️ Admin Experience
* **Approval Workflows:** Centralized control to accept or reject booth reservations and event hosting requests.
* **Exhibition Management:** Full control over booth data, statuses, available services, and pricing.
* **System Overview:** Access to comprehensive, high-level statistics regarding the exhibition, current booking statuses, and volunteer data (via Google Forms integration).
* **Exhibitor Communication:** Direct email communication portal to support and contact exhibitors.
---

🖱️ Interactive Features
* **Interactive Floor Map:** A dynamic, interactive map serving two purposes: 
  * *For Exhibitors:* Visually browse the exhibition floor, select available booths, and submit booking requests directly from the map.
  * *For Visitors:* Easily locate specific booths and navigate the exhibition grounds.
* **Dynamic Analytics Dashboards:** Live statistical views tailored to the user role—Administrators get a macro-view of overall exhibition health, while Exhibitors get targeted metrics on their specific booths and events.

---

🛠️ Tech Stack
* **Library:** React
* **Language:** TypeScript
* **Design & Prototyping:** Figma
* **Build Tool:** Vite 
* **Styling:** scss

---

📂 Project Structure

This application utilizes a strict **Feature-Based Architecture**. Instead of grouping files by type, everything related to a specific domain lives together. This allows UI logic and local state to be highly encapsulated.

```
src/
├── assets/          # Static assets (SVGs, images)
├── api/             # Global API config (Axios instances, interceptors)
├── components/      # Global, reusable UI components (Buttons, Modals)
├── context/         # Global React Contexts (AuthContext, ThemeContext)
├── features/        # Feature-based modules (The core of the app)
│   └── exhibitor-dashboard/
│       ├── api/         # Feature-specific API calls (getBoothStats)
│       ├── components/  # Local UI (BoothStatsChart)
│       ├── hooks/       # Local state management
│       ├── routes/      # Feature-specific routing
│       └── index.ts     # Public API
├── layouts/         # Structural wrappers
├── pages/           # High-level page aggregation
├── router/          # Global routing configuration
├── styles/          # Global theme variables and SCSS
├── types/           # Global TypeScript interfaces (User, Booth)
└── utils/           # Helper functions (formatDate, calculatePricing)
