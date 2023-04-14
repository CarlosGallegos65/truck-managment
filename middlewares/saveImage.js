import multer from 'multer';
import path from 'path';
import {generateID} from '../helpers/tokens.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';

// Save user image
const storage = multer.diskStorage({
    // Move image to static folder uploads
    destination: function(req, file, done) {
        done(null, './public/uploads/');
    },
    // Change the file name
    filename: function(req, file, done) {
        // Get name from the current image
        const {_token} = req.cookies;
        const {img} = jwt.verify(_token, process.env.JWT_SECRET);
        const src = path.join(`public/uploads/${img}`);

        // Delete current image
        fs.rm(src, {force:true}, (err) => {
            if(err) throw err;
        });

        // Upload the new image
        done(null, generateID() + path.extname(file.originalname));
    }
});

// Pass the config function
const upload = multer({storage});

export default upload;