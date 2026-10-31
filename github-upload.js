const fs = require('fs');
const path = require('path');
const https = require('https');

// =============================================
// CONFIG - GitHub token needed for upload
// =============================================
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = 'raheemdesign804-svg';
const REPO = 'RaheemKhan';
const BRANCH = 'main';

if (!GITHUB_TOKEN) {
  console.error('ERROR: Please set GITHUB_TOKEN environment variable');
  process.exit(1);
}

function githubRequest(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      path: apiPath,
      method,
      headers: {
        'User-Agent': 'RaheemDesign-Deployer',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };

    const req = https.request(options, (res) => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(response) }); }
        catch { resolve({ status: res.statusCode, data: response }); }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getFileSha(filePath) {
  const res = await githubRequest('GET', `/repos/${OWNER}/${REPO}/contents/${filePath}`);
  if (res.status === 200 && res.data.sha) return res.data.sha;
  return null;
}

async function uploadFile(localPath, remotePath) {
  const content = fs.readFileSync(localPath);
  const base64 = content.toString('base64');
  const sha = await getFileSha(remotePath);

  const body = {
    message: `Update ${remotePath}`,
    content: base64,
    branch: BRANCH
  };
  if (sha) body.sha = sha;

  const res = await githubRequest('PUT', `/repos/${OWNER}/${REPO}/contents/${remotePath}`, body);
  if (res.status === 200 || res.status === 201) {
    console.log(`✅ Uploaded: ${remotePath}`);
  } else {
    console.error(`❌ Failed: ${remotePath} - Status: ${res.status}`, res.data.message || '');
  }
}

async function uploadDir(localDir, remoteDir) {
  const items = fs.readdirSync(localDir);
  for (const item of items) {
    const localPath = path.join(localDir, item);
    const remotePath = remoteDir ? `${remoteDir}/${item}` : item;
    const stat = fs.statSync(localPath);
    if (stat.isDirectory()) {
      await uploadDir(localPath, remotePath);
    } else {
      await uploadFile(localPath, remotePath);
    }
  }
}

async function main() {
  const ROOT = path.join(__dirname);
  
  // Files to upload
  const htmlFiles = ['index.html', 'about.html', 'services.html', 'gallery.html', 'contact.html', 'admin.html'];
  const extraFiles = ['vercel.json'];
  
  console.log('🚀 Uploading HTML files...');
  for (const f of htmlFiles) {
    const fp = path.join(ROOT, f);
    if (fs.existsSync(fp)) await uploadFile(fp, f);
  }

  for (const f of extraFiles) {
    const fp = path.join(ROOT, f);
    if (fs.existsSync(fp)) await uploadFile(fp, f);
  }

  console.log('\n🚀 Uploading CSS folder...');
  await uploadDir(path.join(ROOT, 'css'), 'css');

  console.log('\n🚀 Uploading JS folder...');
  await uploadDir(path.join(ROOT, 'js'), 'js');

  console.log('\n🚀 Uploading Images folder...');
  await uploadDir(path.join(ROOT, 'images'), 'images');

  console.log('\n✅ All files uploaded to GitHub!');
  console.log(`🌐 Repository: https://github.com/${OWNER}/${REPO}`);
}

main().catch(console.error);
