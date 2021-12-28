const { verify } = require("jsonwebtoken");

module.exports = {
    verifyToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    res.status(401).json({
                        success: 0,
                        message: "Invalid Token or Token Got Expired",
                    });
                } else {
                    req.employee = decoded;
                    next();
                }
            });
        } else {

            res.status(401).json({
                success: 0,
                message: "Access denied! unauthorized user",
            });
        }
    },
};