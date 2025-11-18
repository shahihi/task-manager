const { User } = require('../models/user')
const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join('utils', 'users.json');
const TEMPLATE_FILE = path.join('utils', 'users.template.json');

async function addUser(req, res) {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const newUser = new User(name, email, password, confirmPassword);

        let users = [];
        try {
            const data = await fs.readFile(USERS_FILE, 'utf8');
            users = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                users = JSON.parse(templateData);

                await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
            } else {
                throw err;
            }
        }
        users.push(newUser);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');

        return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { addUser };