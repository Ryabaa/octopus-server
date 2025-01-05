import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      console.log(accessToken, refreshToken, profile);
      const { name, emails, photos } = profile;
      const user = {
        email: emails[0].value || null,
        username: name.givenName || null,
        avatar: photos[0].value || null,
        accessToken,
      };
      const existingUser = await this.userService.findByEmail(user.email);
      console.log(user);
      console.log(existingUser);

      if (!existingUser) {
        const newUser = await this.userService.createUser(user);
        return done(null, newUser);
      }

      return done(null, existingUser);
    } catch (error) {
      console.error('Error during Google OAuth validation:', error);
      done(error, null);
    }
  }
}
