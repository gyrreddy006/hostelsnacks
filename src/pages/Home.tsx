import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Scene from '../components/3d/Scene';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-blue-600">Hostel Store</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your one-stop shop for all hostel essentials. Get snacks, beverages, 
              and daily necessities delivered right to your door.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-blue-100 rounded-2xl p-8">
              <Scene />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Delivery</h3>
            <p className="text-gray-600">Get your snacks delivered within minutes</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-600">Choose from hundreds of snacks and essentials</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Payment</h3>
            <p className="text-gray-600">Secure and convenient payment options</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}