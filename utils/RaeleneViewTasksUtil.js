const fs = require('fs').promises;
const path = require('path');

// tasks.json is in the same folder as this file (utils/)
const TASKS_FILE = path.join(__dirname, 'tasks.json');

async function viewTasks(req, res) {
    //uncomment to test error handling in frontend
    // throw new Error('Not implemented');
    try {
        const data = await fs.readFile(TASKS_FILE, 'utf8');
        const allTasks = JSON.parse(data);

        // Make sure the variable name matches exactly
        return res.status(200).json(allTasks);
    } catch (error) {
        // If file doesn't exist yet → return empty array
        if (error.code === 'ENOENT') {
            return res.status(200).json([]);
        }

        // For other errors (e.g. corrupted JSON, typos, etc.)
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { viewTasks };
