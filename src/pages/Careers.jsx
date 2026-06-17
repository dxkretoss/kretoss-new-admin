import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function Careers() {
  const [showForm, setShowForm] = useState(false);

  const emptyJob = {
    title: '', slug: '', location: '', type: 'Full-Time', category: '', experience: '', description: '',
    responsibilities: [], requirements: [], niceToHave: []
  };

  const [job, setJob] = useState(emptyJob);

  const [respInput, setRespInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [niceInput, setNiceInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item) => {
    setJob({
      ...emptyJob,
      ...item,
      responsibilities: item.responsibilities || [],
      requirements: item.requirements || [],
      niceToHave: item.niceToHave || []
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    if (!showForm) {
      setJob(emptyJob);
      setRespInput('');
      setReqInput('');
      setNiceInput('');
    }
    setShowForm(!showForm);
  };

  // Array Handlers
  const handleAddArrayItem = (e, field, input, setInput) => {
    if (input.trim()) {
      e.preventDefault();
      setJob(prev => ({ ...prev, [field]: [...prev[field], input.trim()] }));
      setInput('');
    }
  };

  const handleRemoveArrayItem = (field, indexToRemove) => {
    setJob(prev => ({
      ...prev,
      [field]: prev[field].filter((_, index) => index !== indexToRemove)
    }));
  };

  const renderArrayInput = (label, field, inputState, setInputState, placeholder) => (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="space-y-3 p-4 border border-slate-100 rounded-lg bg-white shadow-sm">
        {job[field].length > 0 && (
          <ul className="flex flex-col gap-2 mb-4">
            {job[field].map((item, index) => (
              <li key={index} className="flex justify-between items-start p-3 bg-slate-50 rounded-md border border-slate-100">
                <span className="text-sm text-slate-700">{item}</span>
                <button type="button" onClick={() => handleRemoveArrayItem(field, index)} className="ml-3 mt-0.5 text-red-400 hover:text-red-600 transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-3">
          <input 
            type="text" 
            className="flex-1 border border-slate-200 rounded-md px-4 py-2.5 focus:outline-none focus:border-brand-light text-sm" 
            placeholder={placeholder} 
            value={inputState}
            onChange={(e) => setInputState(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddArrayItem(e, field, inputState, setInputState);
              }
            }}
          />
          <button 
            type="button"
            onClick={(e) => handleAddArrayItem(e, field, inputState, setInputState)}
            className="btn-kretoss px-6 py-2.5 rounded-md font-medium text-sm flex-shrink-0"
          >
            Add Field
          </button>
        </div>
      </div>
    </div>
  );

  // Static Data mimicking jobs.js
  const jobs = [
    { slug: 'mern-stack-developer', title: 'MERN Stack Developer', location: 'Ahmedabad', type: 'Full-Time', experience: '2-4 Years' },
    { slug: 'business-development-executive', title: 'Business Development Executive', location: 'Ahmedabad', type: 'Full-Time', experience: '1-3 Years' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Careers</h1>
        <button 
          onClick={handleAddNew}
          className="btn-kretoss px-4 py-2 rounded-md font-medium flex items-center"
        >
          {showForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showForm ? 'Cancel' : 'Add Job'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">{job.slug ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); console.log('Saved Job:', job); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input name="title" value={job.title} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Frontend Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input name="slug" value={job.slug} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. frontend-developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input name="location" value={job.location} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Ahmedabad" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select name="type" value={job.type} onChange={handleChange} className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light">
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input name="category" value={job.category} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Development" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience Required</label>
                <input name="experience" value={job.experience} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. 2-4 Years" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" value={job.description} onChange={handleChange} rows="4" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Job description..."></textarea>
              </div>

              {renderArrayInput('Responsibilities', 'responsibilities', respInput, setRespInput, 'Add a responsibility...')}
              
              {renderArrayInput('Requirements', 'requirements', reqInput, setReqInput, 'Add a requirement...')}
              
              {renderArrayInput('Nice to Have', 'niceToHave', niceInput, setNiceInput, 'Add a nice-to-have skill...')}

            </div>
            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button type="submit" className="btn-kretoss px-8 py-3 rounded-md font-medium text-base">
                Save Job Posting
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Experience</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {jobs.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-brand-dark px-2 py-1 rounded-md text-xs font-medium">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.experience}</td>
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
