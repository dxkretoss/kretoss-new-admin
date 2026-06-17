import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function Services() {
  const [showForm, setShowForm] = useState(false);

  // Static Data mimicking servicesData
  const services = [
    { id: '01', title: 'Frontend Excellence', desc: 'Building responsive, lightning-fast user interfaces...', image: '/services/main_frontend.png' },
    { id: '02', title: 'Backend Engineering', desc: 'Robust, scalable, and secure server-side solutions...', image: '/services/main_backend.png' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Services</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-[#44c7f6] to-[#0037f0] hover:opacity-90 text-white px-4 py-2 rounded-md font-medium flex items-center transition-opacity"
        >
          {showForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">Create New Service</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service ID</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. 03" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Title</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Cloud Solutions" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. /services/cloud.png" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icon URL</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. /services/icon_cloud.png" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows="3" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Service description..."></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="bg-gradient-to-r from-[#44c7f6] to-[#0037f0] text-white px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
                Save Service
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {services.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.id}</td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{item.desc}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-brand-light hover:text-brand-dark font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
