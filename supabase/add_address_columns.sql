-- Patients 테이블에 주소 관련 컬럼 추가
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS detail_address TEXT;

-- (선택 사항) 기존 데이터와의 일관성을 위해 코멘트 추가
COMMENT ON COLUMN patients.zip_code IS '우편번호';
COMMENT ON COLUMN patients.address IS '도로명/지번 주소';
COMMENT ON COLUMN patients.detail_address IS '상세 주소';
