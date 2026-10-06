import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, PlusCircle, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isRecruiter, isJobSeeker, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-sky-600 font-extrabold text-2xl tracking-tight hover:text-sky-700 transition">
              <div className="bg-sky-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span>Job<span className="text-slate-900">Hub</span></span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-slate-600 hover:text-sky-600 font-medium text-sm transition"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="text-slate-600 hover:text-sky-600 font-medium text-sm transition"
              >
                Find Jobs
              </Link>
              {isAuthenticated && isJobSeeker && (
                <Link
                  to="/jobseeker/dashboard"
                  className="text-slate-600 hover:text-sky-600 font-medium text-sm transition"
                >
                  My Applications
                </Link>
              )}
              {isAuthenticated && isRecruiter && (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    className="text-slate-600 hover:text-sky-600 font-medium text-sm transition flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/recruiter/create-job"
                    className="text-slate-600 hover:text-sky-600 font-medium text-sm transition flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Job
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Section / Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-semibold flex items-center justify-center text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-sky-600 font-medium uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-200 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-sky-600"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-sky-600"
          >
            Find Jobs
          </Link>
          {isAuthenticated && isJobSeeker && (
            <Link
              to="/jobseeker/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium hover:text-sky-600"
            >
              My Applications
            </Link>
          )}
          {isAuthenticated && isRecruiter && (
            <>
              <Link
                to="/recruiter/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 font-medium hover:text-sky-600"
              >
                Recruiter Dashboard
              </Link>
              <Link
                to="/recruiter/create-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 font-medium hover:text-sky-600"
              >
                Post a Job
              </Link>
            </>
          )}

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-slate-800">
                  Logged in as <span className="text-sky-600">{user?.name}</span> ({user?.role})
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left py-2 text-sm text-rose-600 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-semibold border border-slate-300 rounded-lg text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-semibold text-white bg-sky-600 rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
