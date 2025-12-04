"use client";

import { useState } from 'react';
import { User } from '@/app/page';
import { supabase } from '@/lib/supabase';
import { Lock,  UserCheck2 } from 'lucide-react';
import Image from 'next/image';
import bcrypt from 'bcryptjs';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      
      const { data: user, error: fetchErr } = await supabase
        .from('users')
        .select('*')
        .eq('user_name', user_name)
        .single();

      if (fetchErr || !user) {
        setError('Invalid Username or password');
        setLoading(false);
        return;
      }

      
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      
      onLogin(user as User);

    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center  mb-4">
               <Image src="/legacylogo.png" alt="Legacy Innovations" width={200} height={110}/>
            </div>
            
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                User Name
              </label>
              <div className="relative">
                <UserCheck2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="text"
                  value={user_name}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* FOOTER */}
        <div className="text-center text-l  mt-6 text-gray-600   flex items-center justify-center gap-2">
          2025 © — By <Image 
                src="/simpleHunt.png"
                alt="Simple Hunt Logo"
                width={150}
                height={100}

              />
        </div>
        </div>
      </div>
   </div>
  );
}