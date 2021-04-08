

const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
const TEST = 'test';

export const getEnv = () => process.env.NODE_ENV;
export const isDevelopment = () => getEnv() === DEVELOPMENT;
export const isproduction = () => getEnv() === PRODUCTION;
export const isTest = () => getEnv() === TEST;


