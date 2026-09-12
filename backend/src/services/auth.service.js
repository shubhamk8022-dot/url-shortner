const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRepository = require("../repositories/auth.repository");

const SALT_ROUNDS = 12;

const registerUser = async (name, email, password) => {
    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
        const error = new Error("Email is already registered");
        error.code = "EMAIL_ALREADY_EXISTS";

        throw error;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return await authRepository.createUser(
        name,
        email,
        passwordHash
    );
};


const loginUser = async (email, password) => {

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        const error = new Error("Invalid email or password");
        error.code = "INVALID_CREDENTIALS";

        throw error;
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        const error = new Error("Invalid email or password");
        error.code = "INVALID_CREDENTIALS";

        throw error;
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};


module.exports = {
    registerUser,
    loginUser
};