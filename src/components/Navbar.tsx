import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Package, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Hostel Store
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/products"
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <Package size={20} />
                  <span className="hidden md:inline">Products</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <User size={20} />
                  <span className="hidden md:inline">Profile</span>
                </Link>
                
                <Link
                  to="/cart"
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1 relative"
                >
                  <ShoppingCart size={20} />
                  <span className="hidden md:inline">Cart</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}