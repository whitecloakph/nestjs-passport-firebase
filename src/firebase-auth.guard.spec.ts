import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as passport from 'passport';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseStrategy } from './firebase.strategy';
import { createMock } from '@golevelup/ts-jest';

describe('Firebase Auth Guard Middleware', () => {
  let firebaseAuthGuard: FirebaseAuthGuard;

  beforeEach(() => {
    firebaseAuthGuard = new FirebaseAuthGuard();
  });

  it('should be defined', () => {
    expect(firebaseAuthGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return unauthorized when auth token is not provided', async () => {
      passport.use(
        'firebase',
        new FirebaseStrategy({ issuer: 'issuer', audience: 'audience' }),
      );

      const context: ExecutionContext = ({
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
          getResponse: jest.fn(),
        })),
      } as unknown) as ExecutionContext;

      await expect(firebaseAuthGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(context.switchToHttp).toHaveBeenCalled();
    });
  });
});
