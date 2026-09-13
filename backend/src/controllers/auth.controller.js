const authService = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Name, email and password are required"
            });
        }

        const user = await authService.registerUser(
            name,
            email,
            password
        );

        return res.status(201).json({
            status: "success",
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                status: "error",
                message: "Email is already registered"
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Failed to register user"
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required"
            });
        }

        const result = await authService.loginUser(
            email,
            password
        );

        return res.status(200).json({
            status: "success",
            data: result
        });

    } catch (error) {
        console.error("Login error:", error);

        if (error.code === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Failed to login"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        return res.status(200).json({
            status: "success",
            data: {
                userId: req.user.userId,
                email: req.user.email
            }
        });
    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            status: "error",
            message: "Failed to get profile"
        });
    }
};


module.exports = {
    register,
    login,
    getProfile
};