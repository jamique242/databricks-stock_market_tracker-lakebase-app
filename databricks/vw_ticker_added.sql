CREATE OR REPLACE VIEW `dataexpert-portfolio`.`market-data-tracker`.gold_recently_added_tickers AS
SELECT
    symbol,
    COUNT(*) AS times_added,
    MAX(updated_at) AS last_added_at
FROM `dataexpert-portfolio`.`market-data-tracker`.lb_watchlist_history
WHERE `_pg_change_type` = 'insert'
GROUP BY symbol
ORDER BY last_added_at DESC;