const dbConnectionPool = require("../config/db.config");

const createUrl = async (userId, originalUrl, shortCode) => {
    const query = `
        INSERT INTO urls
            (user_id, original_url, short_code)
        VALUES
            (?, ?, ?)
    `;

    const [result] = await dbConnectionPool.execute(query, [
        userId,
        originalUrl,
        shortCode
    ]);

    return {
        id: result.insertId,
        userId,
        originalUrl,
        shortCode
    };
};

const findByShortCode = async (shortCode) => {
    const query = `
        SELECT
            id,
            user_id,
            original_url,
            short_code,
            expires_at,
            created_at
        FROM urls
        WHERE short_code = ?
        LIMIT 1
    `;

    const [rows] = await dbConnectionPool.execute(query, [shortCode]);

    return rows[0] || null;
};

module.exports = {
    createUrl,
    findByShortCode
};