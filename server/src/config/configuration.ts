export default () => ({
  port: parseInt(process.env.SERVER_PORT, 10) || 8081,

  // Database:
  environment: process.env.NODE_ENV,
  dbPort: parseInt(process.env.DB_PORT),
  dbHost: process.env.DB_HOST,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  jwt_expire: process.env.JWT_EXPIRE_IN,
  jwt_refresh_key: process.env.REFRESH_JWT_SECRET_KEY,
  jwt_refresh_expire: process.env.REFRESH_JWT_EXPIRE_IN,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisTTL: +process.env.REDIS_TTL,
});
