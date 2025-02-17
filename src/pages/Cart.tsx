import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Smartphone, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', icon: Truck },
  { id: 'upi', name: 'UPI / PhonePe', icon: Smartphone },
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
];

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout');
      navigate('/login');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            items,
            total,
            status: 'processing',
            payment_method: selectedPayment
          }
        ]);

      if (error) throw error;

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[50vh]"
      >
        <ShoppingBag size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Continue Shopping
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-8"
      >
        Shopping Cart
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between border-b pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus size={20} />
                    </motion.button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>

            <div className="space-y-4 mb-6">
              {PAYMENT_METHODS.map(({ id, name, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPayment === id ? 'bg-blue-50 border-2 border-blue-500' : 'border-2 border-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={selectedPayment === id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="hidden"
                  />
                  <Icon size={24} className={selectedPayment === id ? 'text-blue-500' : 'text-gray-400'} />
                  <span className={selectedPayment === id ? 'text-blue-700 font-medium' : 'text-gray-600'}>
                    {name}
                  </span>
                </label>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-semibold mb-6">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <ShoppingBag size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Place Order
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}