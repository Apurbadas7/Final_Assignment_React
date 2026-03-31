const fs = require('fs');
const https = require('https');
const path = require('path');

// 1. Download Indian Bank Logo
const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Indian_Bank_logo.svg/512px-Indian_Bank_logo.svg.png';
const dest = path.join(__dirname, 'public', 'logo.png');

https.get(logoUrl, (res) => {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Downloaded new Indian Bank logo to public/logo.png');
    });
}).on('error', (err) => {
    console.error('Error downloading logo:', err);
});

// 2. Replace texts
const traverseDir = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content
                .replace(/Central Bank of India/g, 'Indian Bank')
                .replace(/CBOI Logo/g, 'Indian Bank Logo')
                .replace(/CBOI UPI/g, 'Indian Bank UPI')
                .replace(/alt="CBOI"/g, 'alt="Indian Bank"')
                .replace(/केन्द्रीय बैंक ऑफ इंडिया/g, 'इंडियन बैंक');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Updated texts in: ' + fullPath);
            }
        }
    });
};
traverseDir(path.join(__dirname, 'src'));
