import React from 'react';
import { Link } from 'react-router-dom';
import { ClothingItem } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Eye, Zap } from 'lucide-react';

interface ItemCardProps {
  item: ClothingItem;
  showSwapButton?: boolean;
  onSwapRequest?: (itemId: string) => void;
  onRedeem?: (itemId: string) => void;
}

export default function ItemCard({ item, showSwapButton = true, onSwapRequest, onRedeem }: ItemCardProps) {
  const { user, isAuthenticated } = useAuth();
  const userHasNoListings = user?.listingsCount === 0;
  const canSwap = isAuthenticated && !userHasNoListings && item.ownerId !== user?.id;
  const hasEnoughPoints = user && user.points >= item.points;
  const isSwapRequested = item.status === 'pending';
  const isRedeemed = item.status === 'swapped';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <Link to={`/item/${item.id}`}>
          <img
            src={item.primaryImage}
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {item.isHot && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>HOT</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
          <Eye className="h-3 w-3" />
          <span>{item.watchersCount}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
            {item.points} pts
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              Size {item.size}
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
              {item.condition}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {showSwapButton && (
          <div className="flex space-x-2">
            {canSwap ? (
              <>
                <button 
                  onClick={() => onSwapRequest?.(item.id)}
                  disabled={isSwapRequested}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
                    isSwapRequested 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isSwapRequested ? 'Request Sent' : 'Swap Request'}
                </button>
                <button 
                  onClick={() => onRedeem?.(item.id)}
                  disabled={!hasEnoughPoints || isRedeemed}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
                    !hasEnoughPoints || isRedeemed
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  {isRedeemed ? 'Redeemed' : hasEnoughPoints ? 'Redeem' : `Need ${item.points - (user?.points || 0)} pts`}
                </button>
              </>
            ) : (
              <div className="w-full">
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-lg text-center block font-medium"
                  >
                    Login to Swap
                  </Link>
                ) : userHasNoListings ? (
                  <div className="relative group">
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                    >
                      List an Item First
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                      <div className="bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                        Upload at least 1 item to request a swap
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                  >
                    Your Item
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}