/*
  # Schema update for e-commerce features

  1. Tables
    - Ensures tables exist:
      - users (with auth integration)
      - products (for store inventory)
      - orders (for purchase tracking)
    
  2. Security
    - Enables RLS on all tables
    - Sets up policies for:
      - User data access
      - Product visibility
      - Order management

  3. Sample Data
    - Adds initial product catalog
*/

-- Create tables if they don't exist
DO $$ 
BEGIN
    -- Create users table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE users (
            id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
            email text UNIQUE NOT NULL,
            role text NOT NULL DEFAULT 'user',
            created_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create products table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
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
    END IF;

    -- Create orders table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
        CREATE TABLE orders (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES users(id) ON DELETE CASCADE,
            items jsonb NOT NULL,
            total numeric NOT NULL CHECK (total >= 0),
            status text NOT NULL DEFAULT 'pending',
            created_at timestamptz DEFAULT now()
        );
    END IF;
END $$;

-- Enable RLS (safe to run multiple times)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
    -- Users policies
    DROP POLICY IF EXISTS "Users can read own data" ON users;
    CREATE POLICY "Users can read own data"
        ON users
        FOR SELECT
        TO authenticated
        USING (auth.uid() = id);

    -- Products policies
    DROP POLICY IF EXISTS "Anyone can read products" ON products;
    CREATE POLICY "Anyone can read products"
        ON products
        FOR SELECT
        TO authenticated
        USING (true);

    DROP POLICY IF EXISTS "Only admins can modify products" ON products;
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
    DROP POLICY IF EXISTS "Users can read own orders" ON orders;
    CREATE POLICY "Users can read own orders"
        ON orders
        FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can create own orders" ON orders;
    CREATE POLICY "Users can create own orders"
        ON orders
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
END $$;

-- Insert sample products if the products table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
        INSERT INTO products (name, description, price, image_url, category, stock) VALUES
        ('Lays Classic', 'Classic potato chips', 1.99, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b', 'snacks', 50),
        ('Coca Cola', 'Refreshing cola drink', 1.49, 'https://images.unsplash.com/photo-1629203851265-5e8cc3c1f441', 'beverages', 100),
        ('Oreo Cookies', 'Chocolate sandwich cookies', 2.99, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35', 'snacks', 75),
        ('Maggi Noodles', 'Instant noodles', 0.99, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 'food', 200);
    END IF;
END $$;