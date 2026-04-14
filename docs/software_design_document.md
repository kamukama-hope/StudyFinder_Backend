# Software Design Document (SDD)
**Project:** StudyGroup Finder
**Date:** 14 April 2026

## 1. Introduction
The StudyGroup Finder is a web application explicitly tailored for computing students (e.g., UCU) to discover, join, and manage academic study groups efficiently. 

## 2. System Architecture
This project follows a full-stack architecture consisting of a frontend, backend, and MySQL database working together in a decoupled system.

*   **Frontend (Client-Side):** Responsible for the user interface. It interacts only with the backend through API requests, without direct access to the database. Built using React.js and Tailwind CSS.
*   **Backend (Server-Side):** Acts as the middle layer, handling business logic, processing requests, and communicating with the MySQL database. Built with Node.js and Express.js.
*   **Database:** Serves as the central data store, maintaining structured information such as users, groups, and relationships, ensuring consistency and integrity. Powered by MySQL and managed via Sequelize ORM.

## 3. Frontend Architecture
*   **Framework:** React 18
*   **Styling:** Tailwind CSS with a customized color palette (`#002147` Dark Blue, `#D4AF37` Gold).
*   **Icons:** Lucide React
*   **State Management:** Local React state (`useState`, `useEffect`). Page routing is currently managed via a state variable (`view` in `App.js`), though `react-router-dom` is installed and planned for formal routing.
*   **HTTP Client:** Axios for interacting with the backend REST APIs.

## 4. Backend Architecture
*   **Runtime Framework:** Node.js with Express.js
*   **Authentication:** JWT (JSON Web Tokens) and bcryptjs for secure password hashing.
*   **Routing:** Modular routing (`authRoutes.js`, `groupRoutes.js`, `sessionRoutes.js`, `adminRoutes.js`).
*   **Controllers:** Separate business logic controllers (e.g., `groupController.js`).
*   **Environment Configuration:** `dotenv` for managing sensitive environment variables.
*   **Error Handling:** Global error handling middleware.

## 5. Database Schema (MySQL)
The canonical database is `groupdb`. Key tables include:
*   `users`: Stores user credentials (`email`, `password` hashed), name, and role (`user`, `admin`).
*   `groups`: Stores study group details (`groupName`, `courseCode`, `faculty`, `leaderId`).
*   `sessions`: Stores information about specific study sessions linked to a group.
*   `group_members`: A joining table linking `users` to `groups`.

## 6. API Endpoints (Overview)
*   `/api/auth`: Registration, Login, and secure session management.
*   `/api/groups`: CRUD operations for study groups.
*   `/api/sessions`: Manage group meeting schedules.
*   `/api/admin`: Administrative override and management functions.
