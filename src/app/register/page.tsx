'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import AureliaLogo from '@/components/ui/AureliaLogo';
import { apiClient } from '@/lib/apiClient';

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  if (!password) return null;

  const score = getStrength();
  const levels = [
    { label: 'Weak', color: 'bg-red-500' },
    { label: 'Fair', color: 'bg-orange-400' },
    { label: 'Good', color: 'bg-yellow-400' },
    { label: 'Strong', color: 'bg-green-500' },
  ];
  const level = levels[Math.min(score - 1, 3)] ?? levels[0];

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? level.color : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <p className="text-xs font-manrope text-white/40">
        Password strength: <span className={`font-semibold ${score >= 3 ? 'text-green-400' : score === 2 ? 'text-yellow-400' : 'text-red-400'}`}>{level.label}</span>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }
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
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'You must accept the Terms & Conditions to continue.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const toastId = toast.loading('Creating your account...');

    try {
      await apiClient.post('/api/v1/auth/register', {
        name: fullName,
        email,
        password,
      });

      toast.success('Account created successfully! Please sign in.', {
        id: toastId,
        description: 'Welcome to the Aurelia family. ✨',
        duration: 5000,
      });
      router.push('/login');
    } catch (err: any) {
      const message = err.message || 'Failed to create account.';
      toast.error(message, { id: toastId });
      setErrors((prev) => ({ ...prev, email: message }));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            <p className="font-manrope text-sm text-white/50 tracking-widest uppercase">Join Our Community</p>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-secondary/20 border border-primary/15 rounded-2xl p-7 md:p-9 backdrop-blur-xl shadow-2xl space-y-6">

          <div className="space-y-1">
            <h1 className="font-cormorant text-3xl font-bold text-white">Create Account</h1>
            <p className="font-manrope text-sm text-white/50">Join Aurelia and experience premium beauty.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5 font-manrope">

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="reg-name" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <Input
                  id="reg-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); clearError('fullName'); }}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className={`h-12 pl-10 bg-secondary/30 border rounded-xl text-sm focus:border-primary transition-colors ${errors.fullName ? 'border-red-500/70' : 'border-primary/15'}`}
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs font-medium">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="reg-email" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`h-12 pl-10 bg-secondary/30 border rounded-xl text-sm focus:border-primary transition-colors ${errors.email ? 'border-red-500/70' : 'border-primary/15'}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="reg-password" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
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
              <PasswordStrength password={password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="reg-confirm" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <Input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`h-12 pl-10 pr-11 bg-secondary/30 border rounded-xl text-sm focus:border-primary transition-colors ${
                    confirmPassword && confirmPassword === password
                      ? 'border-green-500/50'
                      : errors.confirmPassword
                      ? 'border-red-500/70'
                      : 'border-primary/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs font-medium">{errors.confirmPassword}</p>}
              {confirmPassword && confirmPassword === password && (
                <p className="text-green-400 text-xs font-medium">✓ Passwords match</p>
              )}
            </div>

            {/* T&C Checkbox */}
            <div className="space-y-1.5">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  id="agree-terms"
                  role="checkbox"
                  aria-checked={agreedToTerms}
                  onClick={() => { setAgreedToTerms((v) => !v); clearError('terms'); }}
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    agreedToTerms ? 'bg-primary border-primary' : 'bg-transparent border-white/30 hover:border-primary/60'
                  } ${errors.terms ? 'border-red-500/70' : ''}`}
                >
                  {agreedToTerms && (
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <label
                  htmlFor="agree-terms"
                  onClick={() => { setAgreedToTerms((v) => !v); clearError('terms'); }}
                  className="text-xs text-white/60 cursor-pointer hover:text-white transition-colors select-none leading-relaxed"
                >
                  I have read and agree to the{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-primary font-semibold underline underline-offset-2 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <span className="text-primary font-semibold underline underline-offset-2">Privacy Policy</span>.
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-xs font-medium pl-8">{errors.terms}</p>}
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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </Button>

          </form>

          {/* Login CTA */}
          <p className="text-center font-manrope text-sm text-white/50">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-semibold hover:text-white transition-colors inline-flex items-center gap-1 group"
            >
              Sign in here
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>

        </div>

        {/* Footer note */}
        <p className="text-center font-manrope text-xs text-white/25">
          Your data is protected and never shared. Read our{' '}
          <Link href="/terms#accounts" className="underline underline-offset-2 hover:text-white/50 transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
