# 🟥 The Crimson Block — Premium Interactive Single-Page Product Showcasing Website

<p align="left">
  <a href="https://crimsonblock.lovable.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-crimson?style=for-the-badge" height="28" style="vertical-align: middle;" />
  </a>
  <a href="https://lovable.dev" target="_blank">
    <img src="https://img.shields.io/badge/Built%20with-Lovable-blue?style=for-the-badge" height="28" style="vertical-align: middle; margin-left: 4px;" />
  </a>
  <a href="https://www.grameenphone.academy" target="_blank">
    <img src="https://img.shields.io/badge/ASSIGNMENT-Grameenphone%20Academy-white?style=for-the-badge&labelColor=555555" height="28" style="vertical-align: middle; margin-left: 4px;" />
  </a>
</p>

> **EST. MMXXVI · LIMITED SERIES** > One brick. Hand-fired in obsidian kilns. Sold as a monument, not a material. For those who understand that scarcity is the last true luxury.

---

## 🎯 Project Overview & Assignment Pitch

This repository hosts an advanced single-page interactive experience developed for the **Grameenphone Academy AI Bootcamp Showcase**.

### The Assignment Pitch
Developed for Grameenphone Academy’s AI Bootcamp, "The Crimson Block" elevates the planet's most mundane object—a plain red brick—into an elite, limited-edition luxury artifact priced at ৳9,999. To capture the modern user’s three-second attention span, the platform replaces traditional e-commerce friction with high-energy gamification and zero-maintenance single-page architecture.

Built using React, Vite, TypeScript, and Tailwind CSS via Lovable, my solution implements **all three** high-interactivity tracks specified in the syllabus: an interactive 8-bit retro mini-game (*The Brick Runner*), scroll-synchronized cinematic video transitions, and a hardware-accelerated WebGL 3D model analyzer. 

My iterative AI prompting style enforced strict mathematical boundaries on layout updates and animation cycles. The result is an ultra-fluid, performance-optimized synthesis of creative branding and frictionless user design on a single page.

---

## 📋 Project Requirements vs. Implemented Solutions

The core assignment mandate required building a highly interactive product page that balances aesthetic precision with flawless responsiveness without loading page reloads.

| Assignment Requirement | My Implementation Strategy | Architectural Execution |
| :--- | :--- | :--- |
| **Luxury Rebranding** | Premium Cyberpunk Minimalist Theme | High-contrast token definitions (`#07070a`, `#d81f2a`), dark-mode display structures, and explicit pixel borders. |
| **Requirement 1: Mini-Game** | "The Brick Runner" Arcade Engine | Native HTML5 Canvas layout running on a time-delta calculation layer. Dynamic high scores inject discount contexts directly into core state blocks. |
| **Requirement 2: Scrolling Transition** | Cinematic Video Scrubbing | Scroll-bound media timeline positioning driven by a custom linear-interpolation loop using `requestAnimationFrame` with browser decoder locks. |
| **Requirement 3: Interactive 3D** | Interactive Artifact Analysis | Three.js integration utilizing custom low-gravity floating loops, dynamic matrix coordinate hotspots, and custom cubic-eased camera interpolation rigs. |
| **Frictionless UX** | Dynamic Accountless Checkout | Zero registration barriers. Includes live calculations for digital discounts and localized payment pathways (bKash ecosystem simulation). |

---

## 🛠️ Technical Deep Dive

### 1. Hardware-Accelerated 3D Analysis (`InteractiveShowcase.tsx`)
The centerpiece of the technical architecture is a native WebGL view layer built using `@react-three/fiber`. 
* **Dynamic Hotspot Projection:** Real 3D coordinate matrices (`Vector3`) are projected directly into DOM overlay spaces using responsive spatial vectors, keeping contextual markers securely locked onto specific components of the model.
* **Cinematic Float & Anti-Jerk Logic:** To preserve main thread cycles, automated zero-gravity floating operates using compound harmonic sine waves. When standard viewports detect manual pan interactions, an interpolation value smoothly shifts movement authority to avoid animation micro-stuttering.
* **Rig Easing:** Perspective shifts and view restorations execute via custom cubic easing equations (`1 - Math.pow(1 - t, 3)`), preventing camera movement cuts.

### 2. Fluidity & High-Performance Scrolling (`SpecsScroll.tsx`)
Standard web scroll animations frequently trigger main-thread layout calculations that skip frames on complex viewports. This architecture completely decouples scroll handling. View positions are intercepted by passive frame hooks, computed via tight alignment formulas, and processed using GPU transforms (`will-change: transform`), preserving a stable 60fps frame structure on high-refresh displays.

### 3. Time-Clamped Canvas Physics (`Game.tsx`)
The collision matrix and asset tracking within the mini-game run on a time-delta mechanism (`dt = Math.min(0.1, ...)`). This ensures simulation logic evaluates identically regardless of whether the client processes frames on an older mobile layout or a modern 144Hz screen.

---

## 💻 Tech Stack & Tooling

* **Core Runtime Architecture:** React 18 / TypeScript
* **Build Architecture:** Vite
* **Layout Mechanics:** Tailwind CSS + Custom Pixel Utility Classes
* **State Management Engine:** Global React Context API matching LocalStorage layers
* **AI Generation Platforms:** Lovable.dev (Zero-code script layout compilation and visual modularization)
