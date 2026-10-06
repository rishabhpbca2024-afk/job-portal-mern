import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Briefcase,
  User,
  Clock,
  Building,
  MapPin,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        setApplications(res.data.data);
      } catch (err) {
        console.error('Error fetching applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const total = applications.length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const interview = applications.filter((a) => a.status === 'Interview').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-sky-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                Job Seeker
              </span>
            </div>
            <p className="text-sm text-slate-500">{user?.email}</p>
            {user?.bio && <p className="text-xs text-slate-600 mt-1 max-w-xl">{user.bio}</p>}
          </div>
        </div>

        {/* Skills pill list */}
        {user?.skills && user.skills.length > 0 && (
          <div className="flex flex-col md:items-end">
            <span className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Your Listed Skills:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-end max-w-sm">
              {user.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-md font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Applied</p>
          <p className="text-2xl font-extrabold text-slate-900">{total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Shortlisted</p>
          <p className="text-2xl font-extrabold text-emerald-700">{shortlisted}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Interviews</p>
          <p className="text-2xl font-extrabold text-purple-700">{interview}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-wide">Rejected</p>
          <p className="text-2xl font-extrabold text-rose-600">{rejected}</p>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Job Applications</h2>
            <p className="text-xs text-slate-500">Track and review statuses of all positions applied</p>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>Browse More Jobs</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading your applications...</p>
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 text-xs font-semibold uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Role & Company</th>
                  <th className="py-3.5 px-6">Location</th>
                  <th className="py-3.5 px-6">Applied Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">
                        {app.job?.title || 'Job Deleted'}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        {app.job?.company || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <span className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {app.job?.location || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      {app.job ? (
                        <Link
                          to={`/jobs/${app.job._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg transition"
                        >
                          <span>View Job</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Applications Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't applied to any jobs yet. Check out open roles and apply now!
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition mt-2"
            >
              Explore Job Listings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
