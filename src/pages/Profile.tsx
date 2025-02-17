import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Phone, Mail, MapPin, Copy, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Order } from '../types';
import { Link } from 'react-router-dom';

interface UserProfile {
  name: string | null;
  phone_number: string | null;
  address: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: null,
    phone_number: null,
    address: null
  });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    phone_number: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, phone_number, address')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone_number: data.phone_number || '',
          address: data.address || ''
        });
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name || null,
          phone_number: formData.phone_number || null,
          address: formData.address || null
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      setProfile(formData);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(user?.id || '');
    toast.success('Customer ID copied to clipboard');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-600 px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.name || 'Profile'}</h1>
              <p className="text-blue-100">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Customer ID */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customer ID</p>
              <p className="font-mono text-sm">{user?.id?.slice(0, 8)}...</p>
            </div>
            <button
              onClick={copyId}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Copy size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Edit2 size={20} className="text-gray-500" />
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone_number || ''}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className={profile.phone_number ? 'text-gray-900' : 'text-gray-400'}>
                    {profile.phone_number || 'Not added yet'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className={profile.address ? 'text-gray-900' : 'text-gray-400'}>
                    {profile.address || 'Not added yet'}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Orders */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link to="/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <Package size={24} className="animate-spin text-blue-600" />
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: 
                          order.status === 'delivered' ? 'rgb(187 247 208)' :
                          order.status === 'processing' ? 'rgb(254 240 138)' :
                          'rgb(254 226 226)',
                        color:
                          order.status === 'delivered' ? 'rgb(22 101 52)' :
                          order.status === 'processing' ? 'rgb(133 77 14)' :
                          'rgb(153 27 27)'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-right font-semibold">
                    ${order.total.toFixed(2)}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No orders yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}