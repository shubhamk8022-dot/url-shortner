const dbConnectionPool = require("../config/db.config");


const createUser = async (name,email,passwordHash)=>{
        
        const query = `INSERT INTO users
                        (name,email,password_hash)
                        VALUES (? , ?, ?)`;

        const [result] = await dbConnectionPool.execute(query,[
            name,email,passwordHash
        ])

        return {
            id:result.insertId,
            name,
            email
        }
}


const findUserByEmail = async (email)=>{

    const query = `select 
                    id,
                    name,
                    email,
                    password_hash,
                    created_at
                    from users
                    where email=?
                    limit 1`;
    const [rows] = await dbConnectionPool.execute(query,[email])
    return rows[0] || null;
}

module.exports = {createUser,findUserByEmail}