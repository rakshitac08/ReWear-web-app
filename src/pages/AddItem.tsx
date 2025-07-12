import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { categories, conditions, sizes, addNewItem } from '../data/mockData';
import { Upload, X, Star, Plus, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddItem() {
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    points: 30,
    tags: [] as string[]
  });
  const [images, setImages] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedTags = [
    'vintage', 'designer', 'casual', 'formal', 'summer', 'winter',
    'brand-new', 'trending', 'rare', 'eco-friendly', 'handmade'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Simulate image upload by creating placeholder URLs
    const newImages = files.map((file, index) => 
      `https://images.pexels.com/photos/${1000000 + images.length + index}/pexels-photo-${1000000 + images.length + index}.jpeg?auto=compress&cs=tinysrgb&w=400`
    );
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (primaryImageIndex >= newImages.length) {
      setPrimaryImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new item
      const newItem = addNewItem({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        size: formData.size,
        condition: formData.condition as any,
        points: formData.points,
        images: images,
        primaryImage: images[primaryImageIndex],
        tags: formData.tags,
        ownerId: user!.id,
        ownerUsername: user!.username,
        status: 'available'
      });
      
      const currentListings = user?.listingsCount || 0;
      const newListingsCount = currentListings + 1;
      
      // Update user stats
      updateUserStats({ 
        listingsCount: newListingsCount,
        points: user!.points + 10 // +10 points for uploading
      });
      
      toast.success('Item listed successfully!');
      
      // Check for surprise drop unlock
      if (newListingsCount >= 3) {
        setTimeout(() => {
          toast.success('🎉 You just unlocked your Surprise Drop! Check your dashboard!', {
            duration: 5000
          });
        }, 1000);
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to list item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Item</h1>
        <p className="text-gray-600 mb-8">Share your unused clothing with the community</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Images <span className="text-red-500">*</span>
            </label>
            
            {/* Drag and Drop Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">Drop images here or click to upload</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
              </label>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Mark primary image with ⭐ (will be shown as main image)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrimaryImageIndex(index)}
                        className={`absolute top-2 left-2 p-1 rounded-full transition-colors ${
                          primaryImageIndex === index
                            ? 'bg-yellow-400 text-yellow-900'
                            : 'bg-gray-500 text-white opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Vintage Denim Jacket"
              />
            </div>

            <div>
              <label htmlFor="points" className="block text-lg font-medium text-gray-700 mb-2">
                Points Value
              </label>
              <input
                type="number"
                id="points"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="10"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Describe the item's condition, style, fit, and any other details..."
            />
          </div>

          {/* Category, Size, Condition */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="size" className="block text-lg font-medium text-gray-700 mb-2">
                Size <span className="text-red-500">*</span>
              </label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="condition" className="block text-lg font-medium text-gray-700 mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Tags (max 5)
            </label>
            
            {/* Current Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-500 hover:text-purple-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Custom Tag */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add custom tag"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
              />
              <button
                type="button"
                onClick={() => addTag(newTag)}
                disabled={formData.tags.length >= 5}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Suggested Tags */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags
                  .filter(tag => !formData.tags.includes(tag))
                  .slice(0, 8)
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={formData.tags.length >= 5}
                      className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors chalk-style"
                    >
                      #{tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-4 px-6 rounded-lg text-lg font-medium transition-colors"
            >
              {isLoading ? 'Listing Item...' : 'List Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}