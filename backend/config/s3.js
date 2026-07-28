const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3Configured = () => !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_S3_BUCKET;

const getS3 = () => new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1',
});

/**
 * Upload a file buffer to S3, or fall back to local /uploads folder.
 * @param {Buffer} buffer
 * @param {string} fileName
 * @param {string} mimeType
 * @returns {Promise<string>} public URL (or relative path for local fallback)
 */
async function uploadFile(buffer, fileName, mimeType) {
  if (s3Configured()) {
    const s3 = getS3();
    const key = `products/${fileName}`;
    await s3.putObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read',
    }).promise();
    return `${process.env.AWS_S3_BASE_URL.replace(/\/$/, '')}/${key}`;
  }

  // Local fallback
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const destPath = path.join(uploadsDir, fileName);
  fs.writeFileSync(destPath, buffer);
  return `/uploads/${fileName}`;
}

async function deleteFile(fileUrl) {
  if (!fileUrl) return;
  if (s3Configured() && fileUrl.startsWith('http')) {
    const s3 = getS3();
    const key = `products/${path.basename(fileUrl)}`;
    await s3.deleteObject({ Bucket: process.env.AWS_S3_BUCKET, Key: key }).promise();
    return;
  }
  const localPath = path.join(__dirname, '..', fileUrl.replace(/^\//, ''));
  if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
}

module.exports = { uploadFile, deleteFile, s3Configured };
