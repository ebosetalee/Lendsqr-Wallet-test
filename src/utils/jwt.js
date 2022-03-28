import jwt from "jsonwebtoken";

export async function generateJwtToken(data) {
    return jwt.sign(
        {
            id: data.id, // We are gonna use this in the middleware 'isAuth'
            email: data.email,
            account_number: data.account_number,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION },
    );
}

export const tokenVerifier = async authToken => {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

    return decoded;
};
