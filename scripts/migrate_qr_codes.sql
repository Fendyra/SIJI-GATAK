-- Supabase SQL Editor Script
-- Update existing qr_code values to full URLs

UPDATE rumah
SET qr_code = 'http://localhost:3000/scan/' || qr_code
WHERE qr_code NOT LIKE 'http%';

-- For production, replace 'http://localhost:3000' with your actual domain
