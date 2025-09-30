"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  ChevronDown,
  GripVertical,
  Trash2,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Option {
  id: string;
  text: string;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
  questions: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
  }[];
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  type: 'CUSTOMER' | 'PROFESSIONAL';
}

interface Category {
  id: string;
  name: string;
}

interface AddServiceFormProps {
  onClose: () => void;
  onSave: () => void;
  serviceToEdit?: Service | null;
}

const AddServiceForm: React.FC<AddServiceFormProps> = ({ onClose, onSave, serviceToEdit }) => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', options: [{ id: '1-1', text: '' }, { id: '1-2', text: '' }], type: 'CUSTOMER' }
  ]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (serviceToEdit) {
      setServiceName(serviceToEdit.name);
      setServiceDescription(serviceToEdit.description || '');
      setSelectedCategoryId(serviceToEdit.categoryId);
      setImageUrl(serviceToEdit.imageUrl || null);
      if (serviceToEdit.questions && Array.isArray(serviceToEdit.questions)) {
        setQuestions(serviceToEdit.questions.map(q => ({
          ...q,
          id: q.id || Date.now().toString() + Math.random(),
          type: (q as any).type || 'CUSTOMER',
          options: (q.options || []).map(o => ({ ...o, id: o.id || Date.now().toString() + Math.random() }))
        })));
      } else {
        setQuestions([{ id: '1', text: '', options: [{ id: '1-1', text: '' }], type: 'CUSTOMER' }]);
      }
    }
  }, [serviceToEdit]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/admin/categories');
        setCategories(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Could not load categories.');
      }
    };
    fetchCategories();
  }, []);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      options: [{ id: `${Date.now()}-1`, text: '' }, { id: `${Date.now()}-2`, text: '' }],
      type: 'CUSTOMER',
    };
    setQuestions([...questions, newQuestion]);
  };
  const updateQuestionType = (questionId: string, type: 'CUSTOMER' | 'PROFESSIONAL') => {
    setQuestions(questions.map(q => q.id === questionId ? { ...q, type } : q));
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const updateQuestion = (questionId: string, text: string) => {
    setQuestions(questions.map(q => q.id === questionId ? { ...q, text } : q));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: [...q.options, { id: `${Date.now()}`, text: '' }] }
        : q
    ));
  };

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId && q.options.length > 2
        ? { ...q, options: q.options.filter(opt => opt.id !== optionId) }
        : q
    ));
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: q.options.map(opt => opt.id === optionId ? { ...opt, text } : opt) }
        : q
    ));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.data;

      if (!response.status || !data.success) {
        throw new Error(data.message || 'Image upload failed');
      }

      setImageUrl(data.url);
      toast.success('Image uploaded!');
    } catch (error: any) {
      toast.error(error.message);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, questionId: string) => {
    setDraggedQuestion(questionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetQuestionId: string) => {
    e.preventDefault();
    if (!draggedQuestion || draggedQuestion === targetQuestionId) return;

    const draggedIndex = questions.findIndex(q => q.id === draggedQuestion);
    const targetIndex = questions.findIndex(q => q.id === targetQuestionId);

    const newQuestions = [...questions];
    const [draggedItem] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(targetIndex, 0, draggedItem);

    setQuestions(newQuestions);
    setDraggedQuestion(null);
  };

  const handleSave = async () => {
    if (!serviceName || !selectedCategoryId) {
      toast.error('Service Name and Category are required.');
      return;
    }
    setIsLoading(true);

    const isEditMode = !!serviceToEdit;
    const url = isEditMode ? `/api/admin/services/${serviceToEdit.id}` : '/api/admin/services';
    const method = isEditMode ? 'PUT' : 'POST';

    const payload = {
      name: serviceName,
      description: serviceDescription,
      categoryId: selectedCategoryId,
      imageUrl: imageUrl,
      questions: questions.map(q => ({
        id: isEditMode ? q.id : undefined,
        text: q.text,
        options: q.options.map(opt => ({
          id: isEditMode ? opt.id : undefined,
          text: opt.text
        })),
      }))
    };

    try {
      const response = await axios({ method, url, data: payload });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} service`);
      }

      toast.success(`Service ${isEditMode ? 'updated' : 'created'} successfully!`);
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(`An error occurred while ${isEditMode ? 'updating' : 'saving'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryName = categories.find(c => c.id === selectedCategoryId)?.name;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 cursor-pointer text-slate-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {serviceToEdit ? 'Edit Service' : 'Create New Service'}
              </h2>
              <p className="text-slate-600">
                {serviceToEdit ? 'Update the details of your service' : 'Build your service step by step'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5 cursor-pointer text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-600 font-semibold text-sm">1</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Service Details</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Service Name */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service Name</label>
                    <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="Enter service name..." className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-400" />
                  </div>

                  {/* Category Dropdown */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="w-full cursor-pointer px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-400 flex items-center justify-between text-left">
                      <span className={selectedCategoryId ? 'text-slate-900' : 'text-slate-500'}>
                        {selectedCategoryName || 'Select a category...'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCategoryDropdown && (
                      <div className="absolute top-full cursor-pointer left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 animate-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
                        {categories.map((category) => (
                          <button key={category.id} onClick={() => { setSelectedCategoryId(category.id); setShowCategoryDropdown(false); }} className="w-full px-4 cursor-pointer py-3 text-left hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl">
                            {category.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="group">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Service Image</label>
                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-slate-300 rounded-xl p-8 text-center transition-all duration-200 ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 group-hover:border-slate-400'}`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                        <p className="text-slate-600 font-medium">Uploading...</p>
                      </div>
                    ) : imageUrl ? (
                      <div className="relative">
                        <img src={imageUrl} alt="Uploaded service" className="w-full h-32 object-cover rounded-lg" />
                        <button onClick={(e) => { e.stopPropagation(); setImageUrl(null); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto">
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-600 font-medium">Click to upload image</p>
                          <p className="text-slate-400 text-sm">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </div>
              </div>

              {/* Service Description */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2">Service Description</label>
                <textarea value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="Describe your service in detail..." rows={4} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-400 resize-none" />
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-600 font-semibold text-sm">2</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Service Questions</h3>
                <p className="text-slate-600 text-sm">Help customers provide the right information</p>
              </div>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} draggable onDragStart={(e) => handleDragStart(e, question.id)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, question.id)} className={`bg-slate-50 border border-slate-200 rounded-xl p-6 transition-all duration-200 hover:shadow-md ${draggedQuestion === question.id ? 'opacity-50 scale-95' : ''}`}>
                    <div className="flex items-start gap-4">
                      <button className="mt-3 p-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5" />
                      </button>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-900">Question {index + 1}</h4>
                          <div className="flex items-center gap-2 text-xs border border-slate-200 rounded-lg p-1">
                            <button onClick={() => updateQuestionType(question.id, 'CUSTOMER')} className={`px-2 py-1 rounded-md ${question.type === 'CUSTOMER' ? 'bg-cyan-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                              For Customer
                            </button>
                            <button onClick={() => updateQuestionType(question.id, 'PROFESSIONAL')} className={`px-2 py-1 rounded-md ${question.type === 'PROFESSIONAL' ? 'bg-purple-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                              For Professional
                            </button>
                          </div>
                          {questions.length > 1 && (
                            <button onClick={() => removeQuestion(question.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer rounded-lg transition-all duration-200">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <input type="text" value={question.text} onChange={(e) => updateQuestion(question.id, e.target.value)} placeholder="Enter your question..." className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200" />
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-slate-700">Answer Options</label>
                          {question.options.map((option, optionIndex) => (
                            <div key={option.id} className="flex items-center gap-3 animate-in slide-in-from-left duration-200">
                              <span className="text-slate-400 text-sm font-medium min-w-[20px]">{optionIndex + 1}.</span>
                              <input type="text" value={option.text} onChange={(e) => updateOption(question.id, option.id, e.target.value)} placeholder={`Option ${optionIndex + 1}`} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200" />
                              {question.options.length > 2 && (
                                <button onClick={() => removeOption(question.id, option.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer rounded-lg transition-all duration-200">
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button onClick={() => addOption(question.id)} className="flex items-center cursor-pointer gap-2 px-3 py-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-all duration-200 text-sm font-medium">
                            <Plus className="w-4 h-4" />
                            Add Option
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addQuestion} className="w-full border-2 cursor-pointer border-dashed border-slate-300 rounded-xl p-6 text-slate-600 hover:text-cyan-600 hover:border-cyan-400 hover:bg-cyan-50 transition-all duration-200 flex items-center justify-center gap-3 font-medium">
                  <Plus className="w-5 h-5" />
                  Add Another Question
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Save Button */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button onClick={handleSave} disabled={isLoading} className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-400 text-white px-8 py-3 cursor-pointer rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center gap-3 shadow-lg">
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-5 h-5" /> {serviceToEdit ? 'Save Changes' : 'Save Service'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceForm;