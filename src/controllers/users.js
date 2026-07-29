import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';

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

export { showUserRegistrationForm, processUserRegistrationForm };