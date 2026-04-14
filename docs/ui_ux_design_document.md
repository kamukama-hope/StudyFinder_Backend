# UI/UX Design Document
**Project:** StudyGroup Finder
**Date:** 14 April 2026

## 1. Design Vision
The application is designed to be academic, trustworthy, and intuitive. It mirrors institutional branding (Uganda Christian University - UCU) to create a familiar and professional environment for students seeking academic excellence.

## 2. Target Audience
*   Undergraduate and Postgraduate University students in Computing disciplines.
*   Course coordinators or administrators facilitating study circles.

## 3. Brand Identity & Color Palette
The interface utilizes a distinct institutional theme:
*   **Primary Brand Color:** Dark Navy Blue (`#002147`) - Used for Navbar, active buttons, and primary headings. Conveys academic rigor and reliability.
*   **Accent Color:** Gold (`#D4AF37`) - Used for badges, highlights, hovers, and borders. Represents excellence and achievement.
*   **Background:** Off-White/Gray (`bg-gray-50`, `bg-white`) - Ensures high readability and a clean structure.

## 4. Typography
*   Clean sans-serif fonts (Tailwind default family).
*   Bold headers (`font-bold`, `text-3xl`) for page titles to ensure logical hierarchy.
*   Readable body text (`text-gray-600`) to limit visual fatigue.

## 5. Core Interface Components
*   **Top Navigation Bar:** Sticky top navigation containing the logo, and primary action buttons (Browse, Create, My Dashboard). Includes visual hover transitions switching from White to Gold.
*   **Search/Filter Bar:** A prominent search input on the "Browse Groups" page enabling students to filter by course code or topic rapidly.
*   **Study Group Cards:** Modular containers that display essential group details (Course name, course code, members count, meeting location, and time) at a glance.

## 6. User Experience Workflows
1.  **Discovery (Browse):** Users land immediately on the "Browse Groups" page. Groups are displayed in a clean, responsive CSS Grid.
2.  **Creation:** A direct path to create a new group. Prioritizes required academic fields (Faculty, Course Code).
3.  **Dashboard:** A personalized area for students to review their saved, joined, or created groups.

## 7. Responsive Design
*   Mobile-first responsive methodology using Tailwind utilities.
*   Grid layouts transition from a single column on mobile devices to a 3-column layout (`md:grid-cols-3`) on standard desktop monitors.
