import { validateRegister, validateLogin, validateEmail, validatePassword } from '../validations/userValidations.js';
import User from '../models/user.js';
import { generateJWT, generateID } from '../helpers/tokens.js';
import { registerEmail, resetPasswordEmail } from '../helpers/email.js';

// Login Form
const loginForm = (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        csrfToken: req.csrfToken()
    });
}

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    let errors = await validateLogin(req);

    if(!errors.isEmpty()) {
        return res.render('auth/login', {
            title: 'Login',
            errors: errors.array(),
            csrfToken: req.csrfToken(),
            user: {
                email
            }
        });
    }

    // Verify if user exists
    const user = await User.findOne({email, status:true});
    if(!user) {
        return res.render('auth/login', {
            title: 'Login',
            errors: [{msg:'This email doesn\'t exists'}],
            csrfToken: req.csrfToken(),
            user: {
                email
            }
        });
    }
    
    // Check if the passwords match
    const match = await user.validatePassword(password, user.password);
    if(!match) {
        return res.render('auth/login', {
            title: 'Login',
            errors: [{msg:'Password Incorrect'}],
            csrfToken: req.csrfToken()
        });
    }

    // Authenticate user
    const token = generateJWT({id: user.id, name: user.name, email, img: user.img});
    
    return res.cookie('_token', token, {
        httpOnly: true
    }).redirect('/manage/manage-outputs');
}

// Logout
const logout = (req, res) => {
    // Clean the cookie and redirect
    res.clearCookie('_token').status(200).redirect('/auth/login');
}

const registerForm = (req, res) => {
    res.render('auth/register', {
        title: 'Register',
        csrfToken: req.csrfToken()
    });
} 

// Create user
const createAccount = async (req, res) => {  
    const data = req.body;
    let { name, email, password } = data;
    name = name.trim();
    email = email.trim();

    // Validations
    let errors = await validateRegister(req);

    // If find errors return errors array
    if(!errors.isEmpty()) {
        return res.render('auth/register', {
            title: 'Register',
            errors: errors.array(),
            csrfToken: req.csrfToken(),
            user: {
                name,
                email
            }
        });
    }

    // Verify if the email exists
    const existsUser = await User.findOne({email: data.email});
    
    if(existsUser) {
        return res.render('auth/register', {
            title: 'Register',
            errors: [{msg: 'This email alredy exists'}],
            user: {
                name,
                email
            },
            csrfToken: req.csrfToken()
        });
    }

    // Create new user
    const user = new User({
        name,
        email,
        password,
        token: generateID()
    });

    try {
        await user.save();

        // Confirm account
        registerEmail({
            name: user.name,
            email: user.email,
            token: user.token
        });

        res.render('templates/message', {
            title: 'Account created',
            msg: 'We have sent a confirmation email'
        });
    } catch (error) {
        res.status(500).json(error);
    }

}

// validate account
const confirm = async (req, res) => {
    const {token} = req.params;

    // Verify if token is valid
    const user = await User.findOne({token});

    if(!user) {
        return res.render('auth/confirm-account', {
            title: 'Error',
            msg: 'This token is invalid',
            error: true
        });
    }

    try {
        // Confirm account
        await user.updateOne({token: null, status: true});
    
        return res.render('auth/confirm-account', {
            title: 'Account Confirmed',
            msg: 'Your account has been confirmed'
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

// Forgot my password form
const forgotPasswordForm = (req, res) => {
    res.render('auth/forgot-password', {
        title: 'Forgot my password',
        csrfToken: req.csrfToken()
    });
}

// Reset password
const resetPassword = async (req, res) => {

    const { email } = req.body;

    let errors = await validateEmail(req);

    if(!errors.isEmpty()) {
        return res.render('auth/forgot-password', {
            title: 'Forgot my password',
            csrfToken: req.csrfToken(),
            errors: errors.array()
        });
    }

    const user = await User.findOne({email, status: true});

    // If this email is not registered send an error message
    if(!user) {
        return res.render('auth/forgot-password', {
            title: 'Forgot my password',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'This email doesn\t exists'}]
        });
    }

    try {
        
        user.token = generateID();
        await user.save();

        resetPasswordEmail({
            name: user.name,
            email: user.email,
            token: user.token
        });

        res.render('templates/message', {
            title: 'Forgot my password',
            msg: 'We have sent a confirmation email'
        });

    } catch (error) {
        res.status(500).json(error);
    }
}

// Verify token
const compareToken = async (req, res) => {
    
    const {token} = req.params;

    const user = await User.findOne({token});

    if(!user) {
        return res.render('auth/confirm-account', {
            title: 'Error',
            msg: 'This token is invalid',
            error: true
        });
    }

    res.render('auth/change-password', {
        title: 'Change Password',
        csrfToken: req.csrfToken()
    });
}

// Chenage password
const changePassword = async (req, res) => {
    
    const {token} = req.params;
    const {password} = req.body;

    let errors = await validatePassword(req);

    if(!errors.isEmpty()) {
        return res.render('auth/change-password', {
            title: 'Forgot my password',
            csrfToken: req.csrfToken(),
            errors: errors.array()
        });
    }

    try {
        const user = await User.findOne({token});
        // Hash the new password
        user.password = password;
        user.token = null;
        await user.save();

        res.render('templates/message', {
            title: 'Change Password',
            msg: 'Your password has been successfully changed'
        });

    } catch (error) {
        res.status(500).json(error);
    }

}

export {
    loginForm,
    login,
    registerForm,
    createAccount,
    confirm,
    logout,
    forgotPasswordForm,
    resetPassword,
    compareToken,
    changePassword
}