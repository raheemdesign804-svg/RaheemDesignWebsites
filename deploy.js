const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const OWNER = 'raheemdesign804-svg';
const REPO = 'RaheemKhan';
const BRANCH = 'main';

// Read token from environment or from token file
let TOKEN = '';
const tokenFile = path.join(__dirname, '.github_token');
if (fs.existsSync(tokenFile)) {
  TOKEN = fs.readFileSync(tokenFile, 'utf8').trim();
}
if (!TOKEN && process.env.GH_TOKEN) TOKEN = process.env.GH_TOKEN;

if (!TOKEN) {
  console.error('\n❌ GitHub token not found!');
  console.error('Please create a file named .github_token in:');
  console.error(__dirname);
  console.error('And paste your GitHub Personal Access Token inside it.\n');
  console.error('Get your token at: https://github.com/settings/tokens/new');
  console.error('- Check the "repo" checkbox');
  console.error('- Click "Generate token"');
  console.error('- Copy and paste it into the .github_token file\n');
  process.exit(1);
}

function apiRequest(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: endpoint,
      method,
      headers: {
        'User-Agent': 'RaheemDeploy/1.0',
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function getSha(remotePath) {
  const res = await apiRequest('GET', `/repos/${OWNER}/${REPO}/contents/${remotePath}?ref=${BRANCH}`);
  return res.status === 200 ? res.body.sha : null;
}

async function uploadFile(localPath, remotePath) {
  const content = fs.readFileSync(localPath).toString('base64');
  const sha = await getSha(remotePath);
  const res = await apiRequest('PUT', `/repos/${OWNER}/${REPO}/contents/${remotePath}`, {
    message: `deploy: ${remotePath}`,
    content,
    branch: BRANCH,
    ...(sha ? { sha } : {})
  });
  if ([200, 201].includes(res.status)) {
    process.stdout.write(`✅ ${remotePath}\n`);
  } else {
    process.stdout.write(`❌ ${remotePath} — ${res.body.message || res.status}\n`);
  }
}

async function uploadDir(localDir, remoteDir) {
  const items = fs.readdirSync(localDir);
  for (const item of items) {
    const lp = path.join(localDir, item);
    const rp = remoteDir ? `${remoteDir}/${item}` : item;
    if (fs.statSync(lp).isDirectory()) {
      await uploadDir(lp, rp);
    } else {
      await uploadFile(lp, rp);
    }
  }
}

async function main() {
  const ROOT = __dirname;
  console.log('\n🚀 Starting GitHub upload...\n');

  // Verify token works
  const me = await apiRequest('GET', '/user');
  if (me.status !== 200) {
    console.error('❌ Invalid GitHub token! Please check .github_token file.');
    process.exit(1);
  }
  console.log(`✅ Logged in as: ${me.body.login}\n`);

  const topFiles = ['index.html','about.html','services.html','gallery.html','contact.html','admin.html','vercel.json'];
  for (const f of topFiles) {
    if (fs.existsSync(path.join(ROOT, f))) await uploadFile(path.join(ROOT, f), f);
  }

  console.log('\n📁 Uploading css/...');
  await uploadDir(path.join(ROOT, 'css'), 'css');

  console.log('\n📁 Uploading js/...');
  await uploadDir(path.join(ROOT, 'js'), 'js');

  console.log('\n📁 Uploading images/...');
  await uploadDir(path.join(ROOT, 'images'), 'images');

  console.log('\n\n🎉 All files uploaded to GitHub!');
  console.log(`🔗 GitHub: https://github.com/${OWNER}/${REPO}`);
  console.log(`🌐 Vercel: Automatically deploying... check https://vercel.com/dashboard`);
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
