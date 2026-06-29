import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data));
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-slate-50">

      {/* Left Panel - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
            alt="Admin Dashboard"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div>
            <img src="/kretoss-logo.svg" alt="Kretoss" className="object-contain" />
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-brand-light/10 blur-[80px] pointer-events-none hidden md:block"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-400/10 blur-[80px] pointer-events-none hidden md:block"></div>

        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-12 md:p-14 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] max-w-[480px] w-full border border-slate-100 relative z-10 mx-6 animate-in fade-in slide-in-from-right-8 duration-700">

          <div className="flex flex-col mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center lg:justify-start mb-8">
              <img src="/kretoss-dark-logo.png" alt="Kretoss Logo" className="h-8 object-contain transform hover:scale-105 transition-transform duration-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center lg:text-left">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium text-center lg:text-left">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-light transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  className="input-premium w-full pl-11 py-3.5 bg-slate-50/50"
                  placeholder="admin@kretoss.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-light transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-premium w-full pl-11 pr-12 py-3.5 bg-slate-50/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1 rounded-md hover:bg-slate-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-kretoss w-full font-bold py-4 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-base shadow-lg shadow-brand-light/30 hover:shadow-brand-light/40 transition-all hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-medium">Secure Admin Portal &copy; {new Date().getFullYear()} Kretoss Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
