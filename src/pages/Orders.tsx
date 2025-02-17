import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Package, Truck, CreditCard, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Order } from '../types';

const PAYMENT_ICONS = {
  cod: Truck,
  upi: Smartphone,
  card: CreditCard,
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Package size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl text-gray-600">No orders yet</h2>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const PaymentIcon = PAYMENT_ICONS[order.payment_method as keyof typeof PAYMENT_ICONS];
            
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <span className="px-3 py-1 rounded-full text-sm font-medium capitalize" style={{
                          backgroundColor: 
                            order.status === 'delivered' ? 'rgb(187 247 208)' :
                            order.status === 'processing' ? 'rgb(254 240 138)' :
                            'rgb(254 226 226)',
                          color:
                            order.status === 'delivered' ? 'rgb(22 101 52)' :
                            order.status === 'processing' ? 'rgb(133 77 14)' :
                            'rgb(153 27 27)'
                        }}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {new Date(order.created_at).toLocaleDateString()} at{' '}
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <PaymentIcon size={20} />
                      <span className="capitalize">{order.payment_method}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Progress */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between mb-4">
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{
                              width:
                                order.status === 'delivered' ? '100%' :
                                order.status === 'processing' ? '66%' :
                                '33%'
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>Order Placed</span>
                          <span>Processing</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}