import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  ArrowLeft,
  Users,
  FileText,
  Mail,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Phone,
  Globe
} from 'lucide-react';

const ApplicantManagement = () => {
  const { jobId } = useParams();
  const [jobInfo, setJobInfo] = useState({ title: '', company: '' });
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const getSafeLink = (url) => {
    if (!url) return '#';
    const trimmed = url.trim();
    if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) {
      return '#';
    }
    return trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
  };

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setJobInfo({ title: res.data.jobTitle, company: res.data.company });
      setApplicants(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load applicants for this job'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setStatusUpdating(applicationId);
    try {
      await api.put(`/applications/${applicationId}/status`, {
        status: newStatus
      });

      // Update state in local list
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      setToastMsg(`Status updated to "${newStatus}"!`);
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/recruiter/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 text-sm font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-sky-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Applicant Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {jobInfo.title || 'Job Applications'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{jobInfo.company}</p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-2xl text-xs font-bold self-start md:self-auto">
          <Users className="w-4 h-4" />
          <span>{applicants.length} Total Candidates Applied</span>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Applicants List */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading applicant profiles...</p>
        </div>
      ) : applicants.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center shrink-0">
                    {(app.fullName || app.applicant?.name) ? (app.fullName || app.applicant.name).charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">
                        {app.fullName || app.applicant?.name || 'Applicant'}
                      </h3>
                      {app.experience && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                          {app.experience}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {app.email || app.applicant?.email}
                      </span>
                      {app.phone && (
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-sky-500" />
                          {app.phone}
                        </span>
                      )}
                      <span>•</span>
                      <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">Application Status:</span>
                  <select
                    value={app.status}
                    disabled={statusUpdating === app._id}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <StatusBadge status={app.status} />
                </div>
              </div>

              {/* Portfolio Link if provided */}
              {app.portfolioUrl && (
                <div className="text-xs">
                  <a
                    href={getSafeLink(app.portfolioUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 hover:underline font-semibold"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Candidate Portfolio / Profile</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              )}

              {/* Bio & Skills */}
              {app.applicant?.bio && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <span className="font-semibold text-slate-700">Bio: </span>
                  {app.applicant.bio}
                </div>
              )}

              {app.applicant?.skills && app.applicant.skills.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-400 mr-1">Skills:</span>
                  {app.applicant.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-50 text-sky-700 border border-sky-100 text-xs px-2.5 py-0.5 rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Cover Letter */}
              {app.coverLetter && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    Cover Letter:
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl whitespace-pre-line border border-slate-100">
                    {app.coverLetter}
                  </p>
                </div>
              )}

              {/* Resume Link / File */}
              {app.resumeUrl && (
                <div className="pt-2 flex items-center">
                  <a
                    href={getSafeLink(app.resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>{app.resumeOriginalName ? `View Resume (${app.resumeOriginalName})` : 'View Candidate Resume'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Applicants Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Candidates who apply for this position will appear here with their resumes and skill profiles.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicantManagement;
