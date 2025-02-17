/*
  # Initial Schema Setup for College Hostel E-Commerce

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category` (text)
      - `stock` (integer)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `items` (jsonb)
      - `total` (numeric)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text,
  category text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  items jsonb NOT NULL,
  total numeric NOT NULL CHECK (total >= 0),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify products"
  ON products
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create some sample products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('Lays Classic', 'Classic potato chips', 1.99, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b', 'snacks', 50),
('Coca Cola', 'Refreshing cola drink', 1.49, 'https://images.unsplash.com/photo-1629203851265-5e8cc3c1f441', 'beverages', 100),
('Oreo Cookies', 'Chocolate sandwich cookies', 2.99, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35', 'snacks', 75),
('Maggi Noodles', 'Instant noodles', 0.99, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 'food', 200);