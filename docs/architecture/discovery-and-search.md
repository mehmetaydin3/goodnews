# Discovery & Search Specification

This document defines the backend logic and architectural rules for how musicians are found and ranked within the marketplace.

## 1. Search Matching Logic
The search engine must parse and match queries against multiple data dimensions:
*   **Instruments & Genres:** Direct matches (e.g., "Violin", "Jazz").
*   **Service Types:** Matching against taxonomy (e.g., "Recording", "Lessons").
*   **Occasions:** Contextual mapping (e.g., "Wedding" -> `LIVE` service type).
*   **Location:** City names and "Remote" availability flags.

## 2. Ranking & Relevance Algorithm
The "Recommended" sort uses a weighted scoring system to balance performance with discovery.

| Factor | Weight | Description |
| :--- | :--- | :--- |
| **Search Relevance** | High | Keywords matching name, headline, and service titles. |
| **Service Match** | High | Exact alignment with requested service category. |
| **Rating Score** | Medium | Weighted average (favoring higher counts). |
| **Response Speed** | Medium | Bonus for creators with `< 2h` response times. |
| **Completion Rate** | Medium | Success rate of delivered vs. cancelled jobs. |
| **Media Richness** | Low | Presence of both audio and video samples. |
| **Recent Activity** | Low | Profile update frequency and recent logins. |

## 3. Filtering Strategy
Filters are combinable and reactive.
*   **Primary Filters:** Service Type, Instrument, Genre, Price.
*   **Logistical Filters:** Location, Delivery Mode (`REMOTE`/`LIVE`), Availability.
*   **Trust Filters:** Minimum Rating, Experience Level (Verified/Top Pro).

## 4. Sorting Options
*   **Recommended:** The Default weighted algorithm.
*   **Top Rated:** Descending star rating (Minimum 5 reviews).
*   **Most Reviewed:** Volume of social proof.
*   **Price:** Economic ranking (Low to High / High to Low).
*   **Fastest Response:** Prioritizing availability.
