import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Building,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Globe,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  FileText,
  UploadCloud,
  X,
  FileCheck,
  Phone,
  User as UserIcon,
  Link as LinkIcon,
  Trash2
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isJobSeeker, isRecruiter } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('Fresher (0-1 yr)');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // Resume File & Link state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      if (user.resumeUrl) {
        setResumeUrl(user.resumeUrl);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

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

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowedExts = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(ext)) {
      setApplyError('Please select a valid resume file (.pdf, .doc, or .docx)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setApplyError('Resume file size cannot exceed 5MB for security and performance');
      return;
    }
    setApplyError('');
    setResumeFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');
    setApplySuccess('');

    // Comprehensive Validations
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setApplyError('Please enter your full name (at least 2 characters)');
      setApplying(false);
      return;
    }
    if (trimmedName.length > 60) {
      setApplyError('Full name cannot exceed 60 characters');
      setApplying(false);
      return;
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      setApplyError('Full name can only contain letters, spaces, and hyphens');
      setApplying(false);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setApplyError('Please enter your contact email address');
      setApplying(false);
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      setApplyError('Please enter a valid email address (e.g. name@example.com)');
      setApplying(false);
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      setApplyError('Please enter your 10-digit mobile number');
      setApplying(false);
      return;
    }
    if (cleanPhone.length !== 10) {
      setApplyError(`Mobile number must be exactly 10 digits (you entered ${cleanPhone.length} digits)`);
      setApplying(false);
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setApplyError('Please enter a valid Indian mobile number starting with 6, 7, 8, or 9');
      setApplying(false);
      return;
    }

    if (portfolioUrl && portfolioUrl.trim()) {
      try {
        const u = new URL(portfolioUrl.trim());
        if (!['http:', 'https:'].includes(u.protocol)) {
          setApplyError('Portfolio link must begin with http:// or https://');
          setApplying(false);
          return;
        }
      } catch {
        setApplyError('Please enter a valid website URL for portfolio (e.g. https://github.com/username)');
        setApplying(false);
        return;
      }
    }

    if (coverLetter && coverLetter.trim().length > 2000) {
      setApplyError('Cover letter cannot exceed 2000 characters');
      setApplying(false);
      return;
    }

    if (!resumeFile && (!resumeUrl || !resumeUrl.trim())) {
      setApplyError('Please select a resume file from your computer or provide an online resume link');
      setApplying(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fullName', trimmedName);
      formData.append('email', trimmedEmail);
      formData.append('phone', cleanPhone);
      formData.append('experience', experience);
      formData.append('portfolioUrl', portfolioUrl.trim());
      formData.append('coverLetter', coverLetter.trim());

      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else if (resumeUrl) {
        formData.append('resumeUrl', resumeUrl.trim());
      }

      await api.post(`/applications/apply/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setApplySuccess('Application submitted successfully! Track your status in your dashboard.');
      setTimeout(() => {
        setShowApplyModal(false);
        setResumeFile(null);
        setCoverLetter('');
        setPhone('');
        setPortfolioUrl('');
        setApplySuccess('');
      }, 2500);
    } catch (err) {
      setApplyError(
        err.response?.data?.message || 'Could not submit application. Please try again.'
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{error || 'Job not found'}</h2>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-sky-600 font-semibold text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to job listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 text-sm font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all jobs</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold text-2xl shrink-0">
              <Building className="w-8 h-8 text-sky-600" />
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-2">
                {job.jobType}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{job.title}</h1>
              <p className="text-base text-slate-600 font-medium mt-1">{job.company}</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-sky-200 transition text-sm"
              >
                <span>Login to Apply</span>
              </Link>
            ) : isJobSeeker ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-sky-200 transition text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Apply for this Job</span>
              </button>
            ) : isRecruiter ? (
              <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold">
                Logged in as Recruiter
              </div>
            ) : null}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-sm">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Location</p>
              <p className="font-semibold text-slate-800">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <IndianRupee className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Offered Salary</p>
              <p className="font-semibold text-slate-800">{job.salary}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Experience Level</p>
              <p className="font-semibold text-slate-800">{job.experienceLevel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Posted Date</p>
              <p className="font-semibold text-slate-800">
                {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Company Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description & Requirements */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Job Description</h2>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Key Requirements & Skills</h2>
              <ul className="space-y-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 1 Col: Employer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 overflow-hidden">
            <h3 className="text-base font-bold text-slate-900">About the Employer</h3>
            <div className="space-y-3.5 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium">Company Name</p>
                <p className="font-semibold text-slate-800">{job.company}</p>
              </div>

              {job.recruiter?.companyWebsite && (
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs text-slate-400 font-medium">Website</p>
                  <a
                    href={getSafeLink(job.recruiter.companyWebsite)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sky-600 hover:text-sky-700 hover:underline inline-flex items-start gap-1.5 mt-0.5 text-xs max-w-full group"
                    title={job.recruiter.companyWebsite}
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-500 group-hover:text-sky-600 transition" />
                    <span className="break-all leading-tight">
                      {job.recruiter.companyWebsite}
                    </span>
                  </a>
                </div>
              )}

              {job.recruiter?.email && (
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs text-slate-400 font-medium">Recruiter Contact</p>
                  <a
                    href={`mailto:${job.recruiter.email}`}
                    className="font-medium text-slate-700 hover:text-sky-600 inline-flex items-center gap-1.5 mt-0.5 text-xs max-w-full group"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-sky-600 transition" />
                    <span className="break-all leading-tight">{job.recruiter.email}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150 relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-1.5">
                  Job Application
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Apply for {job.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {job.company} • {job.location} • {job.jobType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {applySuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-5">
                {applyError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{applyError}</span>
                  </div>
                )}

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <span className={`text-[11px] font-semibold ${phone.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {phone.length}/10 digits
                      </span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhone(digitsOnly);
                          if (applyError) setApplyError('');
                        }}
                        placeholder="9876543210"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Enter 10-digit mobile number (starts with 6, 7, 8, or 9)
                    </p>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Experience Level <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 text-slate-800"
                      >
                        <option value="Fresher (0-1 yr)">Fresher (0-1 yr)</option>
                        <option value="1 - 2 Years">1 - 2 Years</option>
                        <option value="3 - 5 Years">3 - 5 Years</option>
                        <option value="5+ Years Senior">5+ Years Senior</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Portfolio / LinkedIn Link */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Portfolio / GitHub / LinkedIn (Optional)
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourname or portfolio link"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Resume Upload Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Resume Document <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseUrlMode(!useUrlMode)}
                      className="text-xs text-sky-600 hover:text-sky-700 font-semibold underline"
                    >
                      {useUrlMode ? 'Switch to File Upload' : 'Or use Online Link instead'}
                    </button>
                  </div>

                  {!useUrlMode ? (
                    <div>
                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />

                      {resumeFile ? (
                        /* Selected File Preview Box */
                        <div className="flex items-center justify-between p-4 bg-sky-50/70 border-2 border-sky-200 rounded-2xl">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">
                                {resumeFile.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatFileSize(resumeFile.size)} • Ready to upload
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setResumeFile(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                              title="Remove file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Drag & Drop Upload Zone */
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-2 ${
                            dragOver
                              ? 'border-sky-500 bg-sky-50/50 scale-[0.99]'
                              : 'border-slate-300 hover:border-sky-400 bg-slate-50/50 hover:bg-sky-50/20'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              <span className="text-sky-600 underline">Click to choose resume</span> from your device
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Drag and drop PDF, DOC, or DOCX (Max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback URL Input */
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/your-resume-link"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                      />
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cover Letter / Note for Hiring Manager (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the recruiter why you are an ideal fit for this position..."
                    className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  ></textarea>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-70 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-sky-200"
                  >
                    {applying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
