import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Layout
import { Layout, ProtectedRoute } from "@/components/layout";

// Auth Module
import { useAuthStore } from "@/modules/auth";
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from "@/modules/auth/pages";

// Posts Module
import { HomePage, BlogDetailPage, CreatePostPage, EditPostPage } from "@/modules/posts/pages";

// Users Module
import { ProfilePage, UserProfilePage } from "@/modules/users/pages";

const App = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="blog/:id" element={<BlogDetailPage />} />
          <Route path="user/:id" element={<UserProfilePage />} />

          {/* Protected Routes */}
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
