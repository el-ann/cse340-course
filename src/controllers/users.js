import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

const saltRounds = 10;

const showUserRegistrationForm = async (req, res) => {
    const title = 'Register';

    res.render('register', { title });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! You can now log in.');
        res.redirect('/register');
    } catch (error) {
        if (error.code === '23505') {
            // Postgres unique constraint violation (duplicate email)
            req.flash('error', 'An account with that email already exists.');
        } else {
            req.flash('error', 'Something went wrong during registration. Please try again.');
        }
        res.redirect('/register');
    }
};

const showLoginForm = async (req, res) => {
    const title = 'Login';

    res.render('login', { title });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    if (user) {
        req.session.user = user;
        req.flash('success', 'Login successful!');
        console.log('Logged in user:', user);
        res.redirect('/dashboard');
    } else {
        req.flash('error', 'Invalid email or password.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to view that page.');
        return res.redirect('/login');
    }

    next();
};

const showDashboard = async (req, res) => {
    const { name, email } = req.session.user;
    const title = 'Dashboard';

    res.render('dashboard', { title, name, email });
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard
};