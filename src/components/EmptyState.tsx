import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Award } from 'lucide-react';

interface EmptyStateProps {
  type: 'listings' | 'items';
}

export default function EmptyState({ type }: EmptyStateProps) {
  if (type === 'listings') {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nothing here yet!</h3>
        <p className="text-gray-600 mb-6">Start by uploading your first item.</p>
        
        <Link
          to="/add-item"
          className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Package className="h-5 w-5" />
          <span>Upload an Item</span>
        </Link>
        
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center space-x-2 text-green-700">
            <Award className="h-5 w-5" />
            <span className="font-medium">Gamification Hint</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Upload 1 item to unlock your first Swap Badge 🎖️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <Package className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
      <p className="text-gray-600">Try adjusting your filters or check back later.</p>
    </div>
  );
}