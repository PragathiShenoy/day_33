const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const FILES_DIR = path.join(__dirname, 'files');

// Ensure the files directory exists
fs.ensureDirSync(FILES_DIR);

// API Documentation Endpoint
app.get('/', (req, res) => {
    res.send(`
        <h1>API Documentation</h1>
        <p>Welcome to the API. Below are the available endpoints:</p>
        <ul>
            <li><strong>POST /create-file</strong>: Create a text file with the current timestamp</li>
            <li><strong>GET /files</strong>: Retrieve a list of all text files in the files directory</li>
        </ul>
    `);
});

// Endpoint to create a text file with current timestamp
app.post('/create-file', (req, res) => {
    const now = new Date();
    const timestamp = now.toISOString();
    const filename = `${now.toISOString().replace(/:/g, '-')}.txt`;
    const filePath = path.join(FILES_DIR, filename);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            return res.status(500).send('Error creating file');
        }
        res.send(`File ${filename} created`);
    });
});

// Endpoint to retrieve all text files
app.get('/files', async (req, res) => {
    try {
        const files = await fs.readdir(FILES_DIR);
        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.json(textFiles);
    } catch (err) {
        res.status(500).send('Error reading files directory');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
