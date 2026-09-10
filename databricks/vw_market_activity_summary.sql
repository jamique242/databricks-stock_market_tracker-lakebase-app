CREATE OR REPLACE VIEW `dataexpert-portfolio`.`market-data-tracker`.gold_watchlist_activity_summary AS
SELECT
    symbol,
    COUNT(*) AS total_events,
    SUM(CASE WHEN change_type = 'insert' THEN 1 ELSE 0 END) AS additions,
    SUM(CASE WHEN change_type = 'update_postimage' THEN 1 ELSE 0 END) AS updates,
    SUM(CASE WHEN change_type = 'delete' THEN 1 ELSE 0 END) AS removals,
    MAX(end_date) AS last_activity
FROM `dataexpert-portfolio`.`market-data-tracker`.dim_market_activity
GROUP BY symbol;