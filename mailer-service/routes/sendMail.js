const express = require('express');
const { createTransporter } = require('../config/transporter');

const router = express.Router();

function buildTemplate({ email, summary, threat_level, video_url, timestamp }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin: 0 0 16px; color: #0f172a;">Threat Detected</h2>
      <p><strong>Recipient:</strong> ${email}</p>
      <p><strong>Threat Level:</strong> ${threat_level}</p>
      <p><strong>Timestamp:</strong> ${timestamp || new Date().toISOString()}</p>
      <p><strong>Summary:</strong><br />${summary}</p>
      <p><strong>Video Clip:</strong> <a href="${video_url}">${video_url}</a></p>
    </div>
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
