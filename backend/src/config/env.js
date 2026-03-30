import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://larem:%40larem%402024@bibile-app.tsboqez.mongodb.net/?appName=Bibile-App';
