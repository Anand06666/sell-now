import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const adminDir = path.join(rootDir, 'admin');
const distDir = path.join(rootDir, 'dist');
const adminDistTarget = path.join(distDir, 'admin');

try {
    console.log('🏗️  Building Main App...');
    execSync('npx vite build', { stdio: 'inherit', cwd: rootDir });

    console.log('📦 Installing Admin Dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: adminDir });

    console.log('🏗️  Building Admin App...');
    execSync('npx vite build', { stdio: 'inherit', cwd: adminDir });

    console.log('📂 Moving Admin Build to dist/admin...');

    // Ensure dist/admin exists
    if (!fs.existsSync(adminDistTarget)) {
        fs.mkdirSync(adminDistTarget, { recursive: true });
    }

    // Copy admin/dist contents to dist/admin
    const adminDistSource = path.join(adminDir, 'dist');

    if (fs.existsSync(adminDistSource)) {
        fs.cpSync(adminDistSource, adminDistTarget, { recursive: true, force: true });
        console.log('✅ Admin build moved successfully!');
    } else {
        console.error('❌ Admin build directory not found!');
        process.exit(1);
    }

    console.log('✨ Full Build Complete!');

} catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
}
