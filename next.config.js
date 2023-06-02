/** @type {import('next').NextConfig} */
require('dotenv').config()

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Ajouter la configuration du module dotenv ici
  env: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    CLEARDB_DATABASE_URL: process.env.CLEARDB_DATABASE_URL,
  },
}
