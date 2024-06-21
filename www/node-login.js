const express = require('express');
const bodyParser = require('body-parser');
const { NodeSSH } = require('node-ssh');
const fs = require('fs');

const app = express();
const ssh = new NodeSSH();

app.use(bodyParser.json());

app.post('/upload', (req, res) => {
    const data = req.body;
    const json = JSON.stringify(data);
    const filename = 'form_data.json';

    fs.writeFileSync(filename, json);

    ssh.connect({
        host: '207.154.208.19',
        username: 'root',
        password: 'Adam1Golik' // Replace with your SSH password
    }).then(() => {
        ssh.putFile(filename, `/remote/path/${filename}`).then(() => {
            fs.unlinkSync(filename); // Clean up local file
            res.json({ message: 'File uploaded successfully' });
        }).catch(err => {
            console.error(`Error uploading file: ${err}`);
            res.status(500).json({ error: 'Error uploading file' });
        });
    }).catch(err => {
        console.error(`Error connecting to SSH: ${err}`);
        res.status(500).json({ error: 'Error connecting to SSH' });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
