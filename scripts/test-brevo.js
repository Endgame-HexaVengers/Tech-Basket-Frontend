const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      value = value.trim().replace(/^['"](.*)['"]$/, '$1');
      process.env[key] = value;
    }
  });
}

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
const brevoUser = process.env.BREVO_SMTP_USER;
const brevoPass = (process.env.BREVO_SMTP_PASSWORD || process.env.BREVO_SMTP_KEY)?.trim();
const brevoFrom = process.env.BREVO_FROM_EMAIL || brevoUser;

async function runTest() {
  console.log('Testing Email Configuration...\n');

  // Test Gmail if configured
  if (gmailUser && gmailPass) {
    console.log(`1. Testing Gmail SMTP (${gmailUser})...`);
    try {
      const gmailTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailPass },
      });
      const info = await gmailTransport.sendMail({
        from: `"TechBasket Test" <${gmailUser}>`,
        to: gmailUser,
        subject: 'TechBasket OTP Gmail Test',
        html: '<h2>Gmail SMTP is working!</h2><p>Your OTP email configuration is successful.</p>',
      });
      console.log('✅ GMAIL SUCCESS! Response:', info.response);
      return;
    } catch (err) {
      console.error('❌ Gmail Failed:', err.message);
    }
  }

  // Test Brevo if configured
  if (brevoUser && brevoPass) {
    console.log(`\n2. Testing Brevo SMTP (${brevoUser})...`);
    try {
      const brevoTransport = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: { user: brevoUser, pass: brevoPass },
      });
      const info = await brevoTransport.sendMail({
        from: `"TechBasket Test" <${brevoFrom}>`,
        to: brevoFrom,
        subject: 'TechBasket OTP Brevo Test',
        html: '<h2>Brevo SMTP is working!</h2><p>Your OTP email configuration is successful.</p>',
      });
      console.log('✅ BREVO SUCCESS! Response:', info.response);
      return;
    } catch (err) {
      console.error('❌ Brevo Failed:', err.message);
    }
  }

  console.log('\n❌ No working email provider found. Please check your credentials in .env.');
}

runTest();
