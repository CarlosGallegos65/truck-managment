import jwt from 'jsonwebtoken';

// Generate a new jwt to authenticate a session
const generateJWT = (data) => jwt.sign({id: data.id, name: data.name, email: data.email, img: data.img}, process.env.JWT_SECRET, { expiresIn: '1d'});

const generateID = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
    generateJWT,
    generateID
}