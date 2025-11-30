import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store";
import { useUIStore } from "@/modules/app/store/ui-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, error, setError } = useAuthStore();
  const { theme } = useUIStore();
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await signIn(data);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={4}
          gridGap={6}
          color={theme === 'dark' ? 'rgb(148, 163, 184)' : 'rgb(107, 114, 128)'}
          maxOpacity={0.2}
          flickerChance={0.1}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-border/40 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <Link to="/" className="text-2xl font-bold tracking-tighter block mb-2">
            BlogSphere
          </Link>
          <CardTitle className="text-2xl tracking-tight">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                {...register("userName", { required: "Username is required" })}
                placeholder="Enter your username"
                className="h-11"
              />
              {errors.userName && (
                <p className="text-destructive text-xs">{errors.userName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Enter your password"
                className="h-11"
              />
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
