const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPath = __dirname;
let lastHash = '';

function checkUpdates() {
    try {
        const output = execSync('git ls-remote origin -h refs/heads/main', { cwd: repoPath, encoding: 'utf-8' });
        const currentHash = output.split('\t')[0].trim();
        
        if (lastHash && currentHash !== lastHash) {
            console.log('\n[!] Nuovo comando rilevato su GitHub!');
            execSync('git pull origin main', { cwd: repoPath });
            const commands = fs.readFileSync(path.join(repoPath, 'COMANDI_TELEFONO.md'), 'utf-8');
            console.log('--- CONTENUTO FILE ---');
            console.log(commands);
            console.log('----------------------');
            console.log('Antigravity, esegui il comando descritto qui sopra e rispondi all\'utente.');
        }
        lastHash = currentHash;
    } catch (e) {
        // Ignore errors to keep polling
    }
}

console.log('Avviato watcher GitHub ogni 5 secondi...');
// Run first check to set initial hash
checkUpdates();

setInterval(checkUpdates, 5000);
