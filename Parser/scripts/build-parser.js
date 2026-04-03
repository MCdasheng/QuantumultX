const fs = require('fs');
const path = require('path');
const https = require('https');

const upstreamUrl = 'https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/resource-parser.js';
const upstreamPath = path.join(__dirname, '..', 'upstream', 'resource-parser.js');
const defaultsPath = path.join(__dirname, '..', 'patches', 'defaults.js');
const getEmojiPath = path.join(__dirname, '..', 'patches', 'get_emoji.js');
const outputPath = path.join(__dirname, '..', 'myParser.js');
const parserUrl = 'https://raw.githubusercontent.com/MCdasheng/QuantumultX/refs/heads/main/Parser/myParser.js';

function cleanupFile(dest) {
  if (fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
}

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

function extractUpstreamVersion(content) {
  const bracketMatch = content.match(/⟦([^⟧]+)⟧/);
  if (bracketMatch) {
    return bracketMatch[1].trim();
  }

  const fallbackDate = content.match(/\b(20\d{2}-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?)\b/);
  if (fallbackDate) {
    return fallbackDate[1].trim();
  }

  return null;
}

function buildOwnUseBlock() {
  return [
    '----------------------------------------------------------',
    '🥳For own use v1.7',
    'default params: ',
    '  emoji=1, udp=-1, sort="🏳️‍🌈>🇭🇰>🇹🇼>🇯🇵>🇺🇸>🇸🇬"',
    'modify get_emoji(): add flags & cities',
    `url = ${parserUrl}`,
    'From https://github.com/KOP-XIAO/QuantumultX/blob/master/Scripts/resource-parser.js',
    '----------------------------------------------------------',
  ].join('\n');
}

function insertOwnUseHeader(content) {
  const commentMatch = content.match(/^\/\*\*[\s\S]*?\*\//);
  if (!commentMatch) {
    throw new Error('Failed to locate top comment block. Upstream format may have changed.');
  }

  const commentBlock = commentMatch[0];
  const ownUseBlock = buildOwnUseBlock();

  if (commentBlock.includes('🥳For own use v1.7')) {
    return content;
  }

  const separator = '----------------------------------------------------------';
  const separatorIndex = commentBlock.indexOf(separator);
  if (separatorIndex === -1) {
    throw new Error('Failed to locate header separator in top comment block.');
  }

  const insertPos = separatorIndex + separator.length;
  const updatedComment =
    commentBlock.slice(0, insertPos) +
    '\n' +
    ownUseBlock +
    commentBlock.slice(insertPos);

  return content.replace(commentBlock, updatedComment);
}

function replaceGetEmoji(content, getEmojiContent) {
  const start = content.indexOf('function get_emoji(emojip, sname)');
  if (start === -1) {
    throw new Error('Failed to locate get_emoji function. Upstream format may have changed.');
  }

  const nextMarker = content.indexOf('//emoji', start);
  if (nextMarker === -1 || nextMarker <= start) {
    throw new Error('Failed to locate get_emoji end marker. Upstream format may have changed.');
  }

  let replaceStart = start;
  const lineStart = content.lastIndexOf('\n', start - 1) + 1;
  const prefix = content.slice(lineStart, start);
  if (/\/\/.*emoji/.test(prefix)) {
    replaceStart = lineStart;
  }

  return content.slice(0, replaceStart) + getEmojiContent + '\n' + content.slice(nextMarker);
}

function insertDefaults(content, defaultsContent) {
  const profileRegex = /var ProfileInfo = \{\s*"server":"",\s*"filter":"",\s*"rewrite":""\s*\}\s*\r?\n/;
  const profileBlock = `var ProfileInfo = {
  "server":"",
  "filter":"",
  "rewrite":""
}

// ----------------------------------------------------------
// For own use
${defaultsContent}
// ----------------------------------------------------------
`;

  const updated = content.replace(profileRegex, profileBlock);
  if (!updated.includes(defaultsContent)) {
    throw new Error('Failed to insert defaults block. Upstream format may have changed.');
  }

  return updated;
}

console.log('Downloading latest upstream...');
downloadUpstream(upstreamUrl, upstreamPath)
  .then(() => {
    console.log('Upstream downloaded.');

    const upstreamContent = fs.readFileSync(upstreamPath, 'utf8');
    const defaultsContent = fs.readFileSync(defaultsPath, 'utf8').trim();
    const getEmojiContent = fs.readFileSync(getEmojiPath, 'utf8').trim();
    const upstreamVersion = extractUpstreamVersion(upstreamContent);

    if (upstreamVersion) {
      console.log(`Detected upstream version: ${upstreamVersion}`);
    } else {
      console.log('Upstream version marker not found; falling back to content diff behavior.');
    }

    if (fs.existsSync(outputPath) && upstreamVersion) {
      const currentOutput = fs.readFileSync(outputPath, 'utf8');
      const currentVersion = extractUpstreamVersion(currentOutput);

      if (currentVersion === upstreamVersion) {
        console.log(`Upstream version unchanged (${upstreamVersion}); skipping rebuild.`);
        return;
      }
    }

    let modifiedContent = insertOwnUseHeader(upstreamContent);
    modifiedContent = replaceGetEmoji(modifiedContent, getEmojiContent);
    modifiedContent = insertDefaults(modifiedContent, defaultsContent);

    fs.writeFileSync(outputPath, modifiedContent, 'utf8');
    console.log('myParser.js has been built successfully!');
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exitCode = 1;
  });
