-- 检查 Market 表中所有 NFT 相关的列
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Market' 
  AND column_name LIKE '%nft%'
ORDER BY ordinal_position;

