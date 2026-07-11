-- ===========================
-- CafeX Database Schema
-- PostgreSQL
-- ===========================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop Tables (for development only)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===========================
-- USERS
-- ===========================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'staff',
  is_active BOOLEAN DEFAULT TRUE,

  -- Password reset (token is SHA-256 hex of the raw URL token)
  password_reset_token     VARCHAR(64),
  password_reset_expires_at TIMESTAMPTZ,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_role
  CHECK (role IN ('admin', 'staff'))
);

-- ===========================
-- CATEGORIES
-- ===========================

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- MENU ITEMS
-- ===========================

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,

  name VARCHAR(150) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,

  image_url TEXT,

  is_available BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_menu_category
  FOREIGN KEY (category_id)
  REFERENCES categories(id)
  ON DELETE CASCADE
);

-- ===========================
-- ORDERS
-- ===========================

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,

  order_number VARCHAR(50) UNIQUE NOT NULL,

  staff_id INT NOT NULL,

  order_type VARCHAR(20) DEFAULT 'dine_in',

  order_status VARCHAR(30) DEFAULT 'new',

  subtotal NUMERIC(10,2) DEFAULT 0,

  tax NUMERIC(10,2) DEFAULT 0,

  service_charge NUMERIC(10,2) DEFAULT 0,

  total_amount NUMERIC(10,2) DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_order_staff
  FOREIGN KEY (staff_id)
  REFERENCES users(id),

  CONSTRAINT chk_order_status
  CHECK (
    order_status IN (
      'new',
      'preparing',
      'ready',
      'completed',
      'cancelled'
    )
  ),

  CONSTRAINT chk_order_type
  CHECK (order_type IN ('dine_in', 'take_away'))
);

-- ===========================
-- ORDER ITEMS
-- ===========================

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,

  order_id INT NOT NULL,

  menu_item_id INT NOT NULL,

  quantity INT NOT NULL DEFAULT 1,

  unit_price NUMERIC(10,2) NOT NULL,

  total_price NUMERIC(10,2) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_order
  FOREIGN KEY (order_id)
  REFERENCES orders(id)
  ON DELETE CASCADE,

  CONSTRAINT fk_menu_item
  FOREIGN KEY (menu_item_id)
  REFERENCES menu_items(id)
);

-- ===========================
-- PAYMENTS
-- ===========================

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,

  order_id INT UNIQUE NOT NULL,

  payment_method VARCHAR(20) NOT NULL,

  amount NUMERIC(10,2) NOT NULL,

  payment_status VARCHAR(20) DEFAULT 'paid',

  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_payment_order
  FOREIGN KEY (order_id)
  REFERENCES orders(id),

  CONSTRAINT chk_payment_method
  CHECK (
    payment_method IN (
      'cash',
      'card',
      'upi',
      'esewa',
      'khalti'
    )
  ),

  CONSTRAINT chk_payment_status
  CHECK (
    payment_status IN (
      'paid',
      'pending',
      'failed'
    )
  )
);

-- ===========================
-- INDEXES
-- ===========================

CREATE INDEX idx_user_email    ON users(email);
CREATE INDEX idx_order_staff   ON orders(staff_id);
CREATE INDEX idx_order_status  ON orders(order_status);
CREATE INDEX idx_menu_category ON menu_items(category_id);
CREATE INDEX idx_payment_order ON payments(order_id);
CREATE INDEX idx_users_reset_token ON users(password_reset_token) WHERE password_reset_token IS NOT NULL;

-- ===========================
-- SEED DATA — USERS
-- Passwords: Name@123 (bcrypt, 12 rounds)
-- Admin:    admin@gmail.com  / Admin@123
-- Staff:    ritika@gmail.com / Ritika@123
--           sujan@gmail.com  / Sujan@123
-- ===========================

INSERT INTO users (full_name, email, password_hash, phone, role) VALUES
  ('System Admin',   'admin@gmail.com',  '$2a$12$SkC9cUliD1T8m3Cu7D4tIeR54q1v5p6yZ7Hpcx1gVC5pYrNG7ZNy.', '9800000000', 'admin'),
  ('Prabin Koirala', 'probeengamer@gmail.com', '$2a$12$TjydPTxIc8tobl7c9luvbO418BQc.2BlCYZ3anWwaAZUesEH08jD.', '9811111111', 'admin'),
  ('Ritika Gautam',  'ritika@gmail.com', '$2a$12$fyZV6ucDD0ZZFlzgCCYy5uRzB2qXrYhY920waPCuwc7f05AU6M3Gq', '9822222222', 'staff'),
  ('Sujan Thapa',    'sujan@gmail.com',  '$2a$12$qlXsy8.aZ9ERd0z.WFBGse2zIpynBdI3q24ZfI6nUoAQ5QFqEFrq6', '9833333333', 'staff'),
  ('Anisha Sharma',  'anisha@gmail.com', '$2a$12$y9ww1jO.OGF6mZC5KUOn0ODY9dZL76Ams5COrE9ceDV92TFRQ1sGO', '9844444444', 'staff'),
  ('Rohan KC',       'rohan@gmail.com',  '$2a$12$v6VUv7glMP03.OvPVPSIMuZHjTC.mknSGAgVR5zuQ4MewIIxAbFha', '9855555555', 'staff')
