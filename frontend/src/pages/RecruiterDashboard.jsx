import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Briefcase,
  PlusCircle,
  Users,
  Edit,
  Trash2,
  MapPin,
  Building,
  ExternalLink,
  AlertCircle,
  Eye
} from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState('');

  const fetchRecruiterJobs = async () => {
    try {
      const res = await api.get('/jobs/recruiter/my-jobs');
      setJobs(res.data.data);
    } catch (err) {
      console.error('Error fetching recruiter jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this job posting? All applicants for this job will also be removed.'
      )
    ) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || 'Failed to delete job posting'
      );
    }
  };

  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce((acc, curr) => acc + (curr.applicantCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile & Actions */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-sky-200">
            <Building className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {user?.companyName || user?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                Recruiter Portal
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Contact: {user?.name} • {user?.email}
            </p>
          </div>
        </div>

        <Link
          to="/recruiter/create-job"
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-sky-200 transition text-sm self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Jobs Posted By You</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide">Total Candidates Applied</p>
          <p className="text-3xl font-extrabold text-sky-600">{totalApplicants}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Active Openings</p>
          <p className="text-3xl font-extrabold text-emerald-600">
            {jobs.filter((j) => j.status === 'Open').length}
          </p>
        </div>
      </div>

      {/* Delete error notification */}
      {deleteError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manage Your Job Postings</h2>
            <p className="text-xs text-slate-500">Edit listings, manage applications, or close positions</p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading your postings...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 text-xs font-semibold uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Job Title</th>
                  <th className="py-3.5 px-6">Location & Type</th>
                  <th className="py-3.5 px-6">Applicants</th>
                  <th className="py-3.5 px-6">Date Created</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="font-semibold text-slate-900 hover:text-sky-600 transition flex items-center gap-1.5"
                      >
                        <span>{job.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                      <div className="text-xs text-slate-500 mt-0.5">{job.salary}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-800 text-xs font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </div>
                      <span className="inline-block mt-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {job.jobType}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/recruiter/applicants/${job._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold hover:bg-emerald-100 transition"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount || 0} Candidates</span>
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/recruiter/applicants/${job._id}`}
                          className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                          title="View Applicants"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/recruiter/edit-job/${job._id}`}
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
            <h3 className="text-base font-bold text-slate-800">No Jobs Posted Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't published any job openings yet. Start hiring candidates now!
            </p>
            <Link
              to="/recruiter/create-job"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              Post Your First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
