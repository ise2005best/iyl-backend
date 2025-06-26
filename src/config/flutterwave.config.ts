import { registerAs } from '@nestjs/config';

export default registerAs('flutterwave', () => ({
  publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
  encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
  baseUrl: 'https://api.flutterwave.com/v3',
}));
