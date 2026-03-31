import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/ilovemusic/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Failed to process password reset');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process password reset');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="pointer-events-none absolute left-1/3 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-md rounded-2xl p-8 text-center"
        >
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a password reset link to your email. Click the link to reset your password.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              Try Another Email
            </button>
            <Link
              to="/login"
              className="block w-full px-4 py-2 text-sm rounded-lg gradient-bg text-white hover:opacity-90 transition-opacity"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md rounded-2xl p-8"
      >
        <div className="mb-8">
          <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          <h1 className="font-display text-2xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="you@email.com" 
                className="border-border/50 bg-secondary/50 pl-10 focus:border-primary" 
                {...register('email')} 
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="gradient-bg w-full border-0" 
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;

