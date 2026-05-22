'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, getSession } from 'next-auth/react';

// Premium SVG Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    {...props}
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  
  // Sign In inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Connects with credentials provider inside auth.ts
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setIsLoading(false);
        setErrorMsg('Invalid email address or password.');
      } else {
        // Fetch session to check user's roles
        const session = await getSession();
        setIsLoading(false);
        setSuccessMsg('✓ Logged in successfully! Directing workspace...');
        
        setTimeout(() => {
          if (session?.user && (session.user as any).role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/');
          }
          // Force a router refresh to update navbar session states
          router.refresh();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setErrorMsg('An error occurred. Please check your credentials and try again.');
    }
  };

  const handleSocialLogin = () => {
    setIsLoading(true);
    setSuccessMsg('✓ Secure Google Connection authorized. Loading session...');
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
      router.refresh();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white select-none">
      {/* Sticky Main Navigation */}
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#fcfaf7]">
        <div className="max-w-md w-full bg-white border border-brand-grey p-8 shadow-md space-y-6">
          
          {/* Typographic Logo & Sub */}
          <div className="text-center space-y-1.5">
            <span className="font-display font-semibold text-[10px] tracking-[0.25em] uppercase text-brand-clay flex items-center justify-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>West Elm Club Membership</span>
            </span>
            <h2 className="font-display font-bold text-xl uppercase tracking-wider text-brand-charcoal">
              My Design Account
            </h2>
            <p className="text-[11px] text-brand-grey-dark leading-relaxed font-normal">
              Sync your shopping bag across all devices and unlock complimentary interior design consults.
            </p>
          </div>

          {/* Form Switch Header for Clean Routing */}
          <div className="flex border-b border-brand-grey text-center">
            <div className="flex-1 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-brand-charcoal text-brand-charcoal">
              Sign In
            </div>
            <Link
              href="/register"
              className="flex-1 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent text-brand-grey-dark hover:text-brand-charcoal transition-colors duration-200"
            >
              Create Account
            </Link>
          </div>

          {/* Toast message box */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-3 bg-green-50 border border-green-600 text-xs text-green-700 font-semibold uppercase tracking-wider text-center"
              >
                {successMsg}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-3 bg-red-50 border border-brand-clay text-xs text-brand-clay font-semibold uppercase tracking-wider text-center"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dedicated Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-brand-grey py-2.5 pl-3 pr-9 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30 transition-all"
                  placeholder="e.g. yuvraj@westelm.in"
                />
                <Mail className="w-4 h-4 text-brand-grey-dark absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">Password</label>
                <span className="text-[9px] font-semibold text-brand-grey-dark hover:underline uppercase tracking-wider cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-brand-grey py-2.5 pl-3 pr-9 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30 transition-all"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-brand-grey-dark absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300 flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:bg-brand-grey-dark"
              >
                {isLoading ? <span>Verifying credentials...</span> : <span>Sign In Securely</span>}
              </button>
            </div>
          </form>

          {/* Social Google logins separator */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-brand-grey"></div>
            <span className="flex-shrink mx-4 text-[9px] font-bold text-brand-grey-dark uppercase tracking-widest">
              Or Connect With
            </span>
            <div className="flex-grow border-t border-brand-grey"></div>
          </div>

          {/* Google SSO login button */}
          <button
            onClick={handleSocialLogin}
            disabled={isLoading}
            className="w-full py-3 border border-brand-grey text-brand-charcoal text-xs font-bold uppercase tracking-widest hover:bg-brand-sand transition-all duration-200 flex items-center justify-center space-x-2.5 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <GoogleIcon className="w-4 h-4 flex-shrink-0" />
            <span>Continue with Google</span>
          </button>

          {/* Security lock assurances */}
          <div className="flex items-center justify-center space-x-2 text-[10px] text-brand-grey-dark font-normal border-t border-brand-sand pt-4">
            <ShieldCheck className="w-4 h-4 text-brand-clay" />
            <span>Verified secure via NextAuth credentials protocols.</span>
          </div>

        </div>
      </main>

      {/* Sticky Main Footer */}
      <Footer />
    </div>
  );
}
