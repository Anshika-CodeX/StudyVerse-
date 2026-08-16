import { httpServer } from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 StudyVerse AI Enterprise Server is running on port ${PORT}`);
});
