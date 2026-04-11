const express = require('express');
const { createTransporter } = require('../config/transporter');

const router = express.Router();

function cleanMarkdown(text) {
  if (!text) return '';
  return text.replace(/\*\*/g, '').trim();
}

function buildTemplate({ email, summary, threat_level, video_url, timestamp }) {
  const cleanSummary = cleanMarkdown(summary);
  const threatColor = threat_level === 'High' ? '#dc2626' : threat_level === 'Medium' ? '#ea580c' : '#16a34a';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: white;
            padding: 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .threat-badge {
            display: inline-block;
            background-color: ${threatColor};
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: 600;
            margin-top: 12px;
          }
          .content {
            padding: 24px;
          }
          .field {
            margin-bottom: 20px;
          }
          .field-label {
            font-weight: 600;
            color: #1f2937;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          }
          .field-value {
            color: #4b5563;
            font-size: 15px;
            line-height: 1.5;
          }
          .summary-box {
            background-color: #f9fafb;
            border-left: 4px solid ${threatColor};
            padding: 12px;
            border-radius: 4px;
            margin-top: 8px;
          }
          .video-link {
            color: #2563eb;
            text-decoration: none;
            word-break: break-all;
          }
          .video-link:hover {
            text-decoration: underline;
          }
          .footer {
            background-color: #f3f4f6;
            padding: 16px 24px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Security Alert</h1>
            <div class="threat-badge">${threat_level} Threat</div>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Timestamp</div>
              <div class="field-value">${timestamp || new Date().toISOString()}</div>
            </div>
            <div class="field">
              <div class="field-label">Threat Level</div>
              <div class="field-value" style="color: ${threatColor}; font-weight: 600;">${threat_level}</div>
            </div>
            <div class="field">
              <div class="field-label">Scene Summary</div>
              <div class="summary-box">${cleanSummary}</div>
            </div>
            <div class="field">
              <div class="field-label">Video Clip</div>
              <div class="field-value">
                <a href="${video_url}" class="video-link">${video_url}</a>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated security alert. Please review the video clip for details.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

router.post('/send-alert', async (req, res) => {
  const { email, subject, summary, threat_level, video_url, timestamp } = req.body || {};

  if (!email || !subject || !summary || !threat_level) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const transporter = createTransporter();
    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: buildTemplate({ email, summary, threat_level, video_url, timestamp }),
    };

    const info = await transporter.sendMail(message);
    return res.status(200).json({ message: 'Alert sent', messageId: info.messageId });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send alert', error: error.message });
  }
});

module.exports = router;
