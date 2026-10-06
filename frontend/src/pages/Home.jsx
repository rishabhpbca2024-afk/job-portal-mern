import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, TrendingUp, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const res = await api.get('/jobs');
        // Take top 6 latest jobs
        setLatestJobs(res.data.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching latest jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append('keyword', keyword);
    if (location) queryParams.append('location', location);
    navigate(`/jobs?${queryParams.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold mb-6 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Over 1,200+ Verified Job Openings Active</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Find Your <span className="text-sky-600">Dream Career</span> or Hire Top Industry Talent
          </h1>

          <p className="mt-5 text-base md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The next-generation MERN Stack job portal connecting ambitious professionals with top recruiters and tech companies.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-3xl mx-auto bg-white p-3 rounded-2xl shadow-xl border border-slate-200/80 flex flex-col md:flex-row gap-3"
          >
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skills, or company..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <MapPin className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g. Remote, Delhi, Bangalore)"
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md shadow-sky-200 flex items-center justify-center gap-2"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Trending Searches:</span>
            {['React Developer', 'Full Stack', 'Node.js', 'Remote', 'Frontend', 'Data Analyst'].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/jobs?keyword=${tag}`)}
                  className="bg-white border border-slate-200 px-3 py-1 rounded-full hover:border-sky-400 hover:text-sky-600 transition"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-sky-600">2,500+</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Jobs Posted</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-sky-600">800+</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Companies</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-sky-600">15,000+</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Job Seekers</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-sky-600">98%</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Hiring Success</p>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Job Openings</h2>
            <p className="text-slate-500 text-sm mt-1">Discover freshly listed roles from high-growth startups and tech giants</p>
          </div>
          <Link
            to="/jobs"
            className="text-sky-600 font-semibold text-sm hover:text-sky-700 flex items-center gap-1 group self-start md:self-auto"
          >
            <span>Explore All Jobs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-52"></div>
            ))}
          </div>
        ) : latestJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">No jobs posted yet. Recruiters can post the first job!</p>
          </div>
        )}
      </section>

      {/* Dual CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Job Seeker */}
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-8 md:p-10 text-white shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Looking for Your Next Role?</h3>
              <p className="text-sky-100 text-sm leading-relaxed">
                Create your profile, explore hundreds of curated tech jobs, submit instant applications, and track status live in your dashboard.
              </p>
            </div>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-white text-sky-700 font-semibold px-6 py-3 rounded-xl hover:bg-sky-50 transition shadow"
            >
              <span>Join as Job Seeker</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* For Recruiter */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Hiring Exceptional Talent?</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Post job listings in minutes, manage candidate applications, shortlist resumes, and schedule interviews all from one centralized portal.
              </p>
            </div>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-sky-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-sky-400 transition shadow"
            >
              <span>Post Jobs as Recruiter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
