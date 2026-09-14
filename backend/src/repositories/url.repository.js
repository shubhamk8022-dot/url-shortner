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
    shortCode,
  ]);

  return {
    id: result.insertId,
    userId,
    originalUrl,
    shortCode,
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

const findUrlsByUserId = async (user_id, limit, offset) => {
  const query = `SELECT id, short_code, original_url,created_at,expires_at
FROM urls 
WHERE user_id = ? 
LIMIT ? 
OFFSET ?;
`;
  const rows = await dbConnectionPool.execute(query, [user_id, limit, offset]);
  return rows[0];
};

const findUrlById = async (user_id, url_id) => {
  const query = `SELECT 
                    id, short_code, original_url,created_at,expires_at
                    FROM urls 
                    WHERE user_id = ? and id = ?;`;
  const rows = await dbConnectionPool.execute(query, [user_id, url_id]);
  return rows[0] || null;
};

const updateUrlById = async (user_id, url_id, new_url) => {
  const query = `UPDATE urls
                    SET original_url = ?
                    WHERE user_id=? and id=?;`;
  const result = await dbConnectionPool.execute(query, [
    new_url,
    user_id,
    url_id,
  ]);
  return result[0]
};


const deleteUrlById = async (user_id,url_id) => {
    const query = ` DELETE 
                    FROM urls
                    WHERE 
                    user_id=? AND id=?;`;
    const result = await dbConnectionPool.execute(query,[user_id,url_id]);
    return result[0]
}
module.exports = {
  createUrl,
  findByShortCode,
  findUrlsByUserId,
  findUrlById,
  updateUrlById,
  deleteUrlById
};
