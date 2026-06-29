import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function HireUs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isFormPage = location.pathname.includes('/hire-us/add') || location.pathname.includes('/hire-us/edit');
  const isEditMode = location.pathname.includes('/hire-us/edit');

  const emptyHireUs = {
    slug: '', category: '', title: '', gigTitle: '',
    tags: [],
    fixedCostDesc: [], hourlyDesc: [],
    seller: { name: '', title: '', rating: 0, reviews: 0, ordersInQueue: 0, avatar: '' },
    aboutGig: {
      title: 'About This Service', paragraphs: [],
      whyChooseUs: { title: 'Why Choose Kretoss Technology?', list: [] },
      services: { title: 'Services:', list: [] },
      note: ''
    },
    reviews: [],
    portfolio: [],
    faqs: []
  };

  const [hireUs, setHireUs] = useState(emptyHireUs);
  const [hireUsList, setHireUsList] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Input states for arrays
  const [tagInput, setTagInput] = useState('');
  const [paragraphsInput, setParagraphsInput] = useState('');
  const [whyChooseUsListInput, setWhyChooseUsListInput] = useState('');
  const [servicesListInput, setServicesListInput] = useState('');
  const [fixedCostInput, setFixedCostInput] = useState('');
  const [hourlyInput, setHourlyInput] = useState('');

  const fetchHireUs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hire-us');
      const data = await response.json();
      if (data.success) {
        setHireUsList(data.data);
      }
    } catch (error) {
      console.error('Error fetching Hire Us:', error);
    }
  };

  useEffect(() => {
    fetchHireUs();
    fetchMenuCategories();
  }, []);

  const fetchMenuCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hire-us-menu');
      const data = await response.json();
      if (data.success && data.data && data.data.categories) {
        setMenuCategories(data.data.categories.map(c => c.title));
      }
    } catch (error) {
      console.error('Error fetching menu categories:', error);
    }
  };

  useEffect(() => {
    if (isEditMode && id && hireUsList.length > 0) {
      const itemToEdit = hireUsList.find(s => s._id === id);
      if (itemToEdit) {
        setHireUs({
          ...emptyHireUs,
          ...itemToEdit
        });
      }
    } else if (!isFormPage) {
      setHireUs(emptyHireUs);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, isEditMode, isFormPage, hireUsList]);

  // Handle generic nested changes
  const handleChange = (e, section = null, subsection = null) => {
    const { name, value } = e.target;
    setHireUs(prev => {
      const updated = { ...prev };
      if (section && subsection) {
        updated[section] = { ...updated[section], [subsection]: { ...updated[section][subsection], [name]: value } };
      } else if (section) {
        updated[section] = { ...updated[section], [name]: value };
      } else {
        updated[name] = value;
        if (name === 'title') {
          updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
      }
      return updated;
    });
  };

  // Image Upload Handlers
  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) setHireUs(prev => ({ ...prev, icon: Object.assign(file, { preview: URL.createObjectURL(file) }) }));
  };

  const handleSellerAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) setHireUs(prev => ({ ...prev, seller: { ...prev.seller, avatar: Object.assign(file, { preview: URL.createObjectURL(file) }) } }));
  };

  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map(f => Object.assign(f, { preview: URL.createObjectURL(f) }));
      setHireUs(prev => ({ ...prev, images: [...(prev.images || []), ...newFiles] }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setHireUs(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== indexToRemove) }));
  };

  const handleArrayImageUpload = (e, arrayName, index, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setHireUs(prev => {
        const updated = { ...prev };
        updated[arrayName][index][fieldName] = Object.assign(file, { preview: URL.createObjectURL(file) });
        return updated;
      });
    }
  };

  // Generic Array Add/Remove for simple strings
  const handleAddArrayItem = (fieldStr, inputValue, setInputValue) => {
    if (inputValue.trim()) {
      setHireUs(prev => {
        const updated = { ...prev };
        let ref = updated;
        const parts = fieldStr.split('.');
        const lastPart = parts.pop();
        for (let p of parts) ref = ref[p];
        ref[lastPart] = [...(ref[lastPart] || []), inputValue.trim()];
        return updated;
      });
      setInputValue('');
    }
  };

  const handleRemoveArrayItem = (fieldStr, indexToRemove) => {
    setHireUs(prev => {
      const updated = { ...prev };
      let ref = updated;
      const parts = fieldStr.split('.');
      const lastPart = parts.pop();
      for (let p of parts) {
        if (!ref[p]) ref[p] = {};
        ref = ref[p];
      }
      ref[lastPart] = ref[lastPart].filter((_, i) => i !== indexToRemove);
      return updated;
    });
  };

  const handleAddNestedArrayItem = (path, value) => {
    if (!value.trim()) return;
    setHireUs(prev => {
      const updated = { ...prev };
      let ref = updated;
      const parts = path.split('.');
      const lastPart = parts.pop();
      for (let p of parts) {
        if (!ref[p]) ref[p] = {};
        ref = ref[p];
      }
      ref[lastPart] = [...(ref[lastPart] || []), value];
      return updated;
    });
  };

  const renderNestedArrayInput = (label, path, inputValue, setInputValue) => {
    let valueList = hireUs;
    for (let p of path.split('.')) {
      valueList = valueList?.[p] || [];
    }

    return (
      <div className="mb-6 bg-slate-50 p-6 rounded-2xl">
        <label className="block text-sm font-semibold text-slate-700 mb-4">{label}</label>
        <div className="space-y-3 mb-4">
          {(valueList || []).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
              <span className="text-slate-800 text-sm whitespace-pre-wrap">{item}</span>
              <button type="button" onClick={() => handleRemoveArrayItem(path, idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <textarea 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder={`Add ${label}...`} 
            className="input-premium flex-1 h-12"
          />
          <button type="button" onClick={() => { handleAddNestedArrayItem(path, inputValue); setInputValue(''); }} className="btn-kretoss px-6 py-2 rounded-xl h-12">
            Add
          </button>
        </div>
      </div>
    );
  };


  // Complex Array Operations (Portfolio, Reviews, FAQs)
  const handleAddComplexItem = (arrayName, emptyObj) => {
    setHireUs(prev => ({ ...prev, [arrayName]: [...(prev[arrayName] || []), emptyObj] }));
  };

  const handleRemoveComplexItem = (arrayName, index) => {
    setHireUs(prev => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));
  };

  const handleComplexItemChange = (e, arrayName, index) => {
    const { name, value } = e.target;
    setHireUs(prev => {
      const updated = { ...prev };
      updated[arrayName][index][name] = value;
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      const payload = JSON.parse(JSON.stringify(hireUs));

      const simpleFields = ['title', 'slug', 'category', 'gigTitle'];
      simpleFields.forEach(field => {
        if (payload[field]) formData.append(field, payload[field]);
      });

      // Handle Icon
      if (hireUs.icon && typeof hireUs.icon !== 'string' && hireUs.icon.name) {
        formData.append('icon', hireUs.icon);
      } else if (typeof hireUs.icon === 'string') {
        formData.append('icon', hireUs.icon);
      }

      // Handle Main Images
      if (hireUs.images && Array.isArray(hireUs.images)) {
        const stringImages = [];
        hireUs.images.forEach(img => {
          if (typeof img !== 'string' && img.name) {
            formData.append('images', img);
          } else if (typeof img === 'string') {
            stringImages.push(img);
          }
        });
        if (stringImages.length > 0) {
          payload.images = stringImages;
        } else {
          payload.images = [];
        }
      }

      // Handle Seller Avatar
      if (hireUs.seller && hireUs.seller.avatar && typeof hireUs.seller.avatar !== 'string' && hireUs.seller.avatar.name) {
        formData.append('seller_avatar', hireUs.seller.avatar);
        delete payload.seller.avatar;
      }

      // Handle Portfolio Images
      if (hireUs.portfolio && Array.isArray(hireUs.portfolio)) {
        hireUs.portfolio.forEach((item, index) => {
          if (item.image && typeof item.image !== 'string' && item.image.name) {
            formData.append(`portfolio_image_${index}`, item.image);
            delete payload.portfolio[index].image;
          }
        });
      }

      // Handle Review Avatars
      if (hireUs.reviews && Array.isArray(hireUs.reviews)) {
        hireUs.reviews.forEach((item, index) => {
          if (item.avatar && typeof item.avatar !== 'string' && item.avatar.name) {
            formData.append(`review_avatar_${index}`, item.avatar);
            delete payload.reviews[index].avatar;
          }
        });
      }

      // JSON Fields
      const jsonFields = ['seller', 'aboutGig', 'reviews', 'portfolio', 'tags', 'faqs', 'images'];
      jsonFields.forEach(field => {
        if (payload[field]) formData.append(field, JSON.stringify(payload[field]));
      });

      const url = hireUs._id ? `http://localhost:5000/api/hire-us/${hireUs._id}` : `http://localhost:5000/api/hire-us`;
      const method = hireUs._id ? 'PUT' : 'POST';
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Hire Us profile updated successfully!' : 'Hire Us profile created successfully!');
        fetchHireUs();
        navigate('/hire-us');
      } else {
        const errorData = await response.json();
        toast.error('Failed to save: ' + errorData.message);
      }
    } catch (error) {
      toast.error('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (dbId) => {
    if (!window.confirm("Are you sure you want to delete this Hire Us page?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/hire-us/${dbId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchHireUs();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  // UI rendering helper for simple string Arrays
  const renderArrayInput = (title, fieldPath, inputValue, setInputValue) => {
    let arr = hireUs;
    const parts = fieldPath.split('.');
    for (let p of parts) { arr = arr ? arr[p] : []; }
    arr = arr || [];

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">{title}</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {arr.map((item, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-light/10 text-brand-dark font-medium">
              {item}
              <button type="button" onClick={() => handleRemoveArrayItem(fieldPath, index)} className="ml-2 hover:text-red-500"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddArrayItem(fieldPath, inputValue, setInputValue); } }} className="input-premium flex-1" placeholder={`Add ${title}...`} />
          <button type="button" onClick={() => handleAddArrayItem(fieldPath, inputValue, setInputValue)} className="btn-kretoss px-6 py-2 rounded-xl font-semibold">Add</button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {!isFormPage && (
        <div className="flex justify-between items-end pb-6 border-b-2 border-slate-200/50 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hire Us Pages</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Manage Hire Dedicated Developer pages.</p>
          </div>
          <button onClick={() => navigate('/hire-us/add')} className="btn-kretoss px-6 py-3 rounded-xl text-sm font-semibold flex items-center shadow-md transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4 mr-2" /> Add New Page
          </button>
        </div>
      )}

      {isFormPage ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-6 flex items-center gap-4">
            <button type="button" onClick={() => navigate('/hire-us')} className="p-2 hover:bg-slate-200/60 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{hireUs._id ? 'Edit Hire Us Page' : 'Create Hire Us Page'}</h2>
              <p className="text-sm text-slate-500 mt-1">Fill in the details below to {hireUs._id ? 'update this' : 'add a new'} Hire Us page.</p>
            </div>
          </div>

          <form className="p-8 space-y-12" onSubmit={handleSave}>
            
            {/* Section 1: Basic Info */}
            <div className="space-y-6 border-b border-slate-100 pb-8">
              <h3 className="text-xl font-bold text-slate-800">1. Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input name="title" value={hireUs.title} onChange={handleChange} required type="text" className="input-premium" placeholder="e.g. Hire Android Developers" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                  <input name="slug" value={hireUs.slug} onChange={handleChange} required type="text" className="input-premium bg-slate-100/50" placeholder="e.g. hire-android-developers" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select name="category" value={hireUs.category} onChange={handleChange} required className="input-premium">
                    <option value="" disabled>Select Category</option>
                    {menuCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Gig Title</label>
                  <input name="gigTitle" value={hireUs.gigTitle} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. Hire Dedicated Developer..." />
                </div>
              </div>
            </div>

            {/* Section 2: Developer (Seller) */}
            <div className="space-y-6 border-b border-slate-100 pb-8">
              <h3 className="text-xl font-bold text-slate-800">2. Developer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input name="name" value={hireUs.seller?.name || ''} onChange={(e) => handleChange(e, 'seller')} type="text" className="input-premium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input name="title" value={hireUs.seller?.title || ''} onChange={(e) => handleChange(e, 'seller')} type="text" className="input-premium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Avatar Upload</label>
                  <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" onChange={handleSellerAvatarUpload} className="hidden" id="seller-avatar" />
                    <label htmlFor="seller-avatar" className="btn-kretoss px-4 py-2 rounded-lg cursor-pointer flex items-center text-sm">
                      <Upload className="w-4 h-4 mr-2" /> Avatar
                    </label>
                    {hireUs.seller?.avatar && (
                      <img src={typeof hireUs.seller.avatar === 'string' ? `http://localhost:5000${hireUs.seller.avatar}` : hireUs.seller.avatar.preview} alt="Avatar" className="h-10 w-10 object-cover rounded-full border shadow-sm" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rating (0-5)</label>
                  <input name="rating" value={hireUs.seller?.rating || ''} onChange={(e) => handleChange(e, 'seller')} type="number" step="0.1" className="input-premium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Total Reviews</label>
                  <input name="reviews" value={hireUs.seller?.reviews || ''} onChange={(e) => handleChange(e, 'seller')} type="number" className="input-premium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Orders In Queue</label>
                  <input name="ordersInQueue" value={hireUs.seller?.ordersInQueue || ''} onChange={(e) => handleChange(e, 'seller')} type="number" className="input-premium" />
                </div>
              </div>
            </div>

            {/* Section 3: Portfolio */}
            <div className="space-y-6 border-b border-slate-100 pb-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">3. Portfolio</h3>
                <button type="button" onClick={() => handleAddComplexItem('portfolio', { title: '', date: '', description: '', link: '', techStack: '', timeline: '', cost: '', country: '', category: '', slug: '', image: '' })} className="btn-kretoss px-4 py-2 rounded-xl text-sm"><Plus className="w-4 h-4 inline mr-1" /> Add Project</button>
              </div>
              <div className="space-y-6">
                {(hireUs.portfolio || []).map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl relative border border-slate-100">
                    <button type="button" onClick={() => handleRemoveComplexItem('portfolio', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Project Title</label>
                        <input name="title" value={item.title} onChange={(e) => handleComplexItemChange(e, 'portfolio', idx)} type="text" className="input-premium" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                        <input name="date" value={item.date} onChange={(e) => handleComplexItemChange(e, 'portfolio', idx)} type="text" className="input-premium" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea name="description" value={item.description} onChange={(e) => handleComplexItemChange(e, 'portfolio', idx)} className="input-premium h-20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Tech Stack</label>
                        <input name="techStack" value={item.techStack} onChange={(e) => handleComplexItemChange(e, 'portfolio', idx)} type="text" className="input-premium" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Link</label>
                        <input name="link" value={item.link} onChange={(e) => handleComplexItemChange(e, 'portfolio', idx)} type="text" className="input-premium" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Timeline</label>
                        <input name="timeline" value={item.timeline} onChange={(e) => handleComplexItemChange(e, 'portfolio', idx)} type="text" className="input-premium" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
                        <input name="country" value={item.country} onChange={(e) => handleComplexItemChange(e, 'portfolio', idx)} type="text" className="input-premium" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Project Image Upload</label>
                        <div className="flex items-center gap-4">
                          <input type="file" accept="image/*" onChange={(e) => handleArrayImageUpload(e, 'portfolio', idx, 'image')} className="hidden" id={`portfolio-img-${idx}`} />
                          <label htmlFor={`portfolio-img-${idx}`} className="btn-kretoss px-4 py-2 rounded-lg cursor-pointer flex items-center text-sm">
                            <Upload className="w-4 h-4 mr-2" /> Upload Image
                          </label>
                          {item.image && (
                            <img src={typeof item.image === 'string' ? `http://localhost:5000${item.image}` : item.image.preview} alt="Portfolio" className="h-12 w-20 object-cover rounded-md border" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: About Gig */}
            <div className="space-y-6 border-b border-slate-100 pb-8">
              <h3 className="text-xl font-bold text-slate-800">4. About This Service</h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Section Title</label>
                <input name="title" value={hireUs.aboutGig.title || 'About This Service'} onChange={(e) => handleChange(e, 'aboutGig')} type="text" className="input-premium" />
              </div>

              {renderNestedArrayInput('Paragraphs (Supports HTML)', 'aboutGig.paragraphs', paragraphsInput, setParagraphsInput)}

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-lg font-bold text-slate-800 mb-4">Why Choose Kretoss Technology?</h4>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">List Title</label>
                  <input value={hireUs.aboutGig.whyChooseUs?.title || 'Why Choose Kretoss Technology?'} onChange={(e) => setHireUs(prev => ({...prev, aboutGig: {...prev.aboutGig, whyChooseUs: {...prev.aboutGig.whyChooseUs, title: e.target.value}}}))} type="text" className="input-premium bg-white" />
                </div>
                {renderNestedArrayInput('List Items', 'aboutGig.whyChooseUs.list', whyChooseUsListInput, setWhyChooseUsListInput)}
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-lg font-bold text-slate-800 mb-4">Services</h4>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">List Title</label>
                  <input value={hireUs.aboutGig.services?.title || 'Services:'} onChange={(e) => setHireUs(prev => ({...prev, aboutGig: {...prev.aboutGig, services: {...prev.aboutGig.services, title: e.target.value}}}))} type="text" className="input-premium bg-white" />
                </div>
                {renderNestedArrayInput('List Items', 'aboutGig.services.list', servicesListInput, setServicesListInput)}
              </div>

            </div>



            {/* Section 5: Client Reviews */}
            <div className="space-y-6 border-b border-slate-100 pb-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">5. Client Reviews</h3>
                <button type="button" onClick={() => handleAddComplexItem('reviews', { name: '', country: '', rating: 5, date: '', comment: '', avatar: '' })} className="btn-kretoss px-4 py-2 rounded-xl text-sm"><Plus className="w-4 h-4 inline mr-1" /> Add Review</button>
              </div>
              <div className="space-y-6">
                {(hireUs.reviews || []).map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl relative border border-slate-100">
                    <button type="button" onClick={() => handleRemoveComplexItem('reviews', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Client Name</label>
                        <input name="name" value={item.name} onChange={(e) => handleComplexItemChange(e, 'reviews', idx)} type="text" className="input-premium" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
                        <input name="country" value={item.country} onChange={(e) => handleComplexItemChange(e, 'reviews', idx)} type="text" className="input-premium" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Comment</label>
                        <textarea name="comment" value={item.comment} onChange={(e) => handleComplexItemChange(e, 'reviews', idx)} className="input-premium h-20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Rating (0-5)</label>
                        <input name="rating" value={item.rating} onChange={(e) => handleComplexItemChange(e, 'reviews', idx)} type="number" step="0.1" className="input-premium" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                        <input name="date" value={item.date} onChange={(e) => handleComplexItemChange(e, 'reviews', idx)} type="text" className="input-premium" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Client Avatar Upload</label>
                        <div className="flex items-center gap-4">
                          <input type="file" accept="image/*" onChange={(e) => handleArrayImageUpload(e, 'reviews', idx, 'avatar')} className="hidden" id={`review-img-${idx}`} />
                          <label htmlFor={`review-img-${idx}`} className="btn-kretoss px-4 py-2 rounded-lg cursor-pointer flex items-center text-sm">
                            <Upload className="w-4 h-4 mr-2" /> Upload Avatar
                          </label>
                          {item.avatar && (
                            <img src={typeof item.avatar === 'string' ? `http://localhost:5000${item.avatar}` : item.avatar.preview} alt="Review Avatar" className="h-10 w-10 object-cover rounded-full border shadow-sm" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: FAQs */}
            <div className="space-y-6 pb-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">6. FAQs</h3>
                <button type="button" onClick={() => handleAddComplexItem('faqs', { question: '', answer: '' })} className="btn-kretoss px-4 py-2 rounded-xl text-sm"><Plus className="w-4 h-4 inline mr-1" /> Add FAQ</button>
              </div>
              <div className="space-y-4">
                {(hireUs.faqs || []).map((faq, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl relative border border-slate-100 flex flex-col gap-4">
                    <button type="button" onClick={() => handleRemoveComplexItem('faqs', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Question</label>
                      <input name="question" value={faq.question} onChange={(e) => handleComplexItemChange(e, 'faqs', idx)} type="text" className="input-premium pr-10" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Answer</label>
                      <textarea name="answer" value={faq.answer} onChange={(e) => handleComplexItemChange(e, 'faqs', idx)} className="input-premium h-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7: Related Tags */}
            <div className="space-y-6 pb-8 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">7. Related Tags</h3>
              {renderArrayInput('Tags', 'tags', tagInput, setTagInput)}
            </div>

            {/* Section 8: Call to Action Boxes */}
            <div className="space-y-6 pb-8 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">8. Call to Action Boxes (Right Sidebar)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="text-md font-bold text-slate-800 mb-4">Hire Fixed Cost Project Developer</h4>
                  {renderArrayInput('Paragraphs (Supports HTML)', 'fixedCostDesc', fixedCostInput, setFixedCostInput)}
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="text-md font-bold text-slate-800 mb-4">Hire Hourly Basis / Flexible Developer</h4>
                  {renderArrayInput('Paragraphs (Supports HTML)', 'hourlyDesc', hourlyInput, setHourlyInput)}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
               <button type="submit" disabled={isLoading} className="btn-kretoss px-8 py-3 rounded-xl font-bold text-lg whitespace-nowrap shadow-[0_4px_20px_rgba(0,55,240,0.3)] transition-all hover:scale-105">
                 {isLoading ? 'Saving...' : 'Save Hire Us Page'}
               </button>
            </div>

          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Title / Slug</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Seller Name</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {hireUsList.length === 0 ? (
                   <tr><td colSpan="4" className="py-8 text-center text-slate-500">No Hire Us pages found.</td></tr>
                ) : hireUsList.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.slug}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{item.category}</td>
                    <td className="py-4 px-6 text-slate-600">{item.seller?.name}</td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => navigate(`/hire-us/edit/${item._id}`)} className="text-blue-500 hover:text-blue-700 font-semibold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mr-2">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
