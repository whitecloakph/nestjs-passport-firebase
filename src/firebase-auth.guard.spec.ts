import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as passport from 'passport';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseStrategy } from './firebase.strategy';
import Mocked = jest.Mocked;

describe('Firebase Auth Guard Middleware', () => {
  let firebaseAuthGuard: FirebaseAuthGuard;
  let context: ExecutionContext;
  let mockPassport: Mocked<passport.PassportStatic>;

  beforeEach(() => {
    firebaseAuthGuard = new FirebaseAuthGuard();
    mockPassport = passport as Mocked<passport.PassportStatic>;

    mockPassport.use(
        'firebase',
        new FirebaseStrategy({ issuer: 'issuer', audience: 'audience' }),
    );

    context = ({
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
        getResponse: jest.fn(),
      })),
    } as unknown) as ExecutionContext;
  });

  it('should be defined', () => {
    expect(firebaseAuthGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return unauthorized when auth token is not provided', async () => {
      await expect(firebaseAuthGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return true when passport.authenticate passed',  async () => {
      jest.spyOn(mockPassport, 'authenticate').mockImplementation((authType, options, callback) => () => { callback(null, true); })

      await expect(firebaseAuthGuard.canActivate(context)).resolves.toEqual(true);
    });
  });
});
