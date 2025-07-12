import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockItems } from '../data/mockData';
import ItemCard from '../components/ItemCard';
import { 
  Coins, Gift, Shirt, Users, Award, Package, 
  Plus, TrendingUp, Edit, Eye, MessageCircle 
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  const userItems = mockItems.filter(item => item.ownerId === user.id);
  const userPurchases = mockItems.filter(item => item.status === 'swapped').slice(0, 2);

  const statusTiles = [
    {
      title: 'Points Balance',
      value: user.points,
      icon: Coins,
      color: 'bg-green-500',
      suffix: 'pts'
    },
    {
      title: 'Surprise Drop',
      value: `${Math.min(user.listingsCount, 3)}/3`,
      icon: Gift,
      color: 'bg-purple-500',
      subtitle: user.listingsCount >= 3 ? 'Unlocked!' : 'Upload more'
    },
    {
      title: 'Closet Meter',
      value: user.listingsCount,
      icon: Shirt,
      color: 'bg-blue-500',
      progress: Math.min((user.listingsCount / 10) * 100, 100)
    },
    {
      title: 'Community Swaps',
      value: user.totalSwaps,
      icon: Users,
      color: 'bg-orange-500',
      subtitle: 'This month'
    },
    {
      title: 'Badges Earned',
      value: user.badges.length,
      icon: Award,
      color: 'bg-yellow-500',
      subtitle: 'Keep going!'
    },
    {
      title: 'Total Swaps',
      value: user.totalSwaps,
      icon: Package,
      color: 'bg-indigo-500',
      subtitle: 'All time'
    }
  ];

  const shouldShowSharingMessage = user.listingsCount === 0 && user.totalSwaps > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
            <p className="text-gray-600">Ready to make some sustainable swaps?</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                {user.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    🏆 {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statusTiles.map((tile, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${tile.color} text-white`}>
                <tile.icon className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {tile.value}
              {tile.suffix && <span className="text-sm text-gray-500 ml-1">{tile.suffix}</span>}
            </h3>
            <p className="text-sm text-gray-600">{tile.title}</p>
            {tile.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{tile.subtitle}</p>
            )}
            {tile.progress !== undefined && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${tile.color}`}
                    style={{ width: `${tile.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{tile.progress.toFixed(0)}% full</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sharing Message */}
      {shouldShowSharingMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Sharing is caring!</h3>
              <p className="text-green-700">Upload more items to build a stronger community 🌱</p>
              <Link
                to="/add-item"
                className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors mt-2"
              >
                <Plus className="h-4 w-4" />
                <span>Upload Item</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Community Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Progress</h3>
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-10 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center"
              >
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            ))}
          </div>
          <div>
            <p className="text-gray-800">
              You've swapped with <span className="font-bold">3/5</span> people this month – keep going!
            </p>
            <div className="bg-gray-200 rounded-full h-2 w-64 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
            <Link
              to="/add-item"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </Link>
          </div>

          {userItems.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Shirt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No items listed yet</h3>
              <p className="text-gray-600 mb-4">Start by uploading your first item to begin swapping!</p>
              <Link
                to="/add-item"
                className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Upload First Item</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                  <img
                    src={item.primaryImage}
                    alt={item.title}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">Size {item.size} • {item.points} points</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'available' ? 'bg-green-100 text-green-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'swapped' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status === 'swapped' ? 'Redeemed' : item.status}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500 text-xs">
                        <Eye className="h-3 w-3" />
                        <span>{item.watchersCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/item/${item.id}`}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Purchases/Swaps */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          
          {userPurchases.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No swaps yet</h3>
              <p className="text-gray-600 mb-4">Browse items to find your first swap!</p>
              <Link
                to="/listings"
                className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Browse Items</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userPurchases.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                  <img
                    src={item.primaryImage}
                    alt={item.title}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">From @{item.ownerUsername}</p>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      Shipped
                    </span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}