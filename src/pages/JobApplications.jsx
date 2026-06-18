import React, { useState, useEffect } from 'react';
import { Paperclip, Phone, Mail } from 'lucide-react';

export default function JobApplications() {
  const [apps, setApps] = useState([]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/job-applications/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchApps();
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const handleView = (app) => {
    const details = `
      Current Salary: ${app.currentSalary || 'N/A'}
      Expected Salary: ${app.expectedSalary || 'N/A'}
      LinkedIn: ${app.linkedinUrl || 'N/A'}
    `;
    alert(details.trim());
  };

  const handleResumeClick = (resumePath) => {
    if (resumePath) {
      window.open(`http://localhost:5000${resumePath}`, '_blank');
    } else {
      alert("No resume uploaded for this candidate.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Job Applications</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Candidate Info</th>
              <th className="px-6 py-4 font-medium">Applied Role</th>
              <th className="px-6 py-4 font-medium">Experience</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {apps.map((app) => (
              <tr key={app._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{app.fullName}</div>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Mail className="w-3 h-3 mr-1" /> {app.email}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Phone className="w-3 h-3 mr-1" /> {app.phone || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-brand-dark px-2 py-1 rounded-md text-xs font-medium">
                    {app.appliedFor}
                  </span>
                </td>
                <td className="px-6 py-4">{app.experience || '-'}</td>
                <td className="px-6 py-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleResumeClick(app.resume)} className="text-brand-light hover:text-brand-dark font-medium inline-flex items-center">
                    <Paperclip className="w-4 h-4 mr-1" /> Resume
                  </button>
                  <button onClick={() => handleView(app)} className="text-emerald-500 hover:text-emerald-600 font-medium">View</button>
                  <button onClick={() => handleDelete(app._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
