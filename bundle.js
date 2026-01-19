const fs = require('fs');
const path = require('path');

// Read source files
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

// Read QR code and convert to base64
const qrcode = fs.readFileSync('font-qrcode.png');
const qrcodeBase64 = 'data:image/png;base64,' + qrcode.toString('base64');

// Replace external CSS link with inline style
let single = html.replace(
    /<link rel="stylesheet" href="style\.css\?v=\d+">/,
    '<style>\n' + css + '\n</style>'
);

// Replace external JS link with inline script
single = single.replace(
    /<script src="app\.js\?v=\d+"><\/script>/,
    '<script>\n' + js + '\n</script>'
);

// Replace QR code image src with base64
single = single.replace(
    /src="font-qrcode\.png"/,
    'src="' + qrcodeBase64 + '"'
);

// Write standalone file
fs.writeFileSync('copybook-generator-standalone.html', single, 'utf8');

const size = fs.statSync('copybook-generator-standalone.html').size;
console.log('Done! File size:', Math.round(size / 1024), 'KB');
