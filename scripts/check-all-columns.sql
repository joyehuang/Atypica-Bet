-- 检查 Market 表中所有列
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'Market' 
ORDER BY ordinal_position;

