/**
 * =========================================================================
 * CAMPUSFLOW AUTHENTICATION SECURITY & PENETRATION DEFENSE TEST SUITE
 * File: tests/auth_security.test.js
 * =========================================================================
 * Tests the 10 most common authentication breach vectors:
 * 1. Valid 4-Field Authentication (All 5 Roles)
 * 2. Missing / Empty / Whitespace Field Rejection (CWE-287)
 * 3. SQL / NoSQL Injection Immunity (OWASP A03:2021)
 * 4. Cross-Site Scripting (XSS) Sanitization (OWASP A03:2021)
 * 5. Privilege Escalation Prevention on Signup (OWASP A01:2021)
 * 6. Brute Force Rate Limiting & Account Lockout (OWASP A07:2021)
 * 7. Password Complexity & Entropy Policy (NIST SP 800-63B)
 * 8. Institutional Email Domain & E.164 Phone Validation
 * 9. Google SSO Role Boundary & Confinement
 * 10. Session Token Cryptographic Integrity & Anti-Tampering
 * =========================================================================
 */

const { AuthSecurity } = require('../js/auth.js');

// ANSI Color Formatting for Terminal Output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ${colors.green}✓ PASS:${colors.reset} ${message}`);
    testsPassed++;
  } else {
    console.log(`  ${colors.red}✗ FAIL:${colors.reset} ${message}`);
    testsFailed++;
  }
}

console.log(`\n${colors.bold}${colors.cyan}========================================================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}  CAMPUSFLOW AUTHENTICATION SECURITY & BREACH IMMUNITY TEST SUITE     ${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}========================================================================${colors.reset}\n`);

// -------------------------------------------------------------------------
// TEST 1: Valid 4-Field Authentication across all 5 roles
// -------------------------------------------------------------------------
console.log(`${colors.bold}[TEST 1] Valid 4-Field Authentication (Role, Method, Identifier, Password)${colors.reset}`);
const roles = ['user', 'authority', 'worker', 'admin', 'super'];
roles.forEach(role => {
  const creds = AuthSecurity.InstitutionalDirectory[role];
  const result = AuthSecurity.authenticateLogin({
    role,
    method: 'email',
    identifier: creds.email,
    password: 'password123',
    ip: '10.0.0.1'
  });
  assert(result.success === true, `Authenticates ${role.toUpperCase()} with valid email and issues token`);
  assert(result.user && result.user.role === role, `${role.toUpperCase()} session claims correct role`);
});

// -------------------------------------------------------------------------
// TEST 2: Missing / Empty / Whitespace Field Rejection (CWE-287)
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}[TEST 2] CWE-287: Missing / Empty / Whitespace Fields Rejection${colors.reset}`);
const emptyRole = AuthSecurity.authenticateLogin({ role: '', method: 'email', identifier: 'test@university.edu', password: 'password123' });
assert(emptyRole.success === false, 'Rejects login with missing role');

const emptyId = AuthSecurity.authenticateLogin({ role: 'user', method: 'email', identifier: '   ', password: 'password123' });
assert(emptyId.success === false, 'Rejects login with whitespace-only identifier');

const emptyPass = AuthSecurity.authenticateLogin({ role: 'user', method: 'email', identifier: 'aarav.patel@eng.university.edu', password: '' });
assert(emptyPass.success === false, 'Rejects login with empty password');

const invalidRole = AuthSecurity.authenticateLogin({ role: 'hacker_root', method: 'email', identifier: 'test@university.edu', password: 'password123' });
assert(invalidRole.success === false, 'Rejects non-existent role definition');

// -------------------------------------------------------------------------
// TEST 3: SQL / NoSQL Injection Attack Defense (OWASP A03:2021)
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}[TEST 3] OWASP A03:2021: SQL / NoSQL Injection Immunity${colors.reset}`);
const sqliPayloads = [
  "' OR '1'='1",
  "admin' --",
  "' UNION SELECT 1, 'admin', 'pass' --",
  "\" or \"\"=\""
];

sqliPayloads.forEach((payload, idx) => {
  const sqliResult = AuthSecurity.authenticateLogin({
    role: 'super',
    method: 'email',
    identifier: payload,
    password: payload,
    ip: `192.168.1.${idx + 10}`
  });
  assert(sqliResult.success === false, `Blocks SQL injection payload: ${colors.dim}${payload}${colors.reset}`);
});

