
# CLAUDE.md — Master Project Guide

## Project Vision

**Prova** is a global marketplace for discovering, evaluating, and hiring professional musicians for paid work.

The platform connects:

• People who need musicians  
• Musicians offering professional services  

The goal is to become the **primary platform musicians use to generate income opportunities globally.**

Prova blends elements of:

• SoundBetter (professional music services)  
• Fiverr (service marketplace)  
• Airbnb (marketplace booking model)  
• LinkedIn (professional credibility & trust)

But it is **purpose-built specifically for musicians and music services.**

---

# Current Product Stage

The project is currently in **Alpha Development**.

Primary objective:

Build a **working marketplace loop** before adding complexity.

Core product flow:

Musician Listing → Musician Profile → Service Selection → Booking Request → Musician Accept / Decline

Only features required for this loop should be implemented.

Avoid premature features such as:
- advanced AI matching
- escrow payments
- availability calendars
- messaging systems

Those will come later.

---

# Target Marketplace Users

## Musicians (Supply)

Professional musicians offering services such as:

• Session recording  
• Wedding / event performances  
• Touring musicians  
• Studio musicians  
• Music production  
• Composition  
• Music lessons  
• Remote recording  
• Arranging / orchestration  

Musicians create profiles and define the services they offer.

---

## Clients (Demand)

People or organizations hiring musicians:

• Event planners  
• Wedding planners  
• Music producers  
• Recording studios  
• Film / TV production  
• Artists and bands  
• Venues  
• Private clients

Clients browse musicians and submit booking requests.

---

# Core Product Principles

1. **Trust First**
Musicians must appear credible and professional.

2. **Discovery Must Be Easy**
Users should quickly find relevant musicians.

3. **Booking Must Be Simple**
Clients should easily send booking requests.

4. **Media First**
Audio and video are primary proof of quality.

5. **Data Model First**
Structured musician/service data enables future AI matching.

---

# Source of Truth Documentation

All implementations should reference these documents.

## Design System

Path:
/docs/design-system/

Contains:

• Visual language  
• Typography scale  
• 8px spacing grid  
• Motion rules  
• Component system  

Design system ensures a **premium, editorial aesthetic**.

---

## Page Templates

Path:
/docs/templates/

Includes:

### Musician Listing Page (PLP)
Discovery and comparison structure.

### Musician Profile Page (PDP)
Trust building and booking conversion.

---

## Architecture & Data

Path:
/docs/architecture/

Includes:

• Data schema  
• Service model  
• Discovery and search logic  
• Ranking and filtering strategies

---

## UX Strategy

Path:
/docs/ux/

Includes documentation on:

• Trust signals
• Conversion optimization
• Hiring uncertainty reduction

---

# UI Philosophy

Prova should feel **editorial and premium**, not utilitarian.

Principles:

**Editorial over Utility**
Interface should resemble a high-end portfolio.

**Media First**
Audio and video showcase talent.

**Generous Space**
Whitespace emphasizes quality content.

**Trust Signals**
Ratings, verification, and response times are prominent.

---

# Implementation Guardrails

1. Always follow **8px spacing grid**.

2. Use **typography hierarchy before visual decoration**.

3. Build **modular components** that remain editorial.

4. Use **skeleton states for loading UI**.

5. Avoid heavy visual clutter.

---

# Repository Structure

prova/

.storybook/  
Storybook configuration files

docs/  
Documentation for design system, architecture, and UX

src/  
Frontend React component library

src/components/  
Component directories

src/tokens/  
Design tokens (CSS variables)

src/mocks/  
Mock data used by Storybook

server/  
Backend Express API

server/src/index.ts  
Server entry point

server/src/db.ts  
SQLite initialization

server/src/routes/  
API route handlers

server/src/middleware/  
Auth middleware

server/src/schemas/  
Zod validation schemas

server/prisma/schema.prisma  
Database schema

---

# Core Data Model Concepts

The platform collects structured data enabling future matching.

Important musician data includes:

• Instruments  
• Genres  
• Skills  
• Services  
• Experience  
• Location  
• Travel capability  
• Availability  
• Social proof  
• Portfolio media  

AI matching will be implemented later.

The priority is **data integrity first**.

---

# Service Model

Musicians define services they offer.

Examples:

• Wedding performance  
• Studio recording  
• Remote recording  
• Composition  
• Music lessons  
• Live events

Pricing models supported:

• Fixed price  
• Starting price  
• Custom quote

---

# Location Model

Services support different location requirements.

Possible types:

remote  
in_person  
both

Musicians can specify:

• Base location  
• Travel radius  
• Remote availability

This enables filtering and future matching logic.

---

# Booking Requests

Clients submit booking requests including:

• Selected service  
• Event date  
• Brief description  
• Location  
• Client contact info

Musicians may:

accept  
decline  
respond with details

---

# Development Workflow

Start frontend:

npm install
npm run storybook

Storybook runs on:
http://localhost:6006

Start backend:

cd server
npm install
npm run dev

Backend runs on:
http://localhost:5001

Seed database:

cd server
npm run seed

Seeds database with sample musicians.

---

# Component Conventions

• Named + default exports  
• CSS Modules (.module.css)  
• Barrel exports in src/index.js  
• Props spreading for HTML attributes

---

# Notes for AI Assistants

Important constraints:

1. No automated test suite exists.
Manual verification via Storybook.

2. Backend uses raw SQL queries.

3. Some UI pages include client-side filtering fallback.

4. Backend port: 5001  
Storybook port: 6006

---

# Immediate Build Priorities

Current engineering focus:

1. Harden booking flow
2. Expand service model
3. Improve musician profile richness
4. Support travel radius logic
5. Ensure listing → profile → booking flow works reliably

---

# Long-Term Vision

Prova becomes:

• The primary platform musicians use to find paid work
• A trusted professional network for music services
• A discovery platform for hiring musicians globally

Future features may include:

• AI-powered musician matching
• Reputation systems
• Availability calendars
• Escrow payments
• Smart booking workflows

---

# North Star Metric

Help buyers **trust, compare, and hire the right musician quickly** while helping musicians clearly package and present their craft.


# Architectural Constraints

Claude should NOT:

• replace Storybook with another system  
• migrate the backend to a new framework  
• replace SQLite without explicit instruction  
• introduce a monorepo toolchain  
• redesign the design system structure  

Focus on incremental improvements rather than architectural rewrites.