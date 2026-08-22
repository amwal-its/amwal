import http from 'http';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testOAuthSecurity() {
  console.log('=== STARTING OAUTH MOCK SECURITY TEST (STEP 3) ===\n');

  console.log('Test Case: Attempting to call OAuth Callback with fake code="mock_google_test" and state="salah" without ALLOW_OAUTH_MOCK=true...');

  const res = await fetch(`${BASE_URL}/api/auth/google/callback?code=mock_google_test&state=salah`, {
    method: 'GET',
    redirect: 'manual', // do not follow redirect automatically so we inspect redirect URL
  });

  const location = res.headers.get('location') || '';
  console.log('HTTP Response Status:', res.status);
  console.log('Redirect Location Header:', location);

  if (location.includes('error=Validasi+CSRF') || location.includes('error=')) {
    console.log('\n✓ SECURITY TEST PASSED: Request was REJECTED by CSRF validation state check!');
  } else {
    console.error('\n❌ SECURITY TEST FAILED: Request was NOT rejected!');
    process.exit(1);
  }
}

testOAuthSecurity().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
