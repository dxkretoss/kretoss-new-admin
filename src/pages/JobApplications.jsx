import React, { useState, useEffect } from 'react';
import { Paperclip, Phone, Mail, X, Trash2, Eye, Search, Filter, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobApplications() {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null); // For View modal
  const [deleteTarget, setDeleteTarget] = useState(null); // For Delete modal
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchApps = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/job-applications');
      const data = await response.json();
      if (data.success) {
        setApps(data.data);
      }
    } catch (error) {
      console.error('Error fetching job applications:', error);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const confirmDelete = (id) => {
    setDeleteTarget(id);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`http://localhost:5000/api/job-applications/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Application deleted successfully.');
        fetchApps();
        setDeleteTarget(null);
      } else {
        toast.error('Failed to delete application.');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const handleView = (app) => {
    setSelectedApp(app);
  };

  const handleResumeClick = (resumePath) => {
    if (resumePath) {
      window.open(`http://localhost:5000${resumePath}`, '_blank');
    } else {
      toast.error("No resume uploaded for this candidate.");
    }
  };

  const uniqueRoles = ['All', ...new Set(apps.map(app => app.appliedFor).filter(Boolean))];

  const filteredAndSortedApps = apps
    .filter(app => {
      const matchesSearch = (app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             app.phone?.includes(searchTerm));
      const matchesRole = roleFilter === 'All' || app.appliedFor === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      
      const parseExp = (expStr) => {
        if (!expStr) return 0;
        const match = expStr.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      
      const expA = parseExp(a.experience);
      const expB = parseExp(b.experience);
      
      if (sortBy === 'exp_desc') return expB - expA;
      if (sortBy === 'exp_asc') return expA - expB;
      
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Job Applications</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search candidates by name, email or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:border-blue-500 bg-white"
            >
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="exp_desc">Experience (High to Low)</option>
              <option value="exp_asc">Experience (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-3.5">Candidate Info</th>
              <th className="px-6 py-3.5">Applied Role</th>
              <th className="px-6 py-3.5">Experience</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {filteredAndSortedApps.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No applications found matching your criteria.</td></tr>
            ) : filteredAndSortedApps.map((app) => (
              <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-3">
                  <div className="font-medium text-slate-900">{app.fullName}</div>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Mail className="w-3 h-3 mr-1" /> {app.email}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Phone className="w-3 h-3 mr-1" /> {app.phone || '-'}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className="bg-blue-50 text-brand-dark px-2 py-1 rounded-md text-xs font-medium">
                    {app.appliedFor}
                  </span>
                </td>
                <td className="px-6 py-3 font-medium text-slate-700">{app.experience || '-'}</td>
                <td className="px-6 py-3 font-medium text-slate-700">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleResumeClick(app.resume)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium inline-flex items-center px-3 py-1.5 rounded-lg transition-colors text-xs">
                      <Paperclip className="w-3.5 h-3.5 mr-1.5" /> Resume
                    </button>
                    <button onClick={() => handleView(app)} className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-medium inline-flex items-center px-3 py-1.5 rounded-lg transition-colors text-xs">
                      View
                    </button>
                    <button onClick={() => confirmDelete(app._id)} className="text-red-600 bg-red-50 hover:bg-red-100 font-medium inline-flex items-center px-3 py-1.5 rounded-lg transition-colors text-xs">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2 text-slate-800 font-bold">
                <Eye className="w-5 h-5 text-emerald-500" />
                <span>Application Details</span>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
              {/* Info Block */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 text-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Full Name</span>
                  <span className="font-medium text-slate-900">{selectedApp.fullName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Email</span>
                  <span className="font-medium text-slate-900">{selectedApp.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Phone</span>
                  <span className="font-medium text-slate-900">{selectedApp.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Applied Role</span>
                  <span className="font-medium text-slate-900 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">{selectedApp.appliedFor || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Experience</span>
                  <span className="font-medium text-slate-900">{selectedApp.experience || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Current Salary</span>
                  <span className="font-medium text-slate-900">{selectedApp.currentSalary || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Expected Salary</span>
                  <span className="font-medium text-slate-900">{selectedApp.expectedSalary || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="font-semibold text-slate-500">LinkedIn Profile</span>
                  {selectedApp.linkedinUrl ? (
                    <a href={selectedApp.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all text-right ml-4">
                      {selectedApp.linkedinUrl}
                    </a>
                  ) : (
                    <span className="text-slate-900 font-medium">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Application?</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this application? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all hover:-translate-y-0.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
