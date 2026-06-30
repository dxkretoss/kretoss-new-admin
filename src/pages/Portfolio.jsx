import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, ArrowLeft, Trash2, GripVertical, Eye } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Portfolio() {

  const emptyPortfolio = {
    title: '', slug: '', category: 'Custom web', timeline: '', country: '', link: '', client: '',
    appLinks: { android: '', ios: '' },
    tags: [], techStack: [], images: [], thumbnailImage: null, description: '',
    
    overviewTitle: 'About the Project', overviewDescriptions: [], coreCapabilities: [],
    challengeTitle: 'What Problem Were We Solving?', challengeQuote: '', challengeDescription: '', challengeCards: [],
    processTitle: 'How We Built the Solution', processDescription: '', processSteps: [],
    resultsTitle: '', resultsDescription: '', resultsCheckpoints: [], resultsCards: [],
    feedbackImage: null, feedbackName: '', feedbackRole: '', feedbackRating: 5, feedbackDate: '', feedbackDescription: ''
  };

  // Single portfolio state
  const [portfolio, setPortfolio] = useState(emptyPortfolio);
  const [portfoliosList, setPortfoliosList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Drag and drop states
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);
  
  // Delete confirmation states
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Image preview modal state
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;
  const BACKEND_URL = API_URL.replace('/api', '');

  const isFormPage = location.pathname.includes('/portfolios/add') || location.pathname.includes('/portfolios/edit');
  const isEditMode = location.pathname.includes('/portfolios/edit');

  const fetchPortfolios = async () => {
    try {
      const response = await fetch(`${API_URL}/portfolios`);
      const data = await response.json();
      if (data.success) {
        setPortfoliosList(data.data);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/portfolio-categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchPortfolios();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && id && portfoliosList.length > 0) {
      const itemToEdit = portfoliosList.find(p => p._id === id);
      if (itemToEdit) {
        const parseJsonField = (fieldData) => {
          if (Array.isArray(fieldData)) return fieldData;
          if (typeof fieldData === 'string') {
            try { return JSON.parse(fieldData); } catch (e) { return fieldData ? [fieldData] : []; }
          }
          return [];
        };

        setPortfolio({
          ...emptyPortfolio,
          ...itemToEdit,
          appLinks: itemToEdit.appLinks || { android: '', ios: '' },
          overviewDescriptions: parseJsonField(itemToEdit.overviewDescriptions),
          coreCapabilities: parseJsonField(itemToEdit.coreCapabilities),
          challengeCards: parseJsonField(itemToEdit.challengeCards),
          processSteps: parseJsonField(itemToEdit.processSteps),
          resultsCheckpoints: parseJsonField(itemToEdit.resultsCheckpoints),
          resultsCards: parseJsonField(itemToEdit.resultsCards)
        });
      }
    } else if (!isFormPage) {
      setPortfolio(emptyPortfolio);
      setTagInput('');
      setTechInput('');
    }
  }, [id, isEditMode, portfoliosList, isFormPage]);

  const handleAddNew = () => {
    navigate('/portfolios/add');
  };

  const handleEdit = (item) => {
    navigate(`/portfolios/edit/${item._id}`);
  };

  const confirmDelete = (id) => {
    setPortfolioToDelete(id);
  };

  const handleDelete = async () => {
    if (!portfolioToDelete) return;
    try {
      const response = await fetch(`${API_URL}/portfolios/${portfolioToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPortfolios();
        setPortfolioToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };


  // Inputs for tags and tech stack (these remain separate as they are just UI helpers, not final data)
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolio(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPortfolio(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    // reset input
    e.target.value = null;
  };

  const handleRemoveImage = (indexToRemove) => {
    setPortfolio(prev => {
      const newImages = [...prev.images];
      URL.revokeObjectURL(newImages[indexToRemove].preview);
      newImages.splice(indexToRemove, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPortfolio(prev => ({
      ...prev,
      thumbnailImage: {
        file,
        preview: URL.createObjectURL(file)
      }
    }));
    e.target.value = null;
  };

  const handleRemoveThumbnail = () => {
    setPortfolio(prev => {
      if (prev.thumbnailImage && prev.thumbnailImage.preview) {
        URL.revokeObjectURL(prev.thumbnailImage.preview);
      }
      return { ...prev, thumbnailImage: null };
    });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setPortfolio(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setPortfolio(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      setPortfolio(prev => ({ ...prev, techStack: [...prev.techStack, techInput.trim()] }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (indexToRemove) => {
    setPortfolio(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, index) => index !== indexToRemove)
    }));
  };



  const handleArrayStringChange = (field, index, value) => {
    setPortfolio(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleArrayStringAdd = (field) => {
    setPortfolio(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleArrayStringRemove = (field, index) => {
    setPortfolio(prev => {
      const arr = [...prev[field]];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleArrayObjectChange = (field, index, key, value) => {
    setPortfolio(prev => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const handleArrayObjectAdd = (field, defaultObj) => {
    setPortfolio(prev => ({ ...prev, [field]: [...prev[field], defaultObj] }));
  };

  const handleArrayObjectRemove = (field, index) => {
    setPortfolio(prev => {
      const arr = [...prev[field]];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleFeedbackImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPortfolio(prev => ({
      ...prev,
      feedbackImage: {
        file,
        preview: URL.createObjectURL(file)
      }
    }));
    e.target.value = null;
  };

  const handleRemoveFeedbackImage = () => {
    setPortfolio(prev => {
      if (prev.feedbackImage && prev.feedbackImage.preview) {
        URL.revokeObjectURL(prev.feedbackImage.preview);
      }
      return { ...prev, feedbackImage: null };
    });
  };

  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append text fields
      const textFields = [
        'title', 'slug', 'category', 'timeline', 'country', 'link', 'client', 'description',
        'overviewTitle', 'challengeTitle', 'challengeQuote', 'challengeDescription',
        'processTitle', 'processDescription', 'resultsTitle', 'resultsDescription',
        'feedbackName', 'feedbackRole', 'feedbackRating', 'feedbackDate', 'feedbackDescription'
      ];
      textFields.forEach(field => {
        if (portfolio[field]) formData.append(field, portfolio[field]);
      });

      // Append array fields
      const jsonFields = [
        'tags', 'techStack', 'appLinks',
        'overviewDescriptions', 'coreCapabilities', 'challengeCards',
        'processSteps', 'resultsCheckpoints', 'resultsCards'
      ];
      jsonFields.forEach(field => {
        formData.append(field, JSON.stringify(portfolio[field]));
      });

      // Append files
      if (portfolio.thumbnailImage && portfolio.thumbnailImage.file) {
        formData.append('thumbnailImage', portfolio.thumbnailImage.file);
      }
      
      if (portfolio.feedbackImage && portfolio.feedbackImage.file) {
        formData.append('feedbackImage', portfolio.feedbackImage.file);
      }

      if (portfolio.images && portfolio.images.length > 0) {
        portfolio.images.forEach(img => {
          if (img.file) {
            formData.append('images', img.file);
          }
        });
      }

      const url = portfolio._id
        ? `${API_URL}/portfolios/${portfolio._id}`
        : `${API_URL}/portfolios`;

      const method = portfolio._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Portfolio updated successfully!' : 'Portfolio created successfully!');
        fetchPortfolios();
        navigate('/portfolios');
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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await fetch(`${API_URL}/portfolio-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Category added successfully!');
        setNewCategoryName('');
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const confirmDeleteCategory = (id) => {
    setCategoryToDelete(id);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const response = await fetch(`${API_URL}/portfolio-categories/${categoryToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchCategories();
        setCategoryToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target && e.target.classList) {
        e.target.classList.add('opacity-50');
      }
    }, 0);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newCategories = [...categories];
    const draggedItem = newCategories[draggedItemIndex];
    newCategories.splice(draggedItemIndex, 1);
    newCategories.splice(index, 0, draggedItem);
    
    setCategories(newCategories);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = async (e) => {
    if (e.target && e.target.classList) {
      e.target.classList.remove('opacity-50');
    }
    setDraggedItemIndex(null);
    
    try {
      const order = categories.map(cat => cat._id);
      const response = await fetch(`${API_URL}/portfolio-categories/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order })
      });
      if (!response.ok) {
        toast.error('Failed to save category order');
        fetchCategories(); // revert to backend state
      }
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast.error('Failed to save category order');
      fetchCategories();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {!isFormPage && (
        <div className="flex justify-between items-end pb-6 border-b-2 border-slate-200/50 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Portfolios</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Manage and organize your portfolio projects.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="btn-kretoss-outline px-6 py-3 rounded-xl text-sm font-semibold flex items-center shadow-sm transition-all border-2 border-slate-200 hover:border-slate-300"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </button>
            <button
              onClick={handleAddNew}
              className="btn-kretoss px-6 py-3 rounded-xl text-sm font-semibold flex items-center shadow-md transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Portfolio
            </button>
          </div>
        </div>
      )}

      {isFormPage ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-6 flex items-center gap-4">
            <button type="button" onClick={() => navigate('/portfolios')} className="p-2 hover:bg-slate-200/60 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{portfolio.slug ? 'Edit Portfolio' : 'Create New Portfolio'}</h2>
              <p className="text-sm text-slate-500 mt-1">Fill in the details below to {portfolio.slug ? 'update this' : 'add a new'} portfolio item.</p>
            </div>
          </div>
          <form className="p-8 space-y-12" onSubmit={handleSavePortfolio}>

            {/* Section: Basic Information */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">1. Basic Information</h3>
                <p className="text-sm text-slate-500">General details about the project.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input name="title" value={portfolio.title} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. Guestway" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                  <input name="slug" value={portfolio.slug} onChange={handleChange} type="text" className="input-premium bg-slate-100/50" placeholder="e.g. guestway" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    name="category"
                    className="input-premium cursor-pointer"
                    value={portfolio.category}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Timeline</label>
                  <input name="timeline" value={portfolio.timeline} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. 2-4 Months" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                  <input name="country" value={portfolio.country} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. United States" />
                </div>
                {portfolio.category === 'Mobile app' ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">iOS Link</label>
                      <input
                        name="iosLink"
                        value={portfolio.appLinks.ios}
                        onChange={(e) => setPortfolio(prev => ({ ...prev, appLinks: { ...prev.appLinks, ios: e.target.value } }))}
                        type="url"
                        className="input-premium"
                        placeholder="https://apps.apple.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Android Link</label>
                      <input
                        name="androidLink"
                        value={portfolio.appLinks.android}
                        onChange={(e) => setPortfolio(prev => ({ ...prev, appLinks: { ...prev.appLinks, android: e.target.value } }))}
                        type="url"
                        className="input-premium"
                        placeholder="https://play.google.com/..."
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Link</label>
                    <input name="link" value={portfolio.link} onChange={handleChange} type="url" className="input-premium" placeholder="https://..." />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Client</label>
                  <input name="client" value={portfolio.client} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. John Doe" />
                </div>
              </div>
            </div>

            {/* Section: Technologies & Tags */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">2. Technologies & Categorization</h3>
                <p className="text-sm text-slate-500">Skills, tags, and technologies used.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tags Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (Press Enter to add)</label>
                  <div className="w-full border border-slate-200 bg-slate-50 rounded-xl p-2.5 flex flex-wrap gap-2 focus-within:border-brand-light focus-within:ring-4 focus-within:ring-brand-light/10 focus-within:bg-white transition-all">
                    {portfolio.tags.map((tag, index) => (
                      <span key={index} className="bg-brand-light/10 text-brand-dark px-3 py-1.5 rounded-lg text-sm flex items-center font-medium">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(index)} className="ml-2 hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="flex-1 outline-none min-w-[120px] bg-transparent px-2"
                      placeholder={portfolio.tags.length === 0 ? "Add a tag (e.g. UI/UX)" : ""}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>
                </div>

                {/* Tech Stack Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tech Stack (Press Enter to add)</label>
                  <div className="w-full border border-slate-200 bg-slate-50 rounded-xl p-2.5 flex flex-wrap gap-2 focus-within:border-brand-light focus-within:ring-4 focus-within:ring-brand-light/10 focus-within:bg-white transition-all">
                    {portfolio.techStack.map((tech, index) => (
                      <span key={index} className="bg-slate-200/50 text-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center font-medium">
                        {tech}
                        <button type="button" onClick={() => handleRemoveTech(index)} className="ml-2 hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="flex-1 outline-none min-w-[120px] bg-transparent px-2"
                      placeholder={portfolio.techStack.length === 0 ? "Add tech stack (e.g. React)" : ""}
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={handleAddTech}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Project Content */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">3. Project Content</h3>
                <p className="text-sm text-slate-500">Detailed descriptions and challenges.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Textareas */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea name="description" value={portfolio.description} onChange={handleChange} rows="3" className="input-premium resize-y" placeholder="Enter description"></textarea>
                </div>



                {/* -------------------- NEW CASE STUDY SECTIONS -------------------- */}
                
                {/* Section: Overview */}
                <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-4">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">4. Overview (About the Project)</h3>
                  <p className="text-sm text-slate-500 mb-6">Detailed overview descriptions and core capabilities.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Overview Title</label>
                      <input name="overviewTitle" value={portfolio.overviewTitle} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. About the Project" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Overview Descriptions</label>
                      <div className="space-y-4">
                        {portfolio.overviewDescriptions.map((desc, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <textarea
                              value={desc}
                              onChange={(e) => handleArrayStringChange('overviewDescriptions', index, e.target.value)}
                              rows="3"
                              className="input-premium resize-y"
                              placeholder="Enter paragraph"
                            />
                            <button type="button" onClick={() => handleArrayStringRemove('overviewDescriptions', index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all border border-red-100">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleArrayStringAdd('overviewDescriptions')} className="flex items-center text-brand-dark hover:text-brand-light bg-brand-light/5 hover:bg-brand-light/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-fit">
                          <Plus className="w-4 h-4 mr-2" /> Add Description
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Core Capabilities</label>
                      <div className="space-y-4">
                        {portfolio.coreCapabilities.map((cap, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={cap}
                              onChange={(e) => handleArrayStringChange('coreCapabilities', index, e.target.value)}
                              className="input-premium"
                              placeholder="e.g. Scalable Architecture"
                            />
                            <button type="button" onClick={() => handleArrayStringRemove('coreCapabilities', index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all flex-shrink-0 border border-red-100">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleArrayStringAdd('coreCapabilities')} className="flex items-center text-brand-dark hover:text-brand-light bg-brand-light/5 hover:bg-brand-light/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-fit">
                          <Plus className="w-4 h-4 mr-2" /> Add Capability
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: The Challenge */}
                <div className="md:col-span-2 border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">5. The Challenge</h3>
                  <div className="space-y-6 mt-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Challenge Title</label>
                      <input name="challengeTitle" value={portfolio.challengeTitle} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. What Problem Were We Solving?" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Challenge Quote (Italicized Text)</label>
                      <textarea name="challengeQuote" value={portfolio.challengeQuote} onChange={handleChange} rows="2" className="input-premium resize-y" placeholder={`e.g. "The client needed a robust Angular + Node.js architecture..."`}></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Challenge Description</label>
                      <textarea name="challengeDescription" value={portfolio.challengeDescription} onChange={handleChange} rows="3" className="input-premium resize-y" placeholder="Enter main challenge description"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Challenge Cards</label>
                      <div className="space-y-4">
                        {portfolio.challengeCards.map((card, index) => (
                          <div key={index} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex-1 space-y-3">
                              <div className="flex gap-3">
                                <input type="text" value={card.number || ''} onChange={(e) => handleArrayObjectChange('challengeCards', index, 'number', e.target.value)} className="input-premium w-20" placeholder="01" />
                                <input type="text" value={card.title || ''} onChange={(e) => handleArrayObjectChange('challengeCards', index, 'title', e.target.value)} className="input-premium flex-1" placeholder="Title (e.g. Scalability Gaps)" />
                              </div>
                              <textarea value={card.description || ''} onChange={(e) => handleArrayObjectChange('challengeCards', index, 'description', e.target.value)} rows="2" className="input-premium resize-y" placeholder="Card description" />
                            </div>
                            <button type="button" onClick={() => handleArrayObjectRemove('challengeCards', index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all border border-red-100">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleArrayObjectAdd('challengeCards', { number: '', title: '', description: '' })} className="flex items-center text-brand-dark hover:text-brand-light bg-brand-light/5 hover:bg-brand-light/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-fit">
                          <Plus className="w-4 h-4 mr-2" /> Add Challenge Card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Our Process */}
                <div className="md:col-span-2 border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">6. Our Process</h3>
                  <div className="space-y-6 mt-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Process Title</label>
                      <input name="processTitle" value={portfolio.processTitle} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. How We Built the Solution" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Process Overview Description</label>
                      <textarea name="processDescription" value={portfolio.processDescription} onChange={handleChange} rows="2" className="input-premium resize-y" placeholder="Our engagement followed a structured approach..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Process Steps</label>
                      <div className="space-y-4">
                        {portfolio.processSteps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex-1 space-y-3">
                              <div className="flex gap-3">
                                <input type="text" value={step.stepNumber || ''} onChange={(e) => handleArrayObjectChange('processSteps', index, 'stepNumber', e.target.value)} className="input-premium w-20" placeholder="01" />
                                <input type="text" value={step.title || ''} onChange={(e) => handleArrayObjectChange('processSteps', index, 'title', e.target.value)} className="input-premium flex-1" placeholder="Title (e.g. Discovery & Strategy)" />
                              </div>
                              <textarea value={step.description || ''} onChange={(e) => handleArrayObjectChange('processSteps', index, 'description', e.target.value)} rows="2" className="input-premium resize-y" placeholder="Step description" />
                            </div>
                            <button type="button" onClick={() => handleArrayObjectRemove('processSteps', index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all border border-red-100">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleArrayObjectAdd('processSteps', { stepNumber: '', title: '', description: '' })} className="flex items-center text-brand-dark hover:text-brand-light bg-brand-light/5 hover:bg-brand-light/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-fit">
                          <Plus className="w-4 h-4 mr-2" /> Add Process Step
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Results & Impact */}
                <div className="md:col-span-2 border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">7. Results & Impact</h3>
                  <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Results Title</label>
                        <input name="resultsTitle" value={portfolio.resultsTitle} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. Measurable Outcomes Delivered" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Results Description</label>
                        <textarea name="resultsDescription" value={portfolio.resultsDescription} onChange={handleChange} rows="2" className="input-premium resize-y" placeholder="Description..."></textarea>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Result Checkpoints</label>
                      <div className="space-y-4">
                        {portfolio.resultsCheckpoints.map((cp, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input type="text" value={cp} onChange={(e) => handleArrayStringChange('resultsCheckpoints', index, e.target.value)} className="input-premium" placeholder="e.g. 40% reduction in data processing time" />
                            <button type="button" onClick={() => handleArrayStringRemove('resultsCheckpoints', index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all flex-shrink-0 border border-red-100">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleArrayStringAdd('resultsCheckpoints')} className="flex items-center text-brand-dark hover:text-brand-light bg-brand-light/5 hover:bg-brand-light/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-fit">
                          <Plus className="w-4 h-4 mr-2" /> Add Checkpoint
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Result Cards (Blue boxes)</label>
                      <div className="space-y-4">
                        {portfolio.resultsCards.map((card, index) => (
                          <div key={index} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex-1 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <input type="text" value={card.value || ''} onChange={(e) => handleArrayObjectChange('resultsCards', index, 'value', e.target.value)} className="input-premium" placeholder="Value (e.g. +142%)" />
                                <input type="text" value={card.title || ''} onChange={(e) => handleArrayObjectChange('resultsCards', index, 'title', e.target.value)} className="input-premium" placeholder="Title (e.g. Conversion Lift)" />
                              </div>
                              <textarea value={card.description || ''} onChange={(e) => handleArrayObjectChange('resultsCards', index, 'description', e.target.value)} rows="2" className="input-premium resize-y" placeholder="Card description" />
                            </div>
                            <button type="button" onClick={() => handleArrayObjectRemove('resultsCards', index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all border border-red-100">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleArrayObjectAdd('resultsCards', { value: '', title: '', description: '' })} className="flex items-center text-brand-dark hover:text-brand-light bg-brand-light/5 hover:bg-brand-light/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-fit">
                          <Plus className="w-4 h-4 mr-2" /> Add Result Card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Client Feedback */}
                <div className="md:col-span-2 border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">8. Client Feedback (Testimonial)</h3>
                  <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Client Name</label>
                        <input name="feedbackName" value={portfolio.feedbackName} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. Sarah Johnson" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Client Role</label>
                        <input name="feedbackRole" value={portfolio.feedbackRole} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. CTO, Guestway" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Rating (Stars: 1-5)</label>
                        <input name="feedbackRating" value={portfolio.feedbackRating} onChange={handleChange} type="number" min="1" max="5" className="input-premium" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Date / Location String</label>
                        <input name="feedbackDate" value={portfolio.feedbackDate} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. Jan 14, 2025" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Feedback Description</label>
                        <textarea name="feedbackDescription" value={portfolio.feedbackDescription} onChange={handleChange} rows="3" className="input-premium resize-y" placeholder="Testimonial text..."></textarea>
                      </div>

                      {/* Feedback Image Upload */}
                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Client Profile Image</label>
                        <label className="mt-1 flex justify-center px-6 py-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-brand-light transition-all bg-slate-50 hover:bg-brand-light/5 cursor-pointer relative group">
                          <div className="space-y-2 text-center">
                            <Upload className="h-6 w-6 text-brand-light mx-auto" />
                            <div className="flex text-sm text-slate-600 justify-center font-medium mt-2">
                              <span className="text-brand-dark px-1">Upload client image</span>
                              <input type="file" className="sr-only" accept="image/*" onChange={handleFeedbackImageChange} />
                            </div>
                          </div>
                        </label>
                        {portfolio.feedbackImage && (
                          <div className="mt-4 relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm w-32 h-32 bg-slate-100">
                            <img src={portfolio.feedbackImage.preview || `${BACKEND_URL}${portfolio.feedbackImage}`} alt="Client" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button type="button" onClick={handleRemoveFeedbackImage} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-transform shadow-lg">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ----------------------------------------------------------------- */}

                {/* Section: Uploads */}
                <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-4">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">9. Display Images</h3>
                  <p className="text-sm text-slate-500 mb-6">Thumbnails and full preview images.</p>
                </div>

                {/* Thumbnail Upload */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Thumbnail Image
                  </label>
                  <label className="mt-1 flex justify-center px-6 py-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-brand-light transition-all bg-slate-50 hover:bg-brand-light/5 cursor-pointer relative group">
                    <div className="space-y-2 text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-brand-light" />
                      </div>
                      <div className="flex text-sm text-slate-600 justify-center font-medium">
                        <span className="text-brand-dark px-1">Upload a file</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleThumbnailChange} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">PNG, JPG, WEBP up to 2MB</p>
                    </div>
                  </label>

                  {/* Thumbnail Preview */}
                  {portfolio.thumbnailImage && (
                    <div className="mt-4">
                      <div className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm w-[150px] h-[150px] bg-slate-100">
                        <img src={portfolio.thumbnailImage.preview || `${BACKEND_URL}${portfolio.thumbnailImage}`} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewImageUrl(portfolio.thumbnailImage.preview || `${BACKEND_URL}${portfolio.thumbnailImage}`)}
                            className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transform hover:scale-110 transition-transform shadow-lg backdrop-blur-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveThumbnail}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-transform shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Full Website/App Image Upload */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Website / App Image(s) <span className="text-brand-light ml-1 font-normal">(Multiple enabled)</span>
                  </label>
                  <label className="mt-1 flex justify-center px-6 py-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-brand-light transition-all bg-slate-50 hover:bg-brand-light/5 cursor-pointer relative group">
                    <div className="space-y-2 text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-brand-dark" />
                      </div>
                      <div className="flex text-sm text-slate-600 justify-center font-medium">
                        <span className="text-brand-dark px-1">Upload files</span>
                        <input type="file" className="sr-only" multiple={true} accept="image/*" onChange={handleImageChange} />
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  </label>

                  {/* Image Previews */}
                  {portfolio.images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {portfolio.images.map((img, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm w-[150px] h-[150px] bg-slate-100 flex-shrink-0">
                          <img src={img.preview || `${BACKEND_URL}${img}`} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewImageUrl(img.preview || `${BACKEND_URL}${img}`)}
                              className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transform hover:scale-110 transition-transform shadow-lg backdrop-blur-sm"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-transform shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 bg-slate-50/50 -mx-8 -mb-8 px-8 py-6">
              <button type="button" onClick={() => navigate('/portfolios')} className="btn-kretoss !bg-none !bg-white !text-slate-600 !border-slate-200 hover:!bg-slate-50 hover:!border-slate-300 mr-4 px-8 py-3 rounded-xl font-semibold shadow-sm transition-all">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn-kretoss px-10 py-3 rounded-xl text-base font-semibold disabled:opacity-50 min-w-[200px]">
                {isLoading ? 'Saving...' : 'Save Portfolio'}
              </button>
            </div>
          </form>
        </div>
      ) : portfoliosList.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-16 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Plus className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No portfolios added yet</h3>
          <p className="text-slate-500 font-medium">Create your first portfolio to showcase your work.</p>
          <button onClick={handleAddNew} className="btn-kretoss px-6 py-3 rounded-xl mt-4 font-semibold shadow-md">Add Portfolio</button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3.5">Project</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Timeline</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-sm">
              {portfoliosList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {item.thumbnailImage ? (
                          <img src={`${BACKEND_URL}${item.thumbnailImage}`} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                            {item.title.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm group-hover:text-brand-dark transition-colors">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-blue-50 text-brand-dark border border-blue-100/50">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500 font-medium text-sm">{item.timeline || '-'}</td>
                  <td className="px-6 py-3 text-right text-sm">
                    <button onClick={() => handleEdit(item)} className="text-brand-light hover:text-brand-dark font-bold mr-5 transition-colors">Edit</button>
                    <button onClick={() => confirmDelete(item._id)} className="text-slate-400 hover:text-red-500 font-bold transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Manage Categories</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-200/50 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                  className="input-premium flex-1"
                  placeholder="New Category Name"
                />
                <button
                  onClick={handleAddCategory}
                  className="btn-kretoss px-6 py-2.5 rounded-xl font-semibold shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap"
                >
                  Add
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {categories.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-4">No categories added yet.</p>
                ) : categories.map((cat, index) => (
                  <div 
                    key={cat._id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className={`flex justify-between items-center bg-slate-50/80 p-3.5 rounded-xl border transition-colors group cursor-move ${draggedItemIndex === index ? 'border-brand-light shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-700 select-none">{cat.name}</span>
                    </div>
                    <button
                      onClick={() => confirmDeleteCategory(cat._id)}
                      className="text-red-400 hover:text-white border-2 border-red-100 hover:border-red-500 p-1.5 rounded-lg hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center shadow-sm"
                      title="Delete Category"
                    >
                      <X className="w-4 h-4" strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Category?</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all hover:-translate-y-0.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Portfolio Confirmation Modal */}
      {portfolioToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Portfolio?</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this portfolio project? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setPortfolioToDelete(null)}
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all hover:-translate-y-0.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Image Preview Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setPreviewImageUrl(null)}>
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="fixed top-6 right-6 text-white bg-white/10 hover:bg-red-500 rounded-full p-2 transition-colors backdrop-blur-sm z-[80]"
            >
              <X className="w-8 h-8" />
            </button>
            <img src={previewImageUrl} alt="Preview large" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}


    </div>
  );
}
