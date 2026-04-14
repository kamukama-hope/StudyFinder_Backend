# System Architecture and Entity Relationship Diagrams

## 1. System Architecture Diagram

This diagram shows the overall structure of the WebCourseWork application, including frontend, backend, database, and their interactions.

```mermaid
graph TB
    subgraph Client["Client Layer - Frontend React App"]
        Router["React Router"]
        Pages["Pages<br/>- LoginPage<br/>- SignUpPage<br/>- DashboardPage<br/>- GroupsPage"]
        Components["Components<br/>- Navbar<br/>- Header<br/>- Login<br/>- SignUp<br/>- BrowseGroups<br/>- CreateGroup<br/>- GroupCard<br/>- StudyGroupCard<br/>- SearchBar"]
        API["API Service<br/>axios/fetch"]
    end

    subgraph Backend["Backend Layer - Node.js/Express"]
        AppServer["Express Server<br/>Port 5000"]
        
        subgraph Routes["API Routes"]
            AuthR["AuthRoutes<br/>/api/auth"]
            GroupR["GroupRoutes<br/>/api/groups"]
            SessionR["SessionRoutes<br/>/api/sessions"]
            AdminR["AdminRoutes<br/>/api/admin"]
        end
        
        subgraph Controllers["Controllers"]
            AuthC["authController"]
            GroupC["groupController"]
            PostC["postController"]
            SessionC["sessionController"]
            AdminC["adminController"]
        end
        
        Middleware["Middleware<br/>CORS | Express JSON<br/>Authentication<br/>Error Handling"]
    end

    subgraph Database["Data Layer - MySQL/Sequelize"]
        DB["MySQL Database"]
        
        subgraph Models["Data Models"]
            UserM["User<br/>id, name, email<br/>password, role"]
            GroupM["Group<br/>id, groupName<br/>courseName, courseCode<br/>faculty, description<br/>leaderId, isActive"]
            MemberM["GroupMember<br/>id, groupId, userId<br/>joinedAt"]
            PostM["Post<br/>id, groupId<br/>authorId, content"]
            CommentM["Comment<br/>id, postId<br/>authorId, content"]
            SessionM["StudySession<br/>id, groupId<br/>sessionDate, topic<br/>location"]
        end
    end

    Router --> Pages
    Router --> Components
    Components --> API
    Pages --> API
    API -->|HTTP/REST| AppServer
    
    AppServer --> Middleware
    Middleware --> AuthR
    Middleware --> GroupR
    Middleware --> SessionR
    Middleware --> AdminR
    
    AuthR --> AuthC
    GroupR --> GroupC
    SessionR --> SessionC
    AdminR --> AdminC
    GroupR --> PostC
    
    AuthC --> DB
    GroupC --> DB
    PostC --> DB
    SessionC --> DB
    AdminC --> DB
    
    DB --> UserM
    DB --> GroupM
    DB --> MemberM
    DB --> PostM
    DB --> CommentM
    DB --> SessionM
```

---

## 2. Entity Relationship Diagram (ERD)

This diagram illustrates the relationships between database entities and their attributes.

```mermaid
erDiagram
    USER ||--o{ GROUP : leads
    USER ||--o{ GROUP_MEMBER : joins
    USER ||--o{ POST : authors
    USER ||--o{ COMMENT : writes
    USER ||--o{ STUDY_SESSION : attends
    GROUP ||--o{ GROUP_MEMBER : contains
    GROUP ||--o{ POST : has
    GROUP ||--o{ STUDY_SESSION : schedules
    POST ||--o{ COMMENT : receives

    USER {
        int id PK
        string name
        string email UK
        string password
        enum role "user|admin"
        timestamp createdAt
        timestamp updatedAt
    }

    GROUP {
        int id PK
        string groupName UK
        string courseName
        string courseCode
        string faculty
        string description
        string meetingLocation
        enum meetingType "physical|online|hybrid"
        int leaderId FK
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }

    GROUP_MEMBER {
        int id PK
        int groupId FK
        int userId FK
        timestamp joinedAt
    }

    POST {
        int id PK
        int groupId FK
        int authorId FK
        text content
        timestamp createdAt
        timestamp updatedAt
    }

    COMMENT {
        int id PK
        int postId FK
        int authorId FK
        text content
        timestamp createdAt
        timestamp updatedAt
    }

    STUDY_SESSION {
        int id PK
        int groupId FK
        date sessionDate
        string topic
        string location
        timestamp createdAt
        timestamp updatedAt
    }
```

---

## 3. Data Flow Diagram

This diagram shows how data flows through the application from user interactions to database storage and retrieval.

```mermaid
graph LR
    User["👤 User/Client"]
    Browser["🌐 Browser<br/>React Application"]
    Frontend["Components &<br/>State Management"]
    APICall["HTTP<br/>Requests"]
    Server["🖥️ Express Server"]
    Routes["Route Handlers"]
    Controllers["Business Logic<br/>Controllers"]
    Models["Sequelize<br/>ORM Models"]
    DB["💾 MySQL<br/>Database"]

    User -->|Interacts| Browser
    Browser -->|Renders| Frontend
    Frontend -->|Makes| APICall
    APICall -->|Routes to| Server
    Server -->|Matches| Routes
    Routes -->|Calls| Controllers
    Controllers -->|Uses| Models
    Models -->|Query/Persist| DB
    DB -->|Returns/Saves| Models
    Models -->|Transforms| Controllers
    Controllers -->|Returns JSON| APICall
    APICall -->|Updates| Frontend
    Frontend -->|Re-renders| Browser
    Browser -->|Displays| User
```

---

## 4. API Endpoint Structure

### Authentication Routes (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - Authenticate user
- `POST /logout` - End user session

### Group Routes (`/api/groups`)
- `GET /` - Get all groups
- `GET /:id` - Get specific group details
- `POST /` - Create new group
- `PUT /:id` - Update group
- `DELETE /:id` - Delete group
- `GET /:id/members` - Get group members
- `POST /:id/join` - Join a group
- `POST /:id/leave` - Leave a group

### Post Routes (`/api/groups/:groupId/posts`)
- `GET /` - Get all posts in a group
- `POST /` - Create new post
- `PUT /:id` - Update post
- `DELETE /:id` - Delete post

### Comment Routes (`/api/posts/:postId/comments`)
- `GET /` - Get all comments on a post
- `POST /` - Add new comment
- `DELETE /:id` - Delete comment

### Session Routes (`/api/sessions`)
- `GET /` - Get all study sessions
- `GET /:id` - Get specific session
- `POST /` - Create new session
- `PUT /:id` - Update session
- `DELETE /:id` - Delete session

### Admin Routes (`/api/admin`)
- `GET /users` - List all users
- `GET /groups` - List all groups
- `DELETE /users/:id` - Remove user
- `DELETE /groups/:id` - Remove group

---

## 5. Key Features & Components

### Frontend Features
- **Authentication**: Login and Sign Up pages
- **Discovery**: Browse and search study groups
- **Group Management**: Create, join, and view groups
- **Collaboration**: Post content and comment within groups
- **Session Scheduling**: Schedule and manage study sessions
- **Responsive Design**: Tailwind CSS for mobile-friendly UI

### Backend Features
- **User Management**: Registration, authentication, profiles
- **Group Management**: CRUD operations for study groups
- **Post & Comment System**: Discussion boards within groups
- **Session Management**: Schedule and track study sessions
- **Admin Panel**: User and group administration
- **Database ORM**: Sequelize for MySQL database management
- **Error Handling**: Centralized error handling middleware
- **CORS**: Cross-origin resource sharing enabled

