import React, { useState } from 'react';
import { mockItems } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { 
  Check, X, Flag, Eye, Users, Package, User,
  TrendingUp, AlertTriangle, Crown, Ban 
} from 'lucide-react';
import toast from 'react-hot-toast';

const mockUsers = [
  {
    id: '1',
    username: 'Rakshita',
    email: 'rakshita08@gmail.com',
    points: 50,
    listings: 0,
    swaps: 0,
    status: 'active',
    joinDate: '2024-01-20',
    specialNote: 'New user - needs to upload first item'
  },
  {
    id: '2',
    username: 'Anisha',
    email: 'anisha22@gmail.com',
    points: 500,
    listings: 15,
    swaps: 25,
    status: 'active',
    joinDate: '2024-01-10',
    specialNote: 'Admin - Platform Manager'
  }
];

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'users'>('listings');
  const [items, setItems] = useState(mockItems);
  const [users, setUsers] = useState(mockUsers);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleApproveItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, status: 'available' as const } : item
    ));
    toast.success('Item approved successfully');
  };

  const handleRejectItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    toast.success('Item rejected and removed');
  };

  const handleFlagItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, status: 'pending' as const } : item
    ));
    toast.warning('Item flagged for review');
  };

  const handleUserAction = (userId: string, action: string) => {
    const actionMessages = {
      ban: 'User banned successfully',
      warn: 'Warning sent to user',
      reset: 'Points reset to 0',
      promote: 'User promoted to admin'
    };

    setUsers(users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'ban':
            return { ...user, status: 'banned' };
          case 'warn':
            return { ...user, status: 'warned' };
          case 'reset':
            return { ...user, points: 0 };
          default:
            return user;
        }
      }
      return user;
    }));

    toast.success(actionMessages[action as keyof typeof actionMessages] || 'Action completed');
  };

  const stats = {
    totalItems: items.length,
    pendingItems: items.filter(item => item.status === 'pending').length,
    totalUsers: users.length,
    activeUsers: users.filter(user => user.status === 'active').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage listings, users, and platform oversight</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">{stats.totalItems}</span>
          </div>
          <p className="text-sm text-gray-600">Total Items</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900">{stats.pendingItems}</span>
          </div>
          <p className="text-sm text-gray-600">Pending Review</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">{stats.totalUsers}</span>
          </div>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <span className="text-2xl font-bold text-gray-900">{stats.activeUsers}</span>
          </div>
          <p className="text-sm text-gray-600">Active Users</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'listings'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Manage Listings
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'users'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Manage Users
        </button>
      </div>

      {/* Manage Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Watchers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.primaryImage}
                          alt={item.title}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.category} • Size {item.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">@{item.ownerUsername}</div>
                      <div className="text-sm text-gray-500">{item.ownerId === '1' && 'User qualifies for Surprise Drop'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'available' ? 'bg-green-100 text-green-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.watchersCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveItem(item.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRejectItem(item.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFlagItem(item.id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Flag"
                        >
                          <Flag className="h-4 w-4" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Special Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">@{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">Joined {new Date(user.joinDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{user.points} Points</div>
                        <div>{user.listings} Listings</div>
                        <div>{user.swaps} Swaps</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'warned' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.specialNote && (
                        <span className="text-sm text-orange-600 font-medium">
                          {user.specialNote}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Ban User"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, 'warn')}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Warn User"
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, 'reset')}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Reset Points"
                        >
                          <TrendingUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, 'promote')}
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title="Promote to Admin"
                        >
                          <Crown className="h-4 w-4" />
                        </button>
                      </div>
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