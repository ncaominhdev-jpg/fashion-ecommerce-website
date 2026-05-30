ALTER TABLE brands
ADD COLUMN status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
