# Blog Application

A full-stack blog application built with Spring Boot, React, Tailwind CSS, and MySQL. This application allows users to create, read, update, and delete blog posts with user authentication and social features like comments and likes.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login system with password hashing
- **Blog Management**: Create, read, update, and delete blog posts
- **User Profiles**: User information with avatars and profile details
- **Social Features**: Like posts and add comments
- **Responsive Design**: Modern UI built with Tailwind CSS

### Technical Features
- **RESTful API**: Complete REST API with proper HTTP methods
- **Database Integration**: MySQL database with JPA/Hibernate ORM
- **Security**: Password encryption using Spring Security Crypto
- **Modern Frontend**: React with Vite for fast development
- **Real-time Updates**: Dynamic content loading and updates

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.5.3**: Main framework
- **Spring Data JPA**: Database operations
- **Spring Security Crypto**: Password encryption
- **MySQL**: Database
- **Lombok**: Reduces boilerplate code
- **Maven**: Build tool
- **Java 21**: Programming language

### Frontend
- **React 19.1.0**: UI framework
- **React Router DOM**: Client-side routing
- **Tailwind CSS 4.1.11**: Utility-first CSS framework
- **Vite**: Build tool and development server
- **ESLint**: Code linting

## 📁 Project Structure

```
BlogApp/
├── BlogApplication/          # Spring Boot Backend
│   ├── src/main/java/com/blogpost/app/
│   │   ├── api/             # REST Controllers
│   │   ├── entity/          # JPA Entities
│   │   ├── pojo/            # Data Transfer Objects
│   │   ├── repository/      # Data Access Layer
│   │   ├── service/         # Business Logic
│   │   └── utils/           # Utility Classes
│   └── src/main/resources/
│       └── application.properties
└── BlogApplication-UI/       # React Frontend
    ├── src/
    │   ├── api/             # API Integration
    │   ├── components/      # Reusable Components
    │   ├── pages/           # Page Components
    │   └── assets/          # Static Assets
    └── package.json
```

## 🗄️ Database Schema

### Entities
- **User**: User accounts with authentication
- **Post**: Blog posts with content and metadata
- **Comment**: User comments on posts
- **Like**: User likes on posts

### Relationships
- User → Posts (One-to-Many)
- User → Comments (One-to-Many)
- User → Likes (One-to-Many)
- Post → Comments (Many-to-Many)
- Post → Likes (Many-to-Many)

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
   The backend will start on `http://localhost:8080`

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
- `GET /api/Posts` - Get all posts
- `GET /api/Posts/{id}` - Get post by ID
- `GET /api/Posts/user/{id}` - Get posts by user ID
- `POST /api/Posts/create` - Create new post
- `PUT /api/Posts/{id}` - Update post
- `DELETE /api/Posts/{id}` - Delete post

## 🎨 Frontend Pages

- **Home** (`/`): Display all blog posts
- **Login** (`/login`): User authentication
- **Register** (`/register`): User registration
- **Create Blog** (`/create`): Create new blog post
- **Blog Detail** (`/blog/:id`): View individual blog post

## 🔧 Configuration

### Backend Configuration
The application uses the following default configuration:
- **Server Port**: 8080
- **Context Path**: `/api`
- **Database**: MySQL on localhost:3306
- **JPA**: Auto-update schema

### Frontend Configuration
- **Development Server**: 5173
- **API Proxy**: Configured to proxy `/api` requests to backend
- **Build Tool**: Vite with React plugin

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

Created with ❤️ using Spring Boot and React.

## 🐛 Known Issues

- Currently no image upload functionality for blog posts
- No email verification for user registration
- No password reset functionality
- In dev progress

## 🔮 Future Enhancements

- [ ] Image upload for blog posts
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile editing
- [ ] Search functionality
- [ ] Categories and tags for posts
- [ ] Rich text editor for blog content
- [ ] Social media sharing
- [ ] Admin panel
- [ ] API documentation with Swagger 