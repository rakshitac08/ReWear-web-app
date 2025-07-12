import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Recycle, Users, Award, TrendingUp } from 'lucide-react';
import { mockItems } from '../data/mockData';
import ItemCard from '../components/ItemCard';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const featuredItems = mockItems.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-500 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Sustainable Fashion
              <span className="block text-yellow-300">Starts Here</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Exchange unused clothing through direct swaps or our point-based system. 
              Join the movement to reduce textile waste and discover amazing finds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="group bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Swapping</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/listings"
                className="group border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                <span>Browse Items</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Recycle className="h-24 w-24 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Users className="h-20 w-20 animate-pulse" />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why ReWear?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of fashion-conscious individuals making a positive impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Recycle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Reduce textile waste and promote sustainable fashion choices</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">Connect with like-minded people who care about sustainability</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rewards</h3>
              <p className="text-gray-600">Earn points and badges for your sustainable fashion choices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Items</h2>
            <p className="text-xl text-gray-600">Discover amazing finds from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} showSwapButton={false} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/listings"
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors font-medium text-lg"
            >
              <span>View All Items</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2,450+</div>
              <div className="text-green-200">Items Exchanged</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">890+</div>
              <div className="text-green-200">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12.3 tons</div>
              <div className="text-green-200">Waste Prevented</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-green-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community today and start making a positive impact on the environment
          </p>
          
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Join ReWear Today</span>
              <TrendingUp className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}