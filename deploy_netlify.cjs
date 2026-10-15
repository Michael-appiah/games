const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const NETLIFY_TOKEN = 'nfp_n5BLe4riqhoaB6uboFzBEh6fXEx3mibBb044';
const SITE_ID = 'a0364e0b-3320-4698-938b-031f1c080fc4';
const DIST_DIR = path.join(__dirname, 'dist');

function getAllFiles(dir, prefix = '') {
    let results = {};
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
            Object.assign(results, getAllFiles(fullPath, relPath));
        } else {
            const content = fs.readFileSync(fullPath);
            const sha1 = crypto.createHash('sha1').update(content).digest('hex');
            results[`/${relPath}`] = sha1;
        }
    }
    return results;
}

async function deploy() {
    console.log('Building file manifest from dist/...');
    const files = getAllFiles(DIST_DIR);
    const fileCount = Object.keys(files).length;
    console.log(`Found ${fileCount} files`);

    // Step 1: Create deploy with file hashes
    console.log('\nCreating deploy on Netlify...');
    const createRes = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NETLIFY_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files })
    });

    if (!createRes.ok) {
        const errText = await createRes.text();
        console.error(`Failed to create deploy: ${createRes.status} ${errText}`);
        process.exit(1);
    }

    const deploy = await createRes.json();
    console.log(`Deploy created: ${deploy.id}`);
    console.log(`Required files to upload: ${(deploy.required || []).length}`);

    // Step 2: Upload required files
    const required = deploy.required || [];
    const hashToPath = {};
    for (const [filePath, hash] of Object.entries(files)) {
        hashToPath[hash] = filePath;
    }

    for (let i = 0; i < required.length; i++) {
        const hash = required[i];
        const filePath = hashToPath[hash];
        if (!filePath) continue;
        
        const localPath = path.join(DIST_DIR, filePath.replace(/^\//, ''));
        const content = fs.readFileSync(localPath);
        
        console.log(`Uploading (${i + 1}/${required.length}): ${filePath} (${content.length} bytes)`);
        
        const uploadRes = await fetch(
            `https://api.netlify.com/api/v1/deploys/${deploy.id}/files${filePath}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${NETLIFY_TOKEN}`,
                    'Content-Type': 'application/octet-stream'
                },
                body: content
            }
        );

        if (!uploadRes.ok) {
            console.error(`Failed to upload ${filePath}: ${uploadRes.status}`);
        }
    }

    console.log('\n✅ Deploy complete!');
    console.log(`URL: https://instant-virtuals-sporty.netlify.app`);
    console.log(`Deploy URL: ${deploy.deploy_ssl_url || deploy.ssl_url || deploy.url}`);
}

deploy().catch(err => {
    console.error('Deploy failed:', err.message);
    process.exit(1);
});
