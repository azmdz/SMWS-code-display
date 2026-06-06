import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const USER_DATA_DIR = path.resolve(__dirname, '.userdata');
export const SENTINEL = path.join(USER_DATA_DIR, '.logged-in');
export const EXTENSION_PATH = path.resolve(__dirname, '../dist');
export const BASE_URL = 'https://smwsjapan.com';
export const ORDER_ID = process.env.SMWS_ORDER_ID ?? null;
