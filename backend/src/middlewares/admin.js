import { restrictTo } from './auth.js';
export const adminOnly = restrictTo('Admin');