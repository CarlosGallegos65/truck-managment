import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import * as dotenv from 'dotenv';
dotenv.config();

const routeProtect = async (req, res, next) => {
    
    // Verify if token exists
    const {_token} = req.cookies;

    if(!_token) {
        return res.redirect('/auth/login');
    }

    // Check token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id, '-password -status');

        if(user) {
            req.user = user;
        } else {
            return res.redirect('/auth/login');
        }

        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default routeProtect;