import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function Services() {
  const [showForm, setShowForm] = useState(false);
  
  const [service, setService] = useState({
    id: '', title: '', desc: '', image: '', icon: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item) => {
    setService({
      id: item.id || '',
      title: item.title || '',
      desc: item.desc || '',
      image: item.image || '',
      icon: item.icon || ''
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    if (!showForm) {
      setService({ id: '', title: '', desc: '', image: '', icon: '' });
    }
    setShowForm(!showForm);
  };

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
          onClick={handleAddNew}
          className="btn-kretoss px-4 py-2 rounded-md font-medium flex items-center"
        >
          {showForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">{service.id ? 'Edit Service' : 'Create New Service'}</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service ID</label>
                <input name="id" value={service.id} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. 03" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Title</label>
                <input name="title" value={service.title} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Cloud Solutions" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input name="image" value={service.image} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. /services/cloud.png" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icon URL</label>
                <input name="icon" value={service.icon} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. /services/icon_cloud.png" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="desc" value={service.desc} onChange={handleChange} rows="3" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Service description..."></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-kretoss px-6 py-2 rounded-md font-medium">
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
                    <button onClick={() => handleEdit(item)} className="text-brand-light hover:text-brand-dark font-medium">Edit</button>
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
