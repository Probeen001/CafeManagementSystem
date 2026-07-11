const nodemailer = require('nodemailer')

// Lazily create transporter so missing SMTP config only errors on first use,
// not on module load (allows tests / non-email flows to work without config).
function createTransporter() {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS']
  const missing = required.filter((name) => !process.env[name])

  if (missing.length) {
    throw new Error(
      `SMTP is not configured. Set ${missing.join(', ')} in backend/.env.`,
    )
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true = port 465 SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

/**
 * Send a password-reset email to the given address.
 * @param {string} to        Recipient email address
 * @param {string} fullName  Recipient's full name (used in greeting)
 * @param {string} resetUrl  Full reset URL containing the raw token
 */
async function sendPasswordResetEmail(to, fullName, resetUrl) {
  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"CafeX" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: 'Reset Your CafeX Password',
    html: buildHtml(fullName, resetUrl),
    text: buildText(fullName, resetUrl),
  })
}

// ─── Email templates ──────────────────────────────────────────────────────────

function buildHtml(fullName, resetUrl) {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Reset Your CafeX Password</title>
</head>
<body style="margin:0;padding:0;background:#F8F1E8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F1E8;padding:40px 16px;">
    <tr><td align="center">

      <table width="100%" style="max-width:520px;background:#FFFDF8;border-radius:24px;
             box-shadow:0 4px 32px rgba(75,31,14,0.12);border:1px solid #E8DCCF;overflow:hidden;">

        <!-- ── Header ── -->
        <tr>
          <td style="background:#1E0E07;padding:32px 40px;text-align:center;">
            <div style="width:72px;height:72px;border-radius:50%;background:#F97316;
                 display:inline-flex;align-items:center;justify-content:center;
                 margin-bottom:14px;font-size:36px;line-height:1;">☕</div>
            <h1 style="color:#FFFDF8;font-size:28px;font-weight:800;margin:0;letter-spacing:-0.04em;">CafeX</h1>
            <p style="color:#A89080;font-size:13px;margin:6px 0 0;">Cafe Management System</p>
          </td>
        </tr>

        <!-- ── Body ── -->
        <tr>
          <td style="padding:40px;">

            <h2 style="color:#1C0D07;font-size:22px;font-weight:700;margin:0 0 14px;">
              Password Reset Request
            </h2>

            <p style="color:#6B5B4B;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Hi <strong style="color:#1C0D07;">${fullName}</strong>,<br/><br/>
              We received a request to reset the password associated with your CafeX account.
              Click the button below to choose a new password.
            </p>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td align="center">
                  <a href="${resetUrl}"
                     style="display:inline-block;padding:15px 40px;background:#F97316;
                            color:#FFFDF8;text-decoration:none;border-radius:14px;
                            font-size:16px;font-weight:700;letter-spacing:-0.01em;">
                    Reset Password
                  </a>
                </td>
              </tr>
            </table>

            <!-- Warning -->
            <div style="background:#FEF9F0;border:1px solid #FDDCB5;border-radius:12px;
                        padding:16px 20px;margin-bottom:28px;">
              <p style="color:#92400E;font-size:13px;margin:0;line-height:1.7;">
                <strong>⏱ This link expires in 15 minutes.</strong><br/>
                If you didn't request a password reset, you can safely ignore this email —
                your password will remain unchanged.
              </p>
            </div>

            <!-- URL fallback -->
            <p style="color:#A89080;font-size:12px;margin:0 0 8px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="font-size:11px;word-break:break-all;color:#6B5B4B;
                      background:#F3EAE0;padding:10px 14px;border-radius:8px;margin:0;">
              ${resetUrl}
            </p>

          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:#F3EAE0;padding:20px 40px;text-align:center;
                     border-top:1px solid #E8DCCF;">
            <p style="color:#A89080;font-size:12px;margin:0;line-height:1.7;">
              &copy; ${year} CafeX &mdash; All rights reserved.<br/>
              This is an automated message. Please do not reply to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildText(fullName, resetUrl) {
  const year = new Date().getFullYear()
  return `
CafeX — Password Reset Request
================================

Hi ${fullName},

We received a request to reset the password for your CafeX account.

Click the link below (or paste it into your browser) to set a new password:

  ${resetUrl}

This link expires in 15 minutes.

If you did not request a password reset, you can safely ignore this email.
Your password will remain unchanged.

© ${year} CafeX. All rights reserved.
`.trim()
}

module.exports = { sendPasswordResetEmail }
