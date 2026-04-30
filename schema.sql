-- PostgreSQL Database Schema for Pizza Order Application
-- Run this file to create all tables and relationships

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS "Messages" CASCADE;
DROP TABLE IF EXISTS "Orders" CASCADE;
DROP TABLE IF EXISTS "ContentBlocks" CASCADE;
DROP TABLE IF EXISTS "NewsletterSubscriptions" CASCADE;
DROP TABLE IF EXISTS "CustomizationOptions" CASCADE;
DROP TABLE IF EXISTS "Products" CASCADE;
DROP TABLE IF EXISTS "Promotions" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE "Users" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 100),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "passwordResetToken" VARCHAR(255),
    "passwordResetExpires" TIMESTAMP WITH TIME ZONE,
    "passwordChangedAt" TIMESTAMP WITH TIME ZONE,
    "otpCode" VARCHAR(255),
    "otpExpires" TIMESTAMP WITH TIME ZONE,
    "forcePasswordReset" BOOLEAN DEFAULT false,
    "isTemporaryPassword" BOOLEAN DEFAULT false,
    "accountStatus" VARCHAR(50) DEFAULT 'active' CHECK ("accountStatus" IN ('active', 'pending_staff_registration', 'inactive')),
    phone VARCHAR(255),
    address JSONB DEFAULT '{}',
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
    "isActive" BOOLEAN DEFAULT true,
    avatar VARCHAR(255) DEFAULT '',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE "categories" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(60) NOT NULL UNIQUE CHECK (name ~ '^[a-z0-9-]+$'),
    "displayName" VARCHAR(120) NOT NULL,
    description TEXT,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE "Products" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 100),
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    image TEXT DEFAULT '',
    ingredients TEXT[] DEFAULT '{}',
    sizes JSONB DEFAULT '[]',
    "isAvailable" BOOLEAN DEFAULT true,
    "preparationTime" INTEGER DEFAULT 15 CHECK ("preparationTime" >= 1),
    "nutritionalInfo" JSONB DEFAULT '{}',
    "dietaryInfo" JSONB DEFAULT '{}',
    "customizationOptions" JSONB DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    "spiceLevel" INTEGER DEFAULT 0 CHECK ("spiceLevel" >= 0 AND "spiceLevel" <= 5),
    "isPopular" BOOLEAN DEFAULT false,
    "isNew" BOOLEAN DEFAULT false,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON "Products"(category);
CREATE INDEX idx_products_isavailable ON "Products"("isAvailable");

-- Promotions Table
CREATE TABLE "Promotions" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    "discountType" VARCHAR(50) NOT NULL CHECK ("discountType" IN ('percentage', 'fixed')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    "startDate" TIMESTAMP WITH TIME ZONE,
    "endDate" TIMESTAMP WITH TIME ZONE,
    "isActive" BOOLEAN DEFAULT true,
    "usageLimit" INTEGER DEFAULT NULL CHECK ("usageLimit" IS NULL OR "usageLimit" >= 0),
    "usageCount" INTEGER DEFAULT 0 CHECK ("usageCount" >= 0),
    "minimumOrderAmount" DECIMAL(10,2) DEFAULT 0 CHECK ("minimumOrderAmount" >= 0),
    "maxDiscountAmount" DECIMAL(10,2) DEFAULT NULL CHECK ("maxDiscountAmount" IS NULL OR "maxDiscountAmount" >= 0),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK ("endDate" IS NULL OR "startDate" IS NULL OR "endDate" > "startDate")
);

CREATE UNIQUE INDEX idx_promotions_code ON "Promotions"(code);
CREATE INDEX idx_promotions_active_dates ON "Promotions"("isActive", "startDate", "endDate");

-- Orders Table
CREATE TABLE "Orders" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "orderNumber" VARCHAR(255) NOT NULL UNIQUE,
    "customerId" UUID NOT NULL REFERENCES "Users"(id),
    items JSONB NOT NULL DEFAULT '[]',
    "totalAmount" DECIMAL(10,2) NOT NULL CHECK ("totalAmount" >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    "paymentStatus" VARCHAR(50) DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending', 'paid', 'failed', 'refunded')),
    "paymentMethod" VARCHAR(50) DEFAULT 'online' CHECK ("paymentMethod" IN ('cash', 'card', 'online')),
    "deliveryAddress" JSONB DEFAULT '{}',
    "customerNotes" TEXT CHECK (LENGTH("customerNotes") <= 500),
    "staffNotes" TEXT CHECK (LENGTH("staffNotes") <= 500),
    "cancellationReason" TEXT,
    "cancelledBy" UUID REFERENCES "Users"(id),
    "estimatedDeliveryTime" TIMESTAMP WITH TIME ZONE,
    "actualDeliveryTime" TIMESTAMP WITH TIME ZONE,
    "stripePaymentIntentId" VARCHAR(255),
    "promotionId" UUID REFERENCES "Promotions"(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customerid ON "Orders"("customerId");
CREATE INDEX idx_orders_status ON "Orders"(status);
CREATE INDEX idx_orders_ordernumber ON "Orders"("orderNumber");
CREATE INDEX idx_orders_createdat ON "Orders"("createdAt");
CREATE INDEX idx_orders_stripe_payment_intent ON "Orders"("stripePaymentIntentId");

-- CustomizationOptions Table
CREATE TABLE "CustomizationOptions" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "optionType" VARCHAR(50) NOT NULL CHECK ("optionType" IN ('size', 'crust', 'sauce', 'cheese', 'topping')),
    name VARCHAR(100) NOT NULL,
    "displayName" VARCHAR(100) NOT NULL,
    "priceModifier" DECIMAL(10,2) DEFAULT 0 CHECK ("priceModifier" >= -50),
    category VARCHAR(50),
    "dietaryInfo" JSONB DEFAULT '{}',
    "isAvailable" BOOLEAN DEFAULT true,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customization_optiontype ON "CustomizationOptions"("optionType");
CREATE INDEX idx_customization_category ON "CustomizationOptions"(category);
CREATE INDEX idx_customization_isavailable ON "CustomizationOptions"("isAvailable");
CREATE INDEX idx_customization_sortorder ON "CustomizationOptions"("sortOrder");

-- Messages Table
CREATE TABLE "Messages" (
    id SERIAL PRIMARY KEY,
    "orderId" UUID NOT NULL REFERENCES "Orders"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    "senderId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    "receiverId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    content TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT false,
    "emailSent" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ContentBlocks Table
CREATE TABLE "ContentBlocks" (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'text' CHECK (type IN ('text', 'html', 'markdown', 'image_url', 'json')),
    content TEXT NOT NULL,
    "lastUpdatedBy" UUID REFERENCES "Users"(id) ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- NewsletterSubscriptions Table
CREATE TABLE "NewsletterSubscriptions" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    "isActive" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function for updating updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "Users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON "Products" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON "Promotions" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "Orders" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customization_updated_at BEFORE UPDATE ON "CustomizationOptions" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON "Messages" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contentblocks_updated_at BEFORE UPDATE ON "ContentBlocks" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_updated_at BEFORE UPDATE ON "NewsletterSubscriptions" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
