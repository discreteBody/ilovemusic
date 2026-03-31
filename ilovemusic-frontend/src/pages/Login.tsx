import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const setToken = useAuthStore((s) => s.setToken);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/ilovemusic/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Store the token from response
      if (result.data?.token) {
        setToken(result.data.token);
      }

      // Login the user
      login({ id: '1', name: result.data?.username || data.email, email: result.data?.email || data.email }, result.data?.token);
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/ilovemusic/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Google login failed');
        setIsLoading(false);
        return;
      }

      // Store the token from response
      if (result.data?.token) {
        setToken(result.data.token);
      }

      // Login the user
      login({ id: '1', name: result.data?.username, email: result.data?.email }, result.data?.token);
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md rounded-2xl p-8"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="mb-6 inline-flex items-center gap-2">
            <div className="gradient-bg flex h-8 w-8 items-center justify-center rounded-lg">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">ilovemusic</span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-xs text-muted-foreground">or continue with email</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@email.com" className="border-border/50 bg-secondary/50 pl-10 focus:border-primary" {...register('email')} />
            </div>
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password" className="text-sm">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="border-border/50 bg-secondary/50 pl-10 pr-10 focus:border-primary" {...register('password')} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="gradient-bg gradient-bg-hover w-full border-0" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
