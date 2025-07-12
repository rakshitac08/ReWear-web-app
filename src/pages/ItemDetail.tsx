import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockItems, updateItemStatus } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Heart, Share2, Eye, Calendar, User, MapPin, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUserStats } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);

  const item = mockItems.find(item => item.id === id);

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Item not found</h1>
          <button
            onClick={() => navigate('/listings')}
            className="mt-4 text-green-600 hover:text-green-500"
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  const userHasNoListings = user?.listingsCount === 0;
  const canSwap = isAuthenticated && !userHasNoListings && item.ownerId !== user?.id;
  const hasEnoughPoints = user && user.points >= item.points;
  const isSwapRequested = item.status === 'pending';
  const isRedeemed = item.status === 'swapped';

  const handleSwapRequest = () => {
    if (!canSwap || isSwapRequested) return;
    
    updateItemStatus(item.id, 'pending');
    
    // Animate swap request
    const button = document.querySelector('.swap-button');
    button?.classList.add('animate-bounce');
    setTimeout(() => button?.classList.remove('animate-bounce'), 600);
    
    toast.success('🚀 Swap request sent! Flying envelope on its way!', {
      icon: '✉️'
    });
  };

  const handleRedeem = () => {
    if (!hasEnoughPoints || isRedeemed) return;
    
    updateItemStatus(item.id, 'swapped');
    updateUserStats({ 
      points: user.points - item.points,
      totalSwaps: user.totalSwaps + 1
    });
    toast.success(`✨ Item redeemed for ${item.points} points!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/listings')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to listings</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
            <img
              src={item.images[selectedImage]}
              alt={item.title}
              className="w-full h-96 object-cover"
            />
            {item.isHot && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>HOT</span>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{item.watchersCount} watching</span>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {item.images.length > 1 && (
            <div className="flex space-x-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold">
              {item.points} points
            </div>
            <div className="text-gray-600 flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Item Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-sm text-gray-500">Size</span>
              <p className="font-medium">{item.size}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Condition</span>
              <p className="font-medium capitalize">{item.condition}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Category</span>
              <p className="font-medium capitalize">{item.category}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status</span>
              <p className="font-medium capitalize text-green-600">{item.status}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-300 rounded-full p-2">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">@{item.ownerUsername}</p>
                <p className="text-sm text-gray-600">Verified member</p>
              </div>
            </div>
          </div>

          {/* Engagement Hints */}
          <div className="space-y-3 mb-6">
            {item.watchersCount && item.watchersCount > 10 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-orange-800 text-sm">
                  🔥 {item.watchersCount} users are looking for this! Popular item!
                </p>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                💎 Redeem with {item.points} points or send a swap request
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isAuthenticated ? (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gray-300 text-gray-600 py-3 px-6 rounded-lg font-medium"
              >
                Login to Swap or Redeem
              </button>
            ) : item.ownerId === user?.id ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-center">This is your item</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Swap Request Button */}
                <button
                  onClick={handleSwapRequest}
                  disabled={!canSwap || isSwapRequested}
                  className={`swap-button w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                    canSwap && !isSwapRequested
                      ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 shadow-lg'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isSwapRequested ? 'Request Sent' : userHasNoListings ? 'Upload an item first to swap' : 'Send Swap Request'}
                </button>

                {/* Redeem Button */}
                <button
                  onClick={handleRedeem}
                  disabled={!hasEnoughPoints || isRedeemed}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                    hasEnoughPoints && !isRedeemed
                      ? 'bg-purple-500 hover:bg-purple-600 text-white hover:scale-105 shadow-lg glow-purple'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                  style={hasEnoughPoints && !isRedeemed ? {
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
                  } : {}}
                >
                  {isRedeemed ? 'Redeemed' : hasEnoughPoints ? `Redeem for ${item.points} points` : `Need ${item.points - (user?.points || 0)} more points`}
                </button>

                {/* Tooltips for disabled buttons */}
                {userHasNoListings && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-gray-600 text-sm text-center">
                      💡 Upload at least 1 item to request a swap
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}