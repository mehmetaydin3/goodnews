# Musician Design System Guidelines

## Purpose
This document establishes the visual language, motion principles, and component standards for the `musician-ds` project. It serves as the single source of truth for creating a consistent, premium, and creator-centric experience.

---

## 1. Core Design Philosophy

### The "Stage" Metaphor
The UI should act as a sophisticated "stage" for the musician’s talent. The interface remains neutral and elegant, allowing vibrant media and high-quality photography to take center stage.

### Principles of Excellence
*   **Clarity & Whitespace:** Avoid density. Use generous whitespace to create a sense of breath and luxury.
*   **Interactive Product as Hero:** Treat UI elements (like waves and cards) as immersive focal points, not just utilities.
*   **Trust First:** Every design decision must reduce hiring uncertainty through clear verification and proof-of-skill.
*   **Editorial Motion:** Animation should feel like a high-end magazine coming to life—subtle, rhythmic, and purposeful.

---

## 2. Typography System

We use a geometric, high-contrast scale to drive layout hierarchy and professional tone.

**Recommended Typefaces:**
*   **Primary:** Outfit or Inter (Geometric Sans-Serif)
*   **Fallback:** SF Pro / System Sans

| Role | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 56–64px | Bold/Heavy | 1.1 | Hero Headlines |
| **Heading 1** | 40–48px | Bold | 1.2 | Page Titles |
| **Heading 2** | 28–32px | Semibold | 1.3 | Major Section Headers |
| **Heading 3** | 20–24px | Medium | 1.4 | Module/Component Titles |
| **Body (L)** | 18–20px| Regular | 1.6 | Narrative Context Blocks |
| **Body (M)** | 16px | Regular | 1.5 | General UI / Descriptions |
| **Caption** | 14px | Medium | 1.4 | Metadata / Small Labels |
| **Micro** | 12px | Bold | 1.0 | Status Tags / All-caps labels |

---

## 3. Spacing & Grid System

All layouts are built on a strict **8px base grid** to ensure mathematical harmony.

**The Spacing Scale:**
*   **4px (Micro):** Internal element spacing (e.g., Icon to Label).
*   **8px (Base):** Standard padding/margins within components.
*   **16px/24px:** Gutters and logical groupings.
*   **48px/64px:** Section padding.
*   **120px (Major):** Vertical gaps between distinct narrative blocks.

**Grid Architecture:**
*   **Max Content Width:** 1200px.
*   **Context Block Width:** 700px (Optimized for reading speed).

---

## 4. Motion & Interactivity

Motion is used to guide attention and communicate state changes with a "premium" feel.

### Core Animation Rules
*   **Section Reveals:** Fade & Slide-up (`opacity: 0->1`, `translateY: 20px->0`) | 500ms | `cubic-bezier(0.2, 0.8, 0.2, 1)`.
*   **Hover Elevation:** Cards lift subtly (-4px) with an increased soft shadow blur | 250ms | `ease-out`.
*   **Micro-interactions:** Transitions for toggles and buttons | 150ms | `linear`.

### Loading Strategy
*   **Skeleton Loaders:** MANDATORY for all async data. Avoid spinners unless for background processes (e.g., file upload).

---

## 5. Global Component Library

### Discovery & Search
*   **Search Bar:** Centered, high-contrast input with "focus" elevation.
*   **Filter Drawer:** Clean, slide-out interface with categorized multi-selects.

### Profile & Service Presentation
*   **Musician Card:** Media-first, 4:5 or 16:9 aspect ratio hero, clear headline.
*   **Audio Preview:** Waveform-based player with floating play/pause controls.
*   **Service Module:** Pricing-focused cards with explicit deliverable lists.

### Action Elements
*   **Primary CTA:** High-contrast, bold buttons (e.g., "Book Service").
*   **Secondary CTA:** Ghost/Outlined buttons (e.g., "Message").
*   **Trust Badges:** Verified icons for pro-status and media verification.
