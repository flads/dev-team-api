export const Configuration = () => {
  const database = {
    host: process.env.DATABASE_HOST,
    type: process.env.DATABASE_TYPE,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  };

  return { database };
};
