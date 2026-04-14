# Current Project Status Report
**Project:** StudyGroup Finder
**Date:** 14 April 2026

## 1. Executive Summary
The project is currently in the active development phase. Both the frontend and backend foundational architectures have been laid out. The core database schema has been conceptualized, and the frontend user interface has established a strong aesthetic baseline corresponding to a university motif.

## 2. Completed Work

### 2.1 Frontend
*   Initialized React JS application structured with Tailwind CSS.
*   Created core components (`Navbar`, `BrowseGroups`, `CreateGroup`, `GroupCard`).
*   Established a global layout and navigation state.
*   Designed a responsive grid for displaying study groups.
*   Mock data integration is completed to visualize the UI state.

### 2.2 Backend
*   Express server (`server.js`) successfully configured with error handling and modular routing.
*   Database connection initialization configured for MySQL using Sequelize.
*   Core database SQL schemas formulated (`Database.sql` details `users`, `groups`, `sessions`, `group_members`).
*   Controller files (`authController.js`, `groupController.js`, etc.) and corresponding routing files generated.

## 3. Current Issues & Technical Debt

*   **Database Duplication/Ambiguity:** The backend `package.json` contains dependencies for both MongoDB (`mongoose`) and MySQL (`mysql2`, `sequelize`). There are Mongoose models (e.g., `backend/models/User.js`) co-existing with Sequelize setup and `Database.sql`. The team needs to definitively standardize on one ORM/Database to prevent architectural conflicts.
*   **Frontend Routing:** Currently, routing is handled via a naive React hook (`useState('browse')`) in `App.js`. While `react-router-dom` is installed, it has not been implemented.
*   **API Integration:** The frontend is currently displaying hard-coded mock data. Axios is installed but API integration connecting the frontend to the Express backend needs implementation.

## 4. Pending Tasks & Next Steps

1.  **Resolve Database Ambiguity:** Finalize the removal of Mongoose schemas if MySQL/Sequelize is the chosen path (as indicated by the active `Database.sql`).
2.  **Implement React Router:** Refactor `App.js` to use `BrowserRouter`, `Routes`, and `Route` from `react-router-dom`.
3.  **Connect Client to Server:** Replace the mock array `ucuGroups` in `BrowseGroups.jsx` with an Axios `useEffect` fetch call to `http://localhost:5000/api/groups`.
4.  **Complete Authentication Flow:** Wire up the frontend login/registration screens to the backend JWT authentication endpoints.
