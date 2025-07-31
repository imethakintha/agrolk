import vision from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_VISION_KEY || undefined,
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cache = new Map();

export async function identifyImage(filePath) {
  const cacheKey = crypto.createHash('md5').update(filePath).digest('hex');
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const [result] = await visionClient.labelDetection(filePath);
  const labels = result.labelAnnotations || [];
  const topLabel = labels.find(l => l.score > 0.7)?.description || 'unknown';

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Give a concise yet fun 3-sentence explanation (max 100 words) about "${topLabel}" in the context of Sri Lankan agro-tourism.`;
  const geminiRes = await model.generateContent(prompt);
  const text = geminiRes.response.text().trim();

  const payload = {
    label: topLabel,
    summary: text,
    timestamp: new Date().toISOString(),
  };

  cache.set(cacheKey, payload);
  return payload;
}