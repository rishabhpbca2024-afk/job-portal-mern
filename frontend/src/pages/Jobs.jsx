import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, RotateCcw, Briefcase } from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs with filters
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      if (experienceLevel) params.experienceLevel = experienceLevel;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.data);
    } catch (err) {
      console.error('Error fetching jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType, experienceLevel]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Update URL query params
    const params = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (jobType) params.jobType = jobType;
    if (experienceLevel) params.experienceLevel = experienceLevel;
    setSearchParams(params);
    fetchJobs();
  };

  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
    setSearchParams({});
    setTimeout(() => {
      api.get('/jobs').then((res) => setJobs(res.data.data));
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Search */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Explore Open Job Vacancies</h1>
          <p className="text-sm text-slate-500 mt-1">Discover opportunities filtered by location, type, and experience</p>
        </div>

        {/* Search Inputs */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search title, tech or company..."
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <MapPin className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State or 'Remote'..."
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Filter Jobs</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition border border-slate-200"
              title="Reset Filters"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Quick Filter Badges */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Job Type:
            </span>
            {['', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobType(type)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                  jobType === type
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type || 'All Types'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Experience:</span>
            {['', 'Entry Level', 'Mid Level', 'Senior Level'].map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => setExperienceLevel(exp)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                  experienceLevel === exp
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {exp || 'All Levels'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">
          Showing <span className="text-sky-600 font-bold">{jobs.length}</span> available positions
        </p>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-60"></div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Jobs Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find any jobs matching your current filter criteria. Try changing keywords or resetting filters.
          </p>
          <button
            onClick={handleReset}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
