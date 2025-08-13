# BlogSphere - Full-Stack Blog Application

A modern, full-stack blog application built with Spring Boot, React, and Tailwind CSS. This application provides a complete blogging platform with user authentication, blog management, social features like comments and likes, and a responsive modern UI.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login system with password hashing
- **Blog Management**: Create, read, update, and delete blog posts
- **User Profiles**: User information with avatars and profile details
- **Social Features**: Like/unlike posts and add/delete comments
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Interactions**: Dynamic like/unlike and comment functionality

### Technical Features
- **RESTful API**: Complete REST API with proper HTTP methods and validation
- **Database Integration**: MySQL database with JPA/Hibernate ORM
- **Security**: Password encryption using Spring Security Crypto
- **Modern Frontend**: React 19 with Vite for fast development
- **State Management**: Local state management with React hooks
- **API Integration**: Comprehensive API layer for all backend operations

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.5.3**: Main framework with Spring Boot Starter
- **Spring Data JPA**: Database operations and ORM
- **Spring Security Crypto**: Password encryption and security
- **Spring Validation**: Input validation and data integrity
- **MySQL**: Database with MySQL 8 dialect
- **Lombok**: Reduces boilerplate code
- **Maven**: Build tool and dependency management
- **Java 21**: Programming language

### Frontend
- **React 19.1.0**: Latest React version with modern features
- **React Router DOM 7.7.1**: Client-side routing
- **Tailwind CSS 4.1.11**: Latest utility-first CSS framework
- **Vite 7.0.4**: Modern build tool and development server
- **ESLint 9.30.1**: Code linting and quality

## 📁 Project Structure

```
BlogApp/
├── BlogApplication/          # Spring Boot Backend
│   ├── src/main/java/com/blogpost/app/
│   │   ├── api/             # REST Controllers (UserApi, PostApi, CommentApi, LikeApi)
│   │   ├── entity/          # JPA Entities (User, Post, Comment, Like)
│   │   ├── pojo/            # Data Transfer Objects (Auth, Login, Register)
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── repository/      # Data Access Layer
│   │   ├── service/         # Business Logic Layer
│   │   └── utils/           # Utility Classes (PasswordHasher)
│   └── src/main/resources/
│       └── application.properties
└── BlogApplication-UI/       # React Frontend
    ├── src/
    │   ├── api/             # API Integration (postsApi, usersApi, likesApi, commentsApi)
    │   ├── components/      # Reusable Components (Blogcard, Comments, Likes, Layout, Navbar)
    │   ├── pages/           # Page Components (Home, BlogDetail, CreateBlog, Login, Register)
    │   └── assets/          # Static Assets
    └── package.json
```

## 🗄️ Database Schema

### Entities
- **User**: User accounts with authentication (id, userName, password, firstName, lastName, avatarUrl, timestamps)
- **Post**: Blog posts with content and metadata (id, postTitle, postContent, image, user, timestamps)
- **Comment**: User comments on posts (id, content, user, post, createdAt)
- **Like**: User likes on posts (id, user, post, createdAt with unique constraint)

### Relationships
- User → Posts (One-to-Many)
- User → Comments (One-to-Many)
- User → Likes (One-to-Many)
- Post → Comments (One-to-Many)
- Post → Likes (One-to-Many)

## 🚀 Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BlogApp/BlogApplication
   ```

2. **Configure Database**
   - Create a MySQL database named `blog`
   - Update `src/main/resources/application.properties` with your database credentials:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the Spring Boot Application**
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080` with context path `/api`

### Frontend Setup

1. **Navigate to the UI directory**
   ```bash
   cd BlogApplication-UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/Auth/SignUp` - User registration
- `POST /api/Auth/login` - User login

### Posts
- `GET /api/Posts` - Get all posts (with optional username context)
- `GET /api/Posts/{id}` - Get post by ID (with optional username context)
- `GET /api/Posts/user/{id}` - Get posts by user ID (with optional username context)
- `POST /api/Posts/create` - Create new post
- `PUT /api/Posts/{id}` - Update post (with optional username context)
- `DELETE /api/Posts/{id}` - Delete post

### Likes
- `POST /api/Posts/{postId}/like` - Toggle like/unlike on a post
- `GET /api/Posts/{postId}/likes` - Get likes for a post
- `POST /api/Likes/post/{postId}/toggle` - Alternative like toggle endpoint
- `GET /api/Likes/post/{postId}` - Alternative likes retrieval endpoint

### Comments
- `POST /api/Posts/{postId}/comments` - Add comment to a post
- `GET /api/Posts/{postId}/comments` - Get comments for a post
- `POST /api/Comments/post/{postId}` - Alternative comment creation endpoint
- `GET /api/Comments/post/{postId}` - Alternative comment retrieval endpoint
- `DELETE /api/Comments/{commentId}` - Delete comment (requires username parameter)

## 🎨 Frontend Pages & Components

### Pages
- **Home** (`/`): Display all blog posts with modern card layout
- **Login** (`/login`): User authentication with form validation
- **Register** (`/register`): User registration with comprehensive form
- **Create Blog** (`/create`): Create new blog post with image upload support
- **Blog Detail** (`/blog/:id`): View individual blog post with comments and likes

### Components
- **Blogcard**: Modern card component for displaying blog post previews
- **Comments**: Interactive comment system with add/delete functionality
- **Likes**: Like/unlike functionality with real-time updates
- **Layout**: Main layout wrapper with navigation
- **Navbar**: Responsive navigation with user authentication status

## 🔧 Configuration

### Backend Configuration
The application uses the following configuration:
- **Server Port**: 8080
- **Context Path**: `/api`
- **Database**: MySQL on localhost:3306 with database name `blog`
- **JPA**: Auto-update schema with MySQL 8 dialect
- **Password**: Default password set to "Password" (change in production)

### Frontend Configuration
- **Development Server**: 5173
- **API Base URL**: `/api` (proxied to backend)
- **Build Tool**: Vite with React plugin
- **CSS Framework**: Tailwind CSS 4.1.11

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   mvn clean package
   ```
2. Run the JAR:
   ```bash
   java -jar target/app-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. Build for production:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder with your preferred web server

## 🔐 Security Features

- **Password Hashing**: Secure password storage using Spring Security Crypto
- **Input Validation**: Comprehensive validation using Spring Validation
- **SQL Injection Protection**: JPA/Hibernate ORM with parameterized queries
- **Authentication**: Session-based authentication with localStorage


## 👨‍💻 Author

Created with ❤️ using Spring Boot and React.
