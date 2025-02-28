//bash: npm install mongoose
import mongoose from 'mongoose';
import 'dotenv/config';
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
});

const ExerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}); 

export const Users = mongoose.model('User', UserSchema);
export const Exercises = mongoose.model('Exercise', ExerciseSchema);
export default connectDB;