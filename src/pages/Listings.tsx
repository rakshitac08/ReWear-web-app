import React, { useState, useMemo } from 'react';
import { mockItems, categories, updateItemStatus } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { Filter, ArrowUpDown, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Listings() {
  const { user, isAuthenticated, updateUserStats } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'points' | 'popular'>('recent');
  const [showFilters, setShowFilters] = useState(false);

  const userHasNoListings = user?.listingsCount === 0;

  const handleSwapRequest = (itemId: string) => {
    updateItemStatus(itemId, 'pending');
    toast.success('🚀 Swap request sent! Flying envelope on its way!', {
      icon: '✉️'
    });
  };

  const handleRedeem = (itemId: string) => {
    const item = mockItems.find(i => i.id === itemId);
    if (item && user && user.points >= item.points) {
      updateItemStatus(itemId, 'swapped');
      updateUserStats({ 
        points: user.points - item.points,
        totalSwaps: user.totalSwaps + 1
      });
      toast.success(`✨ Item redeemed for ${item.points} points!`);
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let filtered = mockItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sort items
    switch (sortBy) {
      case 'recent':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'points':
        filtered = [...filtered].sort((a, b) => a.points - b.points);
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.watchersCount || 0) - (a.watchersCount || 0));
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy]);

  if (filteredAndSortedItems.length === 0 && selectedCategory === 'all') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState type="listings" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
        <p className="text-gray-600">Discover amazing fashion finds from our community</p>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Categories:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-green-500 text-white shadow-lg scale-105 glow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === category.id ? {
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
                } : {}}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="points">Points Required</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* No Listings Warning for Authenticated Users */}
      {isAuthenticated && userHasNoListings && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                List your first item to unlock swap features!
              </h3>
              <p className="text-yellow-700 mb-4">
                Swap Request buttons are disabled until you upload at least one item.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-green-500 rounded bg-green-500 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-green-700 font-medium">Step 1: Upload an Item</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center">
                    <Clock className="h-3 w-3 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600">Step 2: Request a Swap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {filteredAndSortedItems.length === 0 ? (
        <EmptyState type="items" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedItems.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onSwapRequest={handleSwapRequest}
              onRedeem={handleRedeem}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="mt-8 text-center text-gray-600">
        Showing {filteredAndSortedItems.length} item{filteredAndSortedItems.length !== 1 ? 's' : ''}
        {selectedCategory !== 'all' && (
          <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
        )}
      </div>
    </div>
  );
}