# Product Requirement Document (PRD)
**Project:** StudyGroup Finder
**Date:** 14 April 2026

## 1. Objective
To build a centralized, web-based platform where university students can form, discover, and manage academic study groups tailored to their specific courses and faculties.

## 2. Problem Statement
Students often struggle to find peers studying the same modules. Communication across different messaging platforms is fragmented, making it difficult to coordinate study sessions, find meeting locations, and track member participation. 

## 3. User Personas
*   **The Student (User):** Wants to easily find study groups for tough modules (e.g., Data Structures), join them, and see when and where they meet.
*   **The Group Leader:** A student who initiates a group, sets the agenda, manages timings, and moderates members.
*   **The Administrator:** Platform manager responsible for moderating content, ensuring academic integrity, and managing user access.

## 4. Functional Requirements

### 4.1 Authentication & Authorization
*   Users must be able to register using an email address and secure password.
*   System must authenticate users via JWT.
*   Role-Based Access Control distinguishing standard students from administrators.

### 4.2 Group Discovery & Management
*   **Create Group:** Users can create a group defining Name, Course Code, Faculty, Description, and Meeting details (Physical vs. Online).
*   **Browse/Search:** Users must be able to view all active groups and filter/search by Course Code or keyword.
*   **Join/Leave:** Users can request to join an open group natively.

### 4.3 Session Tracking
*   Groups must be able to schedule specific sessions (Date, Time, Topic, Location).

### 4.4 Dashboard
*   Users should have a personalized view of their active obligations (Groups joined, upcoming sessions).

## 5. Non-Functional Requirements
*   **Performance:** The platform must be fast, acting as a Single Page Application without reloading.
*   **Security:** Passwords must be hashed. SQL injection prevention via Sequelize ORM.
*   **Responsiveness:** Must work seamlessly on mobile phones, tablets, and desktop computers.

## 6. Future Enhancements (Post-V1)
*   In-app chat or messaging forums for groups.
*   Integration with University Calendars natively.
*   Notification system (email or push notifications) for upcoming study sessions.
