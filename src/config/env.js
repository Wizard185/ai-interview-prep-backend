import dotenv from 'dotenv';


dotenv.config();

export const env = {
  PORT: process.env.PORT,
  nodeEnv: process.env.NODE_ENV ,
  MONGO_URI: process.env.MONGO_URI ,
};
