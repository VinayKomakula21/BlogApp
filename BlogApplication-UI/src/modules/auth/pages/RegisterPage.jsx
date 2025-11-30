import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store";
import { useUIStore } from "@/modules/app/store/ui-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { toast } from "sonner";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp, error, setError } = useAuthStore();
  const { theme } = useUIStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      userName: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await signUp(data);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
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
          <CardTitle className="text-2xl tracking-tight">Create Account</CardTitle>
          <CardDescription>Join our blogging community</CardDescription>
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
                placeholder="Choose a username"
                className="h-11"
              />
              {errors.userName && (
                <p className="text-destructive text-xs">{errors.userName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  {...register("firstName", { required: "First name is required" })}
                  placeholder="First name"
                  className="h-11"
                />
                {errors.firstName && (
                  <p className="text-destructive text-xs">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  {...register("lastName", { required: "Last name is required" })}
                  placeholder="Last name"
                  className="h-11"
                />
                {errors.lastName && (
                  <p className="text-destructive text-xs">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                placeholder="Create a password"
                className="h-11"
              />
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
