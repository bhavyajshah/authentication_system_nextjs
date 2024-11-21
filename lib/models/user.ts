import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'user' | 'admin';
export type Provider = 'credentials' | 'google' | 'github';
export type Subscription = 'free' | 'premium';

export interface IUser extends mongoose.Document {
  email: string;
  password?: string;
  name?: string;
  image?: string;
  phone?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  role: UserRole;
  provider: Provider;
  providerId?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  subscription: Subscription;
  lastLogin?: Date;
  loginHistory: Array<{
    timestamp: Date;
    ip: string;
    userAgent: string;
  }>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    name: String,
    image: String,
    phone: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    provider: {
      type: String,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials',
    },
    providerId: String,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    subscription: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    lastLogin: Date,
    loginHistory: [{
      timestamp: {
        type: Date,
        default: Date.now,
      },
      ip: String,
      userAgent: String,
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);