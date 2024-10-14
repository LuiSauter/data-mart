export const EnvConfig = () => ({
  APP_NAME: process.env.APP_NAME || 'surtidor-backend',
  APP_PROD: process.env.APP_PROD || false,
  APP_VERSION: process.env.APP_VERSION || '0.0.1',
  PORT: process.env.PORT || 3000,

  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  
  DB_CONNECTION: process.env.DB_CONNECTION || 'postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_DATABASE: process.env.DB_DATABASE || 'mysql_dsb',
  DB_USERNAME: process.env.DB_USERNAME || 'mysql',
  DB_PASSWORD: process.env.DB_PASSWORD || 'mysql_password',
});