// -------------------------------------------------------------------------
// TEST 4: Cross-Site Scripting (XSS) Input Sanitization (OWASP A03:2021)
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}[TEST 4] OWASP A03:2021: Cross-Site Scripting (XSS) Sanitization${colors.reset}`);
const xssName = "<script>alert('XSS')</script>Aarav";
const sanitizedName = AuthSecurity.sanitizeInput(xssName);
assert(!sanitizedName.includes('<script>') && !sanitizedName.includes('</script>'), 'Strips executable <script> tags from inputs');

const xssImg = "<img src=x onerror=alert(document.cookie)>";
const sanitizedImg = AuthSecurity.sanitizeInput(xssImg);
assert(!sanitizedImg.includes('<img'), 'Strips HTML elements with embedded JavaScript handlers');

// -------------------------------------------------------------------------
// TEST 5: Privilege Escalation Prevention on Signup (OWASP A01:2021)
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}[TEST 5] OWASP A01:2021: Privilege Escalation Prevention (Anti-Root Hijack)${colors.reset}`);
// Attacker tries to self-register as Super Admin without authorization key
const unauthSuper = AuthSecurity.registerAccount({
  name: 'Malicious Attacker',
  role: 'super',
  method: 'email',
  identifier: 'attacker@governance.university.edu',
  password: 'Password@2026!',
  authCode: '' // missing master key
});
assert(unauthSuper.success === false && unauthSuper.error.includes('Privilege Escalation Blocked'), 'Blocks unauthorized registration attempt for SUPER ADMIN');

// Attacker tries to self-register as Facilities Admin without authorization key
const unauthAdmin = AuthSecurity.registerAccount({
  name: 'Malicious Attacker',
  role: 'admin',
  method: 'email',
  identifier: 'attacker@facilities.university.edu',
  password: 'Password@2026!',
  authCode: 'wrong-key-123'
});
assert(unauthAdmin.success === false && unauthAdmin.error.includes('Privilege Escalation Blocked'), 'Blocks unauthorized registration attempt for FACILITIES ADMIN');

// Legitimate registration for Student User role (no key needed)
const validUserSignup = AuthSecurity.registerAccount({
  name: 'Priya Sharma',
  role: 'user',
  method: 'email',
  identifier: 'priya.sharma@eng.university.edu',
  password: 'Password@2026!',
  rollId: '2024-ENG-UG-0512'
});
assert(validUserSignup.success === true, 'Allows legitimate Student/User self-registration');

// Legitimate authorized Super Admin registration with valid master token
const validSuperSignup = AuthSecurity.registerAccount({
  name: 'Dr. Eleanor Vance',
  role: 'super',
  method: 'email',
  identifier: 'eleanor.vance@governance.university.edu',
  password: 'Password@2026!',
  authCode: 'SUPER-ROOT-GLOBAL-9921' // verified master key
});
assert(validSuperSignup.success === true, 'Allows privileged registration when accompanied by Master Authorization Key');

// -------------------------------------------------------------------------
// TEST 6: Brute Force & Rate Limiting Defense (OWASP A07:2021)
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}[TEST 6] OWASP A07:2021: Brute Force & Credential Stuffing Throttling${colors.reset}`);
const bruteForceTarget = 'target.student@eng.university.edu';
const attackerIp = '198.51.100.42';

// Simulate 5 consecutive failed password guesses
for (let attempt = 1; attempt <= 5; attempt++) {
  AuthSecurity.authenticateLogin({
    role: 'user',
    method: 'email',
    identifier: bruteForceTarget,
    password: `WrongGuess_${attempt}!`,
    ip: attackerIp
  });
}

// 6th attempt should trigger security lockout
const lockedAttempt = AuthSecurity.authenticateLogin({
  role: 'user',
  method: 'email',
  identifier: bruteForceTarget,
  password: 'EvenCorrectPasswordNow!',
  ip: attackerIp
});

assert(lockedAttempt.success === false, 'Detects brute force threshold (5 failures)');
assert(lockedAttempt.rateLimited === true || lockedAttempt.error.includes('locked'), 'Enforces temporary account/IP lockout window');

// -------------------------------------------------------------------------
// TEST 7: Password Complexity & Entropy Enforcement (NIST SP 800-63B)
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}[TEST 7] NIST SP 800-63B: Password Complexity & Entropy Policy${colors.reset}`);
const weakPasswords = [
  { pwd: '123', reason: 'Too short (<8 chars)' },
  { pwd: 'password', reason: 'Common dictionary word' },
  { pwd: 'ALLUPPERCASE123', reason: 'Missing lowercase & special character' },
  { pwd: 'alllowercase123', reason: 'Missing uppercase & special character' },
  { pwd: 'NoNumbersOrSymbols', reason: 'Missing digits and special characters' }
];

