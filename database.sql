-- ========================================
-- AFFILIATE MARKETING PLATFORM DATABASE
-- MySQL/MariaDB Compatible Schema
-- ========================================

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS affiliate_platform;
CREATE DATABASE affiliate_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE affiliate_platform;

-- ========================================
-- ENUMS (using ENUM type for MySQL)
-- ========================================

-- ========================================
-- USER PROFILES TABLE
-- ========================================
CREATE TABLE profiles (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    full_name VARCHAR(255) DEFAULT NULL,
    role ENUM('admin', 'affiliate', 'advertiser') DEFAULT 'affiliate',
    wallet_address VARCHAR(255) DEFAULT NULL,
    avatar_url TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_profiles_role (role),
    INDEX idx_profiles_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- USER SUSPENSIONS TABLE
-- ========================================
CREATE TABLE user_suspensions (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    reason TEXT NOT NULL,
    suspended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    suspended_by CHAR(36) DEFAULT NULL,
    lifted_at TIMESTAMP NULL DEFAULT NULL,
    lifted_by CHAR(36) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (suspended_by) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (lifted_by) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_user_suspensions_user_id (user_id),
    INDEX idx_user_suspensions_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- CAMPAIGNS TABLE
-- ========================================
CREATE TABLE campaigns (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    tracking_url TEXT NOT NULL,
    banner_url TEXT DEFAULT NULL,
    commission_type ENUM('CPA', 'Revenue Share', 'CPC') NOT NULL,
    commission_value DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'active', 'paused', 'rejected') DEFAULT 'pending',
    advertiser_id CHAR(36) DEFAULT NULL,
    approved_by CHAR(36) DEFAULT NULL,
    approved_at TIMESTAMP NULL DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (advertiser_id) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_campaigns_status (status),
    INDEX idx_campaigns_advertiser_id (advertiser_id),
    INDEX idx_campaigns_commission_type (commission_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- REFERRALS TABLE
-- ========================================
CREATE TABLE referrals (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    affiliate_id CHAR(36) DEFAULT NULL,
    campaign_id CHAR(36) DEFAULT NULL,
    ref_code VARCHAR(32) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (affiliate_id) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_referrals_affiliate_id (affiliate_id),
    INDEX idx_referrals_campaign_id (campaign_id),
    INDEX idx_referrals_ref_code (ref_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- CLICKS TABLE
-- ========================================
CREATE TABLE clicks (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    referral_id CHAR(36) DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    country VARCHAR(2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE CASCADE,
    INDEX idx_clicks_referral_id (referral_id),
    INDEX idx_clicks_ip_address (ip_address),
    INDEX idx_clicks_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- CONVERSIONS TABLE
-- ========================================
CREATE TABLE conversions (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    referral_id CHAR(36) DEFAULT NULL,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    commission_earned DECIMAL(10,2) DEFAULT 0.00,
    conversion_data JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE CASCADE,
    INDEX idx_conversions_referral_id (referral_id),
    INDEX idx_conversions_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- WALLET TRANSACTIONS TABLE
-- ========================================
CREATE TABLE wallet_transactions (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    affiliate_id CHAR(36) DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('commission', 'payout', 'adjustment') DEFAULT 'commission',
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payout_method VARCHAR(50) DEFAULT NULL,
    payout_details JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (affiliate_id) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_wallet_transactions_affiliate_id (affiliate_id),
    INDEX idx_wallet_transactions_type (type),
    INDEX idx_wallet_transactions_status (status),
    INDEX idx_wallet_transactions_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PAYOUT REQUESTS TABLE
-- ========================================
CREATE TABLE payout_requests (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    affiliate_id CHAR(36) DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method ENUM('paypal', 'bank_transfer', 'crypto') DEFAULT 'paypal',
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    transaction_id VARCHAR(255) DEFAULT NULL,
    payout_details JSON DEFAULT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL DEFAULT NULL,
    processed_by CHAR(36) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (affiliate_id) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (processed_by) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_payout_requests_affiliate_id (affiliate_id),
    INDEX idx_payout_requests_status (status),
    INDEX idx_payout_requests_requested_at (requested_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- FRAUD ALERTS TABLE
-- ========================================
CREATE TABLE fraud_alerts (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id CHAR(36) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('open', 'investigating', 'resolved', 'false_positive') DEFAULT 'open',
    data JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL DEFAULT NULL,
    resolved_by CHAR(36) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (resolved_by) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_fraud_alerts_type (type),
    INDEX idx_fraud_alerts_entity_type (entity_type),
    INDEX idx_fraud_alerts_entity_id (entity_id),
    INDEX idx_fraud_alerts_status (status),
    INDEX idx_fraud_alerts_severity (severity),
    INDEX idx_fraud_alerts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BLOG POSTS TABLE
-- ========================================
CREATE TABLE blog_posts (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT DEFAULT NULL,
    content LONGTEXT DEFAULT NULL,
    featured_image TEXT DEFAULT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    author_id CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_blog_posts_status (status),
    INDEX idx_blog_posts_author_id (author_id),
    INDEX idx_blog_posts_slug (slug),
    INDEX idx_blog_posts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TRIGGERS FOR UPDATED_AT COLUMNS
-- ========================================
DELIMITER $$

CREATE TRIGGER profiles_updated_at_trigger
    BEFORE UPDATE ON profiles
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER campaigns_updated_at_trigger
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER blog_posts_updated_at_trigger
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

DELIMITER ;

-- ========================================
-- SEED DATA - ADMIN ACCOUNTS
-- ========================================
INSERT INTO profiles (id, full_name, role, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Super Admin', 'admin', '2024-01-01 00:00:00'),
('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'advertiser', '2024-01-01 00:00:00'),
('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'affiliate', '2024-01-01 00:00:00'),
('550e8400-e29b-41d4-a716-446655440003', 'Mike Wilson', 'affiliate', '2024-01-01 00:00:00'),
('550e8400-e29b-41d4-a716-446655440004', 'Emma Davis', 'advertiser', '2024-01-01 00:00:00');

-- ========================================
-- SEED DATA - SAMPLE CAMPAIGNS
-- ========================================
INSERT INTO campaigns (id, title, description, tracking_url, commission_type, commission_value, status, advertiser_id, approved_by, approved_at, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Premium SaaS Tool Promotion', 'Promote our premium SaaS productivity tool with 30-day free trial', 'https://example-saas.com/signup?ref=', 'Revenue Share', 25.00, 'active', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-01-02 10:00:00', '2024-01-02 09:00:00'),
('660e8400-e29b-41d4-a716-446655440001', 'E-commerce Fashion Store', 'High-converting fashion e-commerce with trending products', 'https://fashion-store.com/ref/', 'CPA', 15.00, 'active', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '2024-01-03 14:30:00', '2024-01-03 12:00:00'),
('660e8400-e29b-41d4-a716-446655440002', 'Online Course Platform', 'Educational platform offering programming and business courses', 'https://learn-platform.com/signup?affiliate=', 'CPC', 2.50, 'active', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-01-04 11:15:00', '2024-01-04 08:30:00'),
('660e8400-e29b-41d4-a716-446655440003', 'Fitness App Subscription', 'Mobile fitness app with personalized workout plans', 'https://fitness-app.com/join?ref=', 'Revenue Share', 30.00, 'pending', '550e8400-e29b-41d4-a716-446655440004', NULL, NULL, '2024-01-05 16:45:00');

-- ========================================
-- SEED DATA - REFERRALS
-- ========================================
INSERT INTO referrals (id, affiliate_id, campaign_id, ref_code, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000', 'sarahjohn01', '2024-01-05 10:00:00'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'sarahjohn02', '2024-01-06 11:30:00'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440000', 'mikewils01', '2024-01-07 14:15:00'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'mikewils02', '2024-01-08 09:45:00');

-- ========================================
-- SEED DATA - SAMPLE CLICKS
-- ========================================
INSERT INTO clicks (id, referral_id, ip_address, user_agent, country, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'US', '2024-01-10 10:30:00'),
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440000', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'CA', '2024-01-10 12:15:00'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', 'UK', '2024-01-11 14:20:00'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', '192.168.1.103', 'Mozilla/5.0 (Android 11; Mobile; rv:95.0) Gecko/95.0', 'DE', '2024-01-12 16:45:00');

-- ========================================
-- SEED DATA - CONVERSIONS
-- ========================================
INSERT INTO conversions (id, referral_id, revenue, commission_earned, conversion_data, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 299.99, 75.00, '{"product": "Premium Plan", "subscription_length": 12}', '2024-01-12 10:30:00'),
('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 89.99, 15.00, '{"product": "Fashion Bundle", "items": 3}', '2024-01-13 15:20:00'),
('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 199.99, 50.00, '{"product": "Annual Subscription", "discount_applied": true}', '2024-01-14 11:45:00');

-- ========================================
-- SEED DATA - WALLET TRANSACTIONS
-- ========================================
INSERT INTO wallet_transactions (id, affiliate_id, amount, type, status, created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 75.00, 'commission', 'completed', '2024-01-12 10:35:00'),
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 15.00, 'commission', 'completed', '2024-01-13 15:25:00'),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 50.00, 'commission', 'completed', '2024-01-14 11:50:00'),
('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', -50.00, 'payout', 'pending', '2024-01-15 09:00:00');

-- ========================================
-- SEED DATA - PAYOUT REQUESTS
-- ========================================
INSERT INTO payout_requests (id, affiliate_id, amount, method, status, requested_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 50.00, 'paypal', 'pending', '2024-01-15 09:00:00'),
('bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 50.00, 'bank_transfer', 'completed', '2024-01-10 14:30:00');

-- ========================================
-- SEED DATA - BLOG POSTS
-- ========================================
INSERT INTO blog_posts (id, title, slug, excerpt, content, status, author_id, created_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440000', 'How to Get Started as an Affiliate', 'how-to-get-started-as-affiliate', 'Learn the basics of affiliate marketing and how to start earning commissions', 'Complete guide content here...', 'published', '550e8400-e29b-41d4-a716-446655440000', '2024-01-01 12:00:00'),
('cc0e8400-e29b-41d4-a716-446655440001', 'Creating Your First Campaign', 'creating-your-first-campaign', 'Step-by-step guide to creating effective affiliate campaigns', 'Detailed campaign creation guide...', 'published', '550e8400-e29b-41d4-a716-446655440000', '2024-01-02 10:30:00'),
('cc0e8400-e29b-41d4-a716-446655440002', 'Best Practices for Affiliate Marketing', 'best-practices-affiliate-marketing', 'Tips and strategies for successful affiliate marketing', 'Best practices content...', 'published', '550e8400-e29b-41d4-a716-446655440000', '2024-01-03 14:15:00');

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- Affiliate performance view
CREATE VIEW affiliate_performance AS
SELECT 
    p.id as affiliate_id,
    p.full_name,
    COUNT(DISTINCT r.id) as total_referrals,
    COUNT(DISTINCT c.id) as total_clicks,
    COUNT(DISTINCT conv.id) as total_conversions,
    COALESCE(SUM(conv.commission_earned), 0) as total_earnings,
    CASE 
        WHEN COUNT(DISTINCT c.id) > 0 
        THEN ROUND((COUNT(DISTINCT conv.id) * 100.0 / COUNT(DISTINCT c.id)), 2)
        ELSE 0 
    END as conversion_rate
FROM profiles p
LEFT JOIN referrals r ON p.id = r.affiliate_id
LEFT JOIN clicks c ON r.id = c.referral_id
LEFT JOIN conversions conv ON r.id = conv.referral_id
WHERE p.role = 'affiliate'
GROUP BY p.id, p.full_name;

-- Campaign performance view
CREATE VIEW campaign_performance AS
SELECT 
    camp.id as campaign_id,
    camp.title,
    camp.status,
    COUNT(DISTINCT r.id) as total_referrals,
    COUNT(DISTINCT c.id) as total_clicks,
    COUNT(DISTINCT conv.id) as total_conversions,
    COALESCE(SUM(conv.revenue), 0) as total_revenue,
    COALESCE(SUM(conv.commission_earned), 0) as total_commission_paid
FROM campaigns camp
LEFT JOIN referrals r ON camp.id = r.campaign_id
LEFT JOIN clicks c ON r.id = c.referral_id
LEFT JOIN conversions conv ON r.id = conv.referral_id
GROUP BY camp.id, camp.title, camp.status;

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX idx_wallet_balance ON wallet_transactions (affiliate_id, status, type);
CREATE INDEX idx_referral_performance ON referrals (affiliate_id, campaign_id, created_at);
CREATE INDEX idx_conversion_tracking ON conversions (referral_id, created_at);
CREATE INDEX idx_fraud_monitoring ON clicks (ip_address, created_at);

-- ========================================
-- COMPLETION MESSAGE
-- ========================================
SELECT 'Database schema created successfully!' as message,
       'Ready for affiliate marketing platform' as status,
       NOW() as created_at;