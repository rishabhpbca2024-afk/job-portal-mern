import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Clock, Building } from 'lucide-react';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header: Company & Badges */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg group-hover:scale-105 transition">
              <Building className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700">{job.company}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {job.location}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
            {job.jobType}
          </span>
        </div>

        {/* Title */}
        <Link to={`/jobs/${job._id}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition mb-2">
            {job.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills / Requirements tags */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span
                key={index}
                className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="text-xs text-slate-400 self-center">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Offered Salary</span>
          <span className="text-sm font-bold text-slate-900 flex items-center">
            {job.salary}
          </span>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="px-4 py-2 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-600 hover:text-white rounded-lg transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
