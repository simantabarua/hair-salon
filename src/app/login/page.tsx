'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, LogIn, Shield, UserCog, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import AureliaLogo from '@/components/ui/AureliaLogo';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const isAdmin = session.user.role === 'admin';
      const user = {
        email: session.user.email,
        name: session.user.name,
        isAdmin,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem('salon_user', JSON.stringify(user));
      window.dispatchEvent(new Event('storage'));
      if (isAdmin) {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    }
  }, [status, session, router]);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const toastId = toast.loading('Signing you in...');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error(res.error || 'Invalid credentials.', { id: toastId });
        setErrors({ email: 'Invalid email or password.' });
        setIsLoading(false);
      } else {
        toast.success('Welcome back! 🌟', { id: toastId, duration: 4000 });
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.', { id: toastId });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }
    toast.success(`Password reset link sent to ${email}.`, {
      description: 'Check your inbox and follow the instructions.',
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/img/Icons/Page-heading.svg')] opacity-[0.03] bg-cover bg-center" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-cormorant tracking-widest text-white hover:text-primary transition-colors">
            <AureliaLogo size={32} className="text-primary" />
            <span>Aurelia <span className="text-primary font-semibold">Salon</span></span>
          </Link>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="font-manrope text-sm text-white/50 tracking-widest uppercase">Premium Beauty & Style</p>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-secondary/20 border border-primary/15 rounded-2xl p-7 md:p-9 backdrop-blur-xl shadow-2xl space-y-6">

          <div className="space-y-1">
            <h1 className="font-cormorant text-3xl font-bold text-white">Welcome Back</h1>
            <p className="font-manrope text-sm text-white/50">Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5 font-manrope">

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="login-email" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`h-12 pl-10 bg-secondary/30 border rounded-xl text-sm focus:border-primary transition-colors ${errors.email ? 'border-red-500/70' : 'border-primary/15'}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-primary/80 hover:text-primary underline underline-offset-2 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`h-12 pl-10 pr-11 bg-secondary/30 border rounded-xl text-sm focus:border-primary transition-colors ${errors.password ? 'border-red-500/70' : 'border-primary/15'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs font-medium">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                id="remember-me"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe((v) => !v)}
                className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                  rememberMe ? 'bg-primary border-primary' : 'bg-transparent border-white/30 hover:border-primary/60'
                }`}
              >
                {rememberMe && (
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <label
                htmlFor="remember-me"
                onClick={() => setRememberMe((v) => !v)}
                className="text-xs text-white/60 cursor-pointer hover:text-white transition-colors select-none"
              >
                Remember me on this device
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-secondary font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </Button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs font-manrope tracking-wider">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-manrope font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Register CTA */}
          <p className="text-center font-manrope text-sm text-white/50">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-primary font-semibold hover:text-white transition-colors inline-flex items-center gap-1 group"
            >
              Create one now
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="pt-2 border-t border-white/5 space-y-3 font-manrope">
            <p className="text-center text-[10px] text-white/40 font-bold tracking-widest uppercase">Demo Credentials</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Admin', email: 'admin@aurelia.com', password: 'Admin@123', icon: Shield, color: 'text-amber-400 border-amber-400/30 hover:bg-amber-400/10' },
                { label: 'Staff', email: 'staff@aurelia.com', password: 'Staff@123', icon: UserCog, color: 'text-sky-400 border-sky-400/30 hover:bg-sky-400/10' },
                { label: 'Customer', email: 'customer@aurelia.com', password: 'Customer@123', icon: User, color: 'text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10' },
              ].map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword(demo.password);
                    setErrors({});
                    toast.info(`${demo.label} credentials filled.`);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-transparent transition-all ${demo.color}`}
                >
                  <demo.icon className="w-4 h-4" />
                  <span className="text-[11px] font-semibold">{demo.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer note */}
        <p className="text-center font-manrope text-xs text-white/25">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2 hover:text-white/50 transition-colors">
            Terms & Conditions
          </Link>
        </p>
      </div>
    </div>
  );
}
