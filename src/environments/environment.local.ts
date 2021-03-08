import * as dotenv from "dotenv";
dotenv.config();

const envPath = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envPath });

const environmentConfiguration = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  KEYCLOCK_SERVER: process.env.KEYCLOCK_SERVER,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  REDIRECT_HOST_URI: process.env.REDIRECT_HOST_URI,
  KEYCLOCK_REALMS_Name: process.env.KEYCLOCK_REALMS_Name, 
  KEYCLOCK_ADMIN: {
    USER_NAME: process.env.KEYCLOCK_ADMNIN_USER,
    PASSWORD: process.env.KEYCLOCK_ADMNIN_PASSWORD,
  }
};

export default environmentConfiguration;
