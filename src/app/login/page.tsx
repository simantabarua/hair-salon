'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('salon_user')) {
      router.replace('/');
    }
  }, [router]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    toast.info('Signing you in...');

    setTimeout(() => {
      const user = { email, name: email.split('@')[0], loginAt: new Date().toISOString() };
      localStorage.setItem('salon_user', JSON.stringify(user));
      if (rememberMe) {
        localStorage.setItem('salon_remember', 'true');
      }
      setIsLoading(false);
      toast.success(`Welcome back, ${user.name}! 🌟`, { duration: 4000 });
      router.push('/');
    }, 1800);
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
            Hair <span className="text-primary font-semibold">Salon</span>
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
                className={`w-4.5 h-4.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${
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
