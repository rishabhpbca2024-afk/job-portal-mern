import React from 'react';
import { Briefcase, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 text-white font-extrabold text-xl">
              <div className="bg-sky-500 text-white p-1.5 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <span>Job<span className="text-sky-400">Hub</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering talented job seekers to discover their dream jobs and helping top companies hire the right talent effortlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition">Browse All Jobs</Link></li>
              <li><Link to="/jobs?jobType=Remote" className="hover:text-white transition">Remote Jobs</Link></li>
              <li><Link to="/jobseeker/dashboard" className="hover:text-white transition">Application Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/recruiter/create-job" className="hover:text-white transition">Post a New Job</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-white transition">Recruiter Dashboard</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Employer Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Project Info</h4>
            <p className="text-xs text-slate-400 leading-normal mb-2">
              Full-Stack MERN Project built with MongoDB, Express.js, React, Node.js, and Tailwind CSS.
            </p>
            <div className="text-xs text-slate-500">
              Role-Based Authentication with JWT & bcrypt.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} JobHub Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for MERN Stack Mastery
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
