-- 1. Bảng categories
INSERT INTO categories (name) VALUES 
('Điện tử'),
('Gia dụng'),
('Thời trang'),
('Thực phẩm');

-- 2. Bảng users
-- Mật khẩu mặc định có thể là hash hoặc text thường tuỳ bạn xử lý (ở đây dùng text mẫu)
INSERT INTO users (username, password, email, phone_number, company_name, tax_code, role, status) VALUES 
('admin1', '123456', 'admin@example.com', '0901234567', 'Công ty Admin', '123456789', 'admin', 'active'),
('retailer1', '123456', 'retailer1@example.com', '0912345678', 'Cửa hàng Bán Lẻ 1', '987654321', 'retailer', 'active'),
('retailer2', '123456', 'retailer2@example.com', '0923456789', 'Đại lý Phân phối A', '456789123', 'retailer', 'pending');

-- 3. Bảng products
INSERT INTO products (sku, name, wholesale_price, min_order_qty, stock_quantity, status, category_id, manufacturer_name, origin_country, image_url) VALUES 
('SP-DT-001', 'Điện thoại thông minh X1', 10500000.00, 5, 150, 'active', 1, 'Hãng A', 'Việt Nam', ''),
('SP-DT-002', 'Laptop Gaming Pro', 25000000.00, 2, 50, 'active', 1, 'Hãng B', 'Trung Quốc', ''),
('SP-GD-001', 'Máy xay sinh tố', 500000.00, 10, 300, 'active', 2, 'Hãng C', 'Thái Lan', ''),
('SP-TT-001', 'Áo thun nam Cotton', 120000.00, 50, 1000, 'active', 3, 'Xưởng may Z', 'Việt Nam', ''),
('SP-TP-001', 'Bánh quy bơ hộp thiếc', 85000.00, 20, 500, 'inactive', 4, 'Công ty Bánh Kẹo', 'Pháp', '');

-- 4. Bảng orders
INSERT INTO orders (retailer_id, shipping_address, receiver_name, receiver_phone, shipping_fee, total_amount, payment_method, payment_status, status) VALUES 
(2, '123 Đường A, Quận 1, TP.HCM', 'Nguyễn Văn A', '0912345678', 50000.00, 21550000.00, 'bank_transfer', 'paid', 'shipping'),
(3, '456 Đường B, Quận Đống Đa, Hà Nội', 'Trần Thị B', '0923456789', 30000.00, 6000000.00, 'cod', 'unpaid', 'pending');

-- 5. Bảng order_items
-- Đơn hàng 1: Mua 2 Điện thoại và 1 Máy xay sinh tố
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES 
(1, 1, 2, 10500000.00),
(1, 3, 1, 500000.00);

-- Đơn hàng 2: Mua 50 Áo thun nam
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES 
(2, 4, 50, 120000.00);