ON CONFLICT (email) DO NOTHING;

-- ===========================
-- SEED DATA — CATEGORIES
-- ===========================

INSERT INTO categories (name, description) VALUES
  ('Coffee',    'Espresso-based and specialty coffee drinks'),
  ('Cold Drinks','Chilled beverages and cold brews'),
  ('Snacks',    'Light bites and savory snacks'),
  ('Food',      'Main meals and filling dishes'),
  ('Desserts',  'Sweet treats and pastries')
ON CONFLICT (name) DO NOTHING;

-- ===========================
-- SEED DATA — MENU ITEMS
-- ===========================

INSERT INTO menu_items (category_id, name, description, price, is_available) VALUES
  -- Coffee
  ((SELECT id FROM categories WHERE name='Coffee'), 'Cappuccino',       'Double shot espresso with steamed milk foam',            120, true),
  ((SELECT id FROM categories WHERE name='Coffee'), 'Latte',            'Smooth espresso with creamy steamed milk',               130, true),
  ((SELECT id FROM categories WHERE name='Coffee'), 'Americano',        'Bold espresso diluted with hot water',                   100, true),
  ((SELECT id FROM categories WHERE name='Coffee'), 'Flat White',       'Ristretto shots with velvety microfoam',                 140, true),
  ((SELECT id FROM categories WHERE name='Coffee'), 'Espresso',         'Pure concentrated coffee shot',                           80, true),
  ((SELECT id FROM categories WHERE name='Coffee'), 'Mocha',            'Espresso with chocolate syrup and steamed milk',         150, true),

  -- Cold Drinks
  ((SELECT id FROM categories WHERE name='Cold Drinks'), 'Cold Coffee',      'Chilled brew with milk and ice',                        110, true),
  ((SELECT id FROM categories WHERE name='Cold Drinks'), 'Iced Latte',       'Espresso over ice with cold milk',                      130, true),
  ((SELECT id FROM categories WHERE name='Cold Drinks'), 'Cold Brew',        'Slow-steeped smooth cold brew coffee',                  140, true),
  ((SELECT id FROM categories WHERE name='Cold Drinks'), 'Frappuccino',      'Blended ice coffee with whipped cream',                 170, true),
  ((SELECT id FROM categories WHERE name='Cold Drinks'), 'Lemonade',         'Fresh squeezed lemon with mint',                         80, true),
  ((SELECT id FROM categories WHERE name='Cold Drinks'), 'Mango Smoothie',   'Fresh mango blended with yogurt',                       120, true),

  -- Snacks
  ((SELECT id FROM categories WHERE name='Snacks'), 'Garlic Bread',     'Toasted bread with herb garlic butter',                   90, true),
  ((SELECT id FROM categories WHERE name='Snacks'), 'Masala Fries',     'Crispy fries tossed with house spice blend',             120, true),
  ((SELECT id FROM categories WHERE name='Snacks'), 'Spring Roll',      'Crispy veggie rolls with sweet chili sauce',             130, true),
  ((SELECT id FROM categories WHERE name='Snacks'), 'Nachos',           'Tortilla chips with cheese sauce and salsa',             150, true),
  ((SELECT id FROM categories WHERE name='Snacks'), 'Chicken Wings',    'Spiced wings with dipping sauce',                       180, true),

  -- Food
  ((SELECT id FROM categories WHERE name='Food'), 'Club Sandwich',    'Triple-decker with chicken, bacon, and veggies',          220, true),
  ((SELECT id FROM categories WHERE name='Food'), 'Veggie Burger',    'Grilled veggie patty with house sauce',                  180, true),
  ((SELECT id FROM categories WHERE name='Food'), 'Chicken Burger',   'Crispy chicken fillet with coleslaw',                    220, true),
  ((SELECT id FROM categories WHERE name='Food'), 'Pasta Arabiata',   'Penne in spicy tomato sauce',                            200, true),
  ((SELECT id FROM categories WHERE name='Food'), 'Paneer Wrap',      'Grilled paneer with mint chutney in a tortilla',         190, true),
  ((SELECT id FROM categories WHERE name='Food'), 'Caesar Salad',     'Romaine lettuce, croutons, parmesan, caesar dressing',   170, true),

  -- Desserts
  ((SELECT id FROM categories WHERE name='Desserts'), 'Brownie',          'Warm chocolate brownie with vanilla ice cream',          120, true),
  ((SELECT id FROM categories WHERE name='Desserts'), 'Cheesecake',       'New York style with berry coulis',                       160, true),
  ((SELECT id FROM categories WHERE name='Desserts'), 'Chocolate Lava',   'Warm molten chocolate cake',                             150, true),
  ((SELECT id FROM categories WHERE name='Desserts'), 'Tiramisu',         'Classic Italian coffee-soaked ladyfinger cake',          160, true),
  ((SELECT id FROM categories WHERE name='Desserts'), 'Waffle',           'Belgian waffle with maple syrup and berries',            140, true);
