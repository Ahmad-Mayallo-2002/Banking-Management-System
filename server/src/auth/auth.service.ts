import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { AppDataSource } from '../data-source';
import { LoginInput } from './zod/login.zod';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Login } from '../interfaces/login.interface';
import { SignUpInput } from './zod/signUp.zod';
import { redis } from '../utils/redis';
import { UploaderContext } from '../utils/uploader';
import { sendMail } from '../utils/sendMail';

const { BAD_REQUEST, NOT_FOUND, CONFLICT } = StatusCodes;
config();

@injectable()
export class AuthService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async login(input: LoginInput): Promise<Login> {
    const user = await this.userRepo.findOneBy({ email: input.email });
    if (!user) throw new AppError('Invalid email', BAD_REQUEST, ReasonPhrases.BAD_REQUEST);

    const comparePass = await compare(input.password, user.password);
    if (!comparePass)
      throw new AppError('Invalid password', BAD_REQUEST, ReasonPhrases.BAD_REQUEST);

    const payload = { id: user.id, role: user.role };
    const token = sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: '1d' });

    return { id: user.id, role: user.role, token };
  }

  async signUp(input: SignUpInput): Promise<User> {
    const existing = await this.userRepo.findOneBy({ email: input.email });
    if (existing) throw new AppError('Email already exists', CONFLICT, ReasonPhrases.CONFLICT);

    const uploader = new UploaderContext();
    const { public_id, secure_url } = await uploader.setStrategy('cloudinary', input.avatar);

    const hashedPassword = await hash(input.password, 10);
    const newUser = this.userRepo.create({
      ...input,
      password: hashedPassword,
      avatar: {
        public_id,
        url: secure_url,
      },
    });

    return await this.userRepo.save(newUser);
  }

  async sendVerificationCode(email: string): Promise<string> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new AppError('Email not found', NOT_FOUND, ReasonPhrases.NOT_FOUND);

    const code = await sendMail(email);
    await redis.set(`code`, code, 'EX', 300);
    await redis.set('email', email, 'EX', 300);

    return 'Verification code sent';
  }

  async compareCode(submittedCode: string): Promise<boolean> {
    const storedCode = await redis.get(`code`);
    if (!storedCode || storedCode !== submittedCode) {
      throw new AppError(
        'Invalid or expired verification code',
        BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    }

    await redis.del(`code`);
    return true;
  }

  async updatePassword(newPassword: string): Promise<string> {
    const email = (await redis.get('email')) as string;
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new AppError('User not found', NOT_FOUND, ReasonPhrases.NOT_FOUND);

    user.password = await hash(newPassword, 10);
    await this.userRepo.save(user);

    return 'Password updated successfully';
  }
}
