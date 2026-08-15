import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Presentation, GraduationCap, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "admin" | "teacher">("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bypass authentication for admin and teacher demo
    if (role === "admin") {
      navigate("/admin");
      return;
    }
    
    if (role === "teacher") {
      navigate("/teacher");
      return;
    }

    setIsSubmitting(true);

    const result = await login(email, password);

    setIsSubmitting(false);

    if (result.success) {
      if (role === "student") {
        navigate("/dashboard");
      }
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      {/* Dark mode toggle */}
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <Button variant="outline" size="icon" onClick={toggleDark} aria-label="Toggle dark mode">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden border border-border bg-card">
            <img src="/logo.png" alt="StudentHub Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {role.charAt(0).toUpperCase() + role.slice(1)} Portal
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your {role} dashboard
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          <Button
            variant={role === "admin" ? "default" : "outline"}
            className="flex flex-col items-center gap-2 h-auto py-3"
            onClick={() => setRole("admin")}
          >
            <ShieldAlert className="h-5 w-5" />
            <span className="text-xs">Admin</span>
          </Button>
          <Button
            variant={role === "student" ? "default" : "outline"}
            className="flex flex-col items-center gap-2 h-auto py-3"
            onClick={() => setRole("student")}
          >
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs">Student</span>
          </Button>
          <Button
            variant={role === "teacher" ? "default" : "outline"}
            className="flex flex-col items-center gap-2 h-auto py-3"
            onClick={() => setRole("teacher")}
          >
            <Presentation className="h-5 w-5" />
            <span className="text-xs">Teacher</span>
          </Button>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Secure Sign In
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={role === "student"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={role === "student"}
                    minLength={role === "student" ? 6 : 0}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {role === "student" 
                  ? (isSubmitting ? "Please wait..." : "Sign In") 
                  : `Enter ${role.charAt(0).toUpperCase() + role.slice(1)} Portal`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
