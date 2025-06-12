export default () => ({
  port: parseInt(process.env.SERVER_PORT, 10) || 8081,

  // Database:
  dbPort: parseInt(process.env.DB_PORT),
  dbHost: process.env.DB_HOST,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  secret_key: process.env.SECRET_KEY,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
});
