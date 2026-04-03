const fs = require('fs');
const path = require('path');
const https = require('https');

// Paths
const upstreamPath = path.join(__dirname, '..', 'upstream', 'resource-parser.js');
const defaultsPath = path.join(__dirname, '..', 'patches', 'defaults.js');
const getEmojiPath = path.join(__dirname, '..', 'patches', 'get_emoji.js');
const outputPath = path.join(__dirname, '..', 'myParser.js');

function cleanupFile(dest) {
  if (fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
}

// Download upstream with basic validation so CI fails fast on bad responses.
function downloadUpstream(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        cleanupFile(dest);
        resolve(downloadUpstream(response.headers.location, dest));
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        cleanupFile(dest);
        reject(new Error(`Failed to download upstream: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          const stats = fs.statSync(dest);
          if (stats.size === 0) {
            cleanupFile(dest);
            reject(new Error('Downloaded upstream file is empty.'));
            return;
          }

          resolve();
        });
      });
    });

    request.on('error', (err) => {
      file.close();
      cleanupFile(dest);
      reject(err);
    });
  });
}

console.log('Downloading latest upstream...');
downloadUpstream('https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/myParser.js', upstreamPath)
  .then(() => {
    console.log('Upstream downloaded.');

    const upstreamContent = fs.readFileSync(upstreamPath, 'utf8');
    const defaultsContent = fs.readFileSync(defaultsPath, 'utf8');
    const getEmojiContent = fs.readFileSync(getEmojiPath, 'utf8');

    const getEmojiRegex = /\/\/涓鸿妭鐐瑰悕娣诲姞 emoji\nfunction get_emoji\(emojip, sname\) \{[\s\S]*?\n\}/;
    const newGetEmoji = '//涓鸿妭鐐瑰悕娣诲姞 emoji\n' + getEmojiContent;
    let modifiedContent = upstreamContent.replace(getEmojiRegex, newGetEmoji);
    if (modifiedContent === upstreamContent) {
      throw new Error('Failed to replace get_emoji function. Upstream format may have changed.');
    }

    const insertPoint = /var ProfileInfo = \{\s*"server":"",\s*"filter":"",\s*"rewrite":""\s*\}\s*\n/;
    const insertText = `var ProfileInfo = {
  "server":"",
  "filter":"",
  "rewrite":""
}

// ----------------------------------------------------------
// 馃コFor own use
${defaultsContent}
// ----------------------------------------------------------
`;
    modifiedContent = modifiedContent.replace(insertPoint, insertText);
    if (!modifiedContent.includes(defaultsContent.trim())) {
      throw new Error('Failed to insert defaults block. Upstream format may have changed.');
    }

    fs.writeFileSync(outputPath, modifiedContent, 'utf8');
    console.log('myParser.js has been built successfully!');
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exitCode = 1;
  });
