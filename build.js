import {
    writeFileSync,
    mkdirSync
} from 'fs';

// Ensure public directory exists
try {
    mkdirSync('public', {
        recursive: true
    });
} catch (error) {
    // Directory already exists
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

// Generate config.js content
const configContent = `// Generated configuration - Do not edit manually
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

console.log('🔧 Configuration loaded:', {
    apiBase: window.ENV_API_BASE,
    googleConfigured: !!window.ENV_GOOGLE_CLIENT_ID,
    facebookConfigured: !!window.ENV_FACEBOOK_CLIENT_ID,
    testMode: !!window.ENV_TEST_ADMIN_EMAIL
});`;

// Write config.js file to public directory
try {
    writeFileSync('public/config.js', configContent);
    console.log('✅ Configuration file generated successfully in public/config.js');
    console.log('📋 Config summary:');
    console.log(`   API Base: ${config.API_BASE}`);
    console.log(`   Google OAuth: ${config.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   Facebook OAuth: ${config.FACEBOOK_CLIENT_ID ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   Test Credentials: ${config.TEST_ADMIN_EMAIL ? '✅ Available' : '❌ Not set'}`);
} catch (error) {
    console.error('❌ Failed to generate config file:', error);
    process.exit(1);
}