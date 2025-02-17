/*
  # Add payment method to orders

  1. Changes
    - Add payment_method column to orders table
    - Add check constraint to ensure valid payment methods
    - Update existing orders to have 'cod' as default payment method

  2. Security
    - No changes to RLS policies required
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders 
    ADD COLUMN payment_method text NOT NULL DEFAULT 'cod';

    ALTER TABLE orders 
    ADD CONSTRAINT valid_payment_method 
    CHECK (payment_method IN ('cod', 'upi', 'card'));

    -- Update existing orders to have 'cod' as payment method
    UPDATE orders SET payment_method = 'cod' WHERE payment_method IS NULL;
  END IF;
END $$;