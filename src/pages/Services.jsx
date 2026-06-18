import React, { useState, useEffect } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function Services() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isFormPage = location.pathname.includes('/services/add') || location.pathname.includes('/services/edit');
  const isEditMode = location.pathname.includes('/services/edit');

  const emptyService = { id: '', title: '', slug: '', desc: '', image: null, icon: null, tags: [] };
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
  }, [id, isEditMode, isFormPage]);

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
      
      const textFields = ['id', 'title', 'slug', 'desc'];
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
        navigate('/services');
      } else {
        const errorData = await response.json();
        console.error('Failed to save:', errorData.message);
        alert('Failed to save: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Services</h1>
        <button 
          onClick={isFormPage ? () => navigate('/services') : handleAddNew}
          className="btn-kretoss px-4 py-2 rounded-md font-medium flex items-center"
        >
          {isFormPage ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {isFormPage ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {isFormPage ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">{service.id ? 'Edit Service' : 'Create New Service'}</h2>
          <form className="space-y-6" onSubmit={handleSaveService}>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input name="slug" value={service.slug} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. cloud-solutions" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (e.g. React.js, Angular)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {service.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-light/10 text-brand-dark">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(index)} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(e); }} className="flex-1 border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. React.js" />
                  <button type="button" onClick={handleAddTag} className="btn-kretoss px-4 py-2 rounded-md font-medium">Add Tag</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Main Image</label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                  <input type="file" onChange={handleImageUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Click or drag image to upload</span>
                </div>
                {service.image && (
                  <div className="mt-4 w-full">
                    <div className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100">
                      <img src={service.image.preview || (typeof service.image === 'string' && service.image.startsWith('/') ? `http://localhost:5000${service.image}` : service.image)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Service Icon</label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                  <input type="file" onChange={handleIconUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Click or drag icon to upload</span>
                </div>
                {service.icon && (
                  <div className="mt-4 w-16 h-16">
                    <div className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-square bg-slate-100 p-2">
                      <img src={service.icon.preview || (typeof service.icon === 'string' && service.icon.startsWith('/') ? `http://localhost:5000${service.icon}` : service.icon)} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="desc" value={service.desc} onChange={handleChange} rows="3" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Service description..."></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isLoading} className="btn-kretoss px-6 py-2 rounded-md font-medium disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      ) : servicesList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="text-slate-400">
            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium text-slate-600">No services added yet</p>
          </div>
          <button onClick={handleAddNew} className="btn-kretoss px-4 py-2 rounded-md mt-2 font-medium">Add Service</button>
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
              {servicesList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.id}</td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{item.desc}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(item)} className="text-brand-light hover:text-brand-dark font-medium mr-4">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
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
