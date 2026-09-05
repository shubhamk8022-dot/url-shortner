// const pool = require("../config/database");
const dbConnectionPool = require("../config/db.config.js")
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

module.exports = {
    createUrl
};