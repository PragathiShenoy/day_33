const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 4000; 
const FILES_DIR = path.join(__dirname, 'files');

fs.ensureDirSync(FILES_DIR);

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.post('/create-file', (req, res) => {
    const now = new Date();
    const timestamp = now.toISOString();
    const filename = `${now.toISOString().replace(/:/g, '-')}.txt`;
    const filePath = path.join(FILES_DIR, filename);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            return res.status(500).send('Error creating file');
        }
        res.send(`File ${filename} created with timestamp: ${timestamp}`);
    });
});

app.get('/getUsers', async (req, res) => {
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

