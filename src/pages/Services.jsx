import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Services() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isFormPage = location.pathname.includes('/services/add') || location.pathname.includes('/services/edit');
  const isEditMode = location.pathname.includes('/services/edit');

  const emptyService = { id: '', title: '', slug: '', desc: '', hireUsLink: '', image: null, icon: null, tags: [] };
  const [service, setService] = useState(emptyService);
  const [servicesList, setServicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      if (data.success) {
        setServicesList(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (isEditMode && id && servicesList.length > 0) {
      const itemToEdit = servicesList.find(s => s.id === id);
      if (itemToEdit) {
        setService({
          ...emptyService,
          ...itemToEdit,
          tags: itemToEdit.tags || []
        });
      }
    } else if (!isFormPage) {
      setService(emptyService);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, isEditMode, isFormPage, servicesList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleAddTag = (e) => {
    if (tagInput.trim()) {
      e.preventDefault();
      setService(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setService(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setService(prev => ({
        ...prev,
        image: Object.assign(file, { preview: URL.createObjectURL(file) })
      }));
    }
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setService(prev => ({
        ...prev,
        icon: Object.assign(file, { preview: URL.createObjectURL(file) })
      }));
    }
  };

  const handleEdit = (item) => {
    navigate(`/services/edit/${item.id}`);
  };

  const handleAddNew = () => {
    navigate('/services/add');
  };

  const handleDelete = async (dbId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/services/${dbId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();

      const textFields = ['id', 'title', 'slug', 'desc', 'hireUsLink'];
      textFields.forEach(field => {
        if (service[field]) formData.append(field, service[field]);
      });

      formData.append('tags', JSON.stringify(service.tags));

      if (service.image && typeof service.image !== 'string' && service.image.name) {
        formData.append('image', service.image);
      }

      if (service.icon && typeof service.icon !== 'string' && service.icon.name) {
        formData.append('icon', service.icon);
      }

      const url = service._id
        ? `http://localhost:5000/api/services/${service._id}`
        : `http://localhost:5000/api/services`;

      const method = service._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData
      });

      if (response.ok) {
        fetchServices();
        toast.success(isEditMode ? 'Service updated successfully!' : 'Service created successfully!');
        navigate('/services');
      } else {
        const errorData = await response.json();
        toast.error('Failed to save: ' + errorData.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {!isFormPage && (
        <div className="flex justify-between items-end pb-6 border-b-2 border-slate-200/50 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Services</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Manage your service offerings.</p>
          </div>
          <button
            onClick={handleAddNew}
            className="btn-kretoss px-6 py-3 rounded-xl text-sm font-semibold flex items-center shadow-md transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </button>
        </div>
      )}

      {isFormPage ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-6 flex items-center gap-4">
            <button type="button" onClick={() => navigate('/services')} className="p-2 hover:bg-slate-200/60 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{service.id ? 'Edit Service' : 'Create New Service'}</h2>
              <p className="text-sm text-slate-500 mt-1">Fill in the details below to {service.id ? 'update this' : 'add a new'} service offering.</p>
            </div>
          </div>
          <form className="p-8 space-y-12" onSubmit={handleSaveService}>

            {/* Section: Basic Details */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">1. Basic Details</h3>
                <p className="text-sm text-slate-500">Service identification and title.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service ID</label>
                  <input name="id" value={service.id} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. 03" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service Title</label>
                  <input name="title" value={service.title} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. Cloud Solutions" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                  <input name="slug" value={service.slug} onChange={handleChange} type="text" className="input-premium bg-slate-100/50" placeholder="e.g. cloud-solutions" />
                </div>
              </div>
            </div>

            {/* Section: Tags & Categorization */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">2. Tags & Categorization</h3>
                <p className="text-sm text-slate-500">Keywords and tags for the service.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (e.g. React.js, Angular)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {service.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-light/10 text-brand-dark font-medium">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(index)} className="ml-2 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(e); }} className="input-premium flex-1" placeholder="e.g. React.js" />
                    <button type="button" onClick={handleAddTag} className="btn-kretoss px-6 py-2 rounded-xl font-semibold">Add Tag</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Media Uploads */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">3. Media Uploads</h3>
                <p className="text-sm text-slate-500">Visual representations of the service.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Main Image</label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-brand-light/5 hover:border-brand-light transition-all text-center cursor-pointer group">
                    <input type="file" onChange={handleImageUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform mb-3">
                      <Upload className="w-6 h-6 text-brand-dark" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 block">Click or drag image to upload</span>
                  </div>
                  {service.image && (
                    <div className="mt-4 w-full">
                      <div className="max-w-[100px] relative group rounded-md overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100">
                        <img src={service.image.preview || (typeof service.image === 'string' && service.image.startsWith('/') ? `http://localhost:5000${service.image}` : service.image)} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service Icon</label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-brand-light/5 hover:border-brand-light transition-all text-center cursor-pointer group">
                    <input type="file" onChange={handleIconUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform mb-3">
                      <Upload className="w-6 h-6 text-brand-light" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 block">Click or drag icon to upload</span>
                  </div>
                  {service.icon && (
                    <div className="mt-4 w-16 h-16">
                      <div className="max-w-[100px] relative group rounded-md overflow-hidden border border-slate-200 shadow-sm aspect-square bg-slate-100 p-2">
                        <img src={service.icon.preview || (typeof service.icon === 'string' && service.icon.startsWith('/') ? `http://localhost:5000${service.icon}` : service.icon)} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Content Details */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">4. Content Details</h3>
                <p className="text-sm text-slate-500">Provide a detailed description of the service.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Hire us button link</label>
                  <input name="hireUsLink" value={service.hireUsLink || ''} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. /contact or https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea name="desc" value={service.desc} onChange={handleChange} rows="4" className="input-premium resize-y" placeholder="Service description..."></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 bg-slate-50/50 -mx-8 -mb-8 px-8 py-6">
              <button type="button" onClick={() => navigate('/services')} className="btn-kretoss !bg-none !bg-white !text-slate-600 !border-slate-200 hover:!bg-slate-50 hover:!border-slate-300 mr-4 px-8 py-3 rounded-xl font-semibold shadow-sm transition-all">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn-kretoss px-10 py-3 rounded-xl text-base font-semibold disabled:opacity-50 min-w-[200px]">
                {isLoading ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      ) : servicesList.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-16 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Plus className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No services added yet</h3>
          <p className="text-slate-500 font-medium">Create your first service to offer to your clients.</p>
          <button onClick={handleAddNew} className="btn-kretoss px-6 py-3 rounded-xl mt-4 font-semibold shadow-md">Add Service</button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {servicesList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-3 font-bold text-slate-800">{item.id}</td>
                  <td className="px-6 py-3 font-bold text-slate-800">{item.title}</td>
                  <td className="px-6 py-3 text-slate-500 font-medium truncate max-w-xs">{item.desc}</td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => handleEdit(item)} className="text-brand-light hover:text-brand-dark font-bold mr-5 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-slate-400 hover:text-red-500 font-bold transition-colors">Delete</button>
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