weakPasswords.forEach(testCase => {
  const check = AuthSecurity.validatePassword(testCase.pwd);
  assert(check.valid === false, `Rejects weak password: ${colors.dim}"${testCase.pwd}" (${testCase.reason})${colors.reset}`);
});

const strongPass = AuthSecurity.validatePassword('CampusFlow@2026!');
assert(strongPass.valid === true, 'Accepts strong, high-entropy password (Upper + Lower + Digit + Special)');

// -------------------------------------------------------------------------
// TEST 8: Institutional Email Domain & E.164 Phone Validation
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}[TEST 8] Institutional Email Domain (.edu/.ac) & E.164 Phone Validation${colors.reset}`);
// Consumer emails should be rejected for institutional portal
const consumerEmails = ['hacker@gmail.com', 'phisher@yahoo.com', 'test@tempmail.org'];
consumerEmails.forEach(email => {
  const check = AuthSecurity.validateIdentifier(email, 'email');
  assert(check.valid === false, `Blocks non-institutional consumer email: ${colors.dim}${email}${colors.reset}`);
});

// Institutional emails should be accepted
const instEmails = ['aarav.patel@eng.university.edu', 'dean@cambridge.ac.uk', 'warden@iitd.ac.in'];
instEmails.forEach(email => {
  const check = AuthSecurity.validateIdentifier(email, 'email');
  assert(check.valid === true, `Accepts verified university domain: ${colors.dim}${email}${colors.reset}`);
});

// Phone format checks
const badPhone = AuthSecurity.validateIdentifier('12345', 'phone');
assert(badPhone.valid === false, 'Rejects incomplete/invalid phone number');

const goodPhone = AuthSecurity.validateIdentifier('+91 98765 43210', 'phone');
assert(goodPhone.valid === true, 'Accepts valid E.164 mobile phone with country code');

// -------------------------------------------------------------------------
// TEST 9: Google SSO Role Boundary & Confinement
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}[TEST 9] Google SSO Role Boundary & Confinement${colors.reset}`);
const ssoResult = AuthSecurity.authenticateGoogleSSO({
  email: 'researcher.sam@eng.university.edu',
  name: 'Sam Researcher'
});
assert(ssoResult.success === true, 'Google SSO completes for institutional account');
assert(ssoResult.user.role === 'user', 'Confines Google SSO strictly to Student/User role (prevents admin elevation)');

// -------------------------------------------------------------------------
// TEST 10: Session Token Cryptographic Integrity & Anti-Tampering
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}[TEST 10] OWASP A02:2021: Session Token Cryptographic Integrity & Anti-Tampering${colors.reset}`);
// 1. Generate legitimate token for user
const legitToken = AuthSecurity.createSessionToken({
  sub: '2024-ENG-UG-0142',
  role: 'user',
  name: 'Aarav Patel'
});

const verifyLegit = AuthSecurity.verifySessionToken(legitToken);
assert(verifyLegit.valid === true, 'Verifies valid HMAC-SHA256 signed session token');
assert(verifyLegit.payload.role === 'user', 'Decodes correct payload claims');

// 2. Attacker tampers with payload (elevating role to 'super') without valid secret
const parts = legitToken.split('.');
const tamperedPayload = Buffer.from(JSON.stringify({
  sub: '2024-ENG-UG-0142',
  role: 'super', // FORGED CLAIM
  name: 'Aarav Patel'
})).toString('base64');
const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`; // keeps original signature

const verifyTampered = AuthSecurity.verifySessionToken(tamperedToken);
assert(verifyTampered.valid === false, 'Detects forged session payload and rejects tampered token');
assert(verifyTampered.error.includes('signature mismatch'), 'Flagged cryptographic signature mismatch');

// -------------------------------------------------------------------------
// SUMMARY SCOREBOARD
// -------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}========================================================================${colors.reset}`);
console.log(`${colors.bold}  TEST RESULTS SUMMARY${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}========================================================================${colors.reset}`);
console.log(`  Total Assertions Tested : ${colors.bold}${testsPassed + testsFailed}${colors.reset}`);
console.log(`  Tests Passed            : ${colors.bold}${colors.green}${testsPassed}${colors.reset}`);
console.log(`  Tests Failed            : ${colors.bold}${testsFailed === 0 ? colors.green + '0' : colors.red + testsFailed}${colors.reset}`);

if (testsFailed === 0) {
  console.log(`\n${colors.bold}${colors.green}  ✓ SYSTEM IS SECURE: All 10 authentication breach vectors passed!${colors.reset}\n`);
} else {
  console.log(`\n${colors.bold}${colors.red}  ✗ SECURITY WARNING: ${testsFailed} tests failed! Review defenses.${colors.reset}\n`);
}
