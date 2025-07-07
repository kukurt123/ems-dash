import {
    writeFileSync,
    mkdirSync,
    existsSync
} from 'fs';

console.log('🚀 Starting configuration build...');
console.log('📁 Current working directory:', process.cwd());

// Check if we're building to public directory
const usePublicDir = process.env.VERCEL_OUTPUT_DIR === 'public' || existsSync('public');
const outputDir = usePublicDir ? 'public' : '.';
const configPath = `${outputDir}/config.js`;

// Ensure output directory exists
if (usePublicDir) {
    try {
        mkdirSync('public', {
            recursive: true
        });
        console.log('📁 Created public directory');
    } catch (error) {
        console.log('📁 Public directory already exists');
    }
}

// Read environment variables
const config = {
    API_BASE: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
    GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID || '',
    FACEBOOK_CLIENT_ID: process.env.VITE_FACEBOOK_CLIENT_ID || '',
    TEST_ADMIN_EMAIL: process.env.VITE_TEST_ADMIN_EMAIL || '',
    TEST_ADMIN_PASSWORD: process.env.VITE_TEST_ADMIN_PASSWORD || '',
    TEST_USER_EMAIL: process.env.VITE_TEST_USER_EMAIL || '',
    TEST_USER_PASSWORD: process.env.VITE_TEST_USER_PASSWORD || ''
};

console.log('🔧 Environment variables loaded:');
console.log(`   VITE_API_BASE_URL: ${config.API_BASE}`);
console.log(`   VITE_GOOGLE_CLIENT_ID: ${config.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   VITE_FACEBOOK_CLIENT_ID: ${config.FACEBOOK_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);

// Generate config.js content
const configContent = `// Generated configuration - Do not edit manually
// Generated at: ${new Date().toISOString()}
console.log('🔧 Loading configuration...');

window.ENV_API_BASE = '${config.API_BASE}';
window.ENV_GOOGLE_CLIENT_ID = '${config.GOOGLE_CLIENT_ID}';
window.ENV_FACEBOOK_CLIENT_ID = '${config.FACEBOOK_CLIENT_ID}';

// Test credentials (only for development/preview environments)
if (window.location.hostname.includes('localhost') || 
    window.location.hostname.includes('preview') || 
    window.location.hostname.includes('vercel.app')) {
    window.ENV_TEST_ADMIN_EMAIL = '${config.TEST_ADMIN_EMAIL}';
    window.ENV_TEST_ADMIN_PASSWORD = '${config.TEST_ADMIN_PASSWORD}';
    window.ENV_TEST_USER_EMAIL = '${config.TEST_USER_EMAIL}';
    window.ENV_TEST_USER_PASSWORD = '${config.TEST_USER_PASSWORD}';
}

console.log('✅ Configuration loaded successfully:', {
    apiBase: window.ENV_API_BASE,
    googleConfigured: !!window.ENV_GOOGLE_CLIENT_ID,
    facebookConfigured: !!window.ENV_FACEBOOK_CLIENT_ID,
    testMode: !!window.ENV_TEST_ADMIN_EMAIL
});`;

// Write config.js file
try {
    writeFileSync(configPath, configContent);
    console.log(`✅ Configuration file generated successfully at: ${configPath}`);
    console.log('📋 Config summary:');
    console.log(`   API Base: ${config.API_BASE}`);
    console.log(`   Google OAuth: ${config.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   Facebook OAuth: ${config.FACEBOOK_CLIENT_ID ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   Test Credentials: ${config.TEST_ADMIN_EMAIL ? '✅ Available' : '❌ Not set'}`);

    // Verify file was created
    if (existsSync(configPath)) {
        console.log(`✅ Verified: ${configPath} exists`);
    } else {
        console.error(`❌ Error: ${configPath} was not created`);
        process.exit(1);
    }
} catch (error) {
    console.error('❌ Failed to generate config file:', error);
    process.exit(1);
}