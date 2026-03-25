# Musician Listing Page (PLP) Template

## 1. Goal & UX Strategy
The PLP is the primary discovery engine. Its goal is to allow buyers to **quickly scan, compare, and filter** musicians to find the perfect match for their project.

**Key UX Priorities:**
* **Instant Comparison:** Uniform card layout for easy side-by-side evaluation.
* **Low Friction Filtering:** Fast, reactive filters that refine results without page reloads.
* **Social Proof First:** Highlighting ratings and "completed jobs" prominently.

---

## 2. Page Structure

### A. Header & Search Area
* **Search Input:** High-visibility bar with autocomplete for instruments/genres.
* **Active Filters Row:** Horizontal chips showing currently applied filters with "Clear All".
* **Result Count:** Dynamic text (e.g., "142 Musicians found for 'Jazz Cellists'").

### B. Filter Sidebar / Drawer
* **Service Type:** (Session, Live, Lesson, etc.)
* **Primary Instrument:** Multi-select list.
* **Price Range:** Range slider with min/max inputs.
* **Rating:** Minimum star rating filter.
* **Location:** City or "Remote-friendly" toggle.
* **Availability:** Date picker for event-specific hiring.

### C. Results Grid
A responsive grid (1 col mobile, 3–4 cols desktop) of **Musician Cards**.

#### Musician Card UI Specification
Each card must include the following in order of visual hierarchy:
1.  **Immersive Media:** Hero image or audio waveform preview overlay.
2.  **Identity:** Name and Headline (e.g., "Sarah Jenkins | Cinematic Violinist").
3.  **Trust Signals:** Star rating + Review count (e.g., "5.0 (42)"), Completed jobs count, and Response time indicator.
4.  **Service Tags:** Top 3 services offered as subtle chips (e.g., "Remote Recording").
5.  **Verified Badges:** Display "Verified", "Top Pro", or "Fast Responder" where applicable.
6.  **Economic Entry:** "Starting at $150".
7.  **Primary CTA:** "View Profile" (Primary action) and a secondary "Save" icon.

**Interaction Rules:**
*   **Hover:** Card elevation (+4px) and subtle shadow intensification.
*   **Mobile:** Large tap targets and stacked metadata for readability.

---

## 4. Sorting Logic
Standard sorting options provided in a dropdown (aligned with [Discovery Specification](file:///Users/mehmetaydin/Desktop/musician-ds/docs/architecture/discovery-and-search.md)):
*   **Recommended:** Weighted balance score.
*   **Top Rated:** Descending star rating.
*   **Price:** Low to High / High to Low.
*   **Fastest Response:** Real-time availability.
