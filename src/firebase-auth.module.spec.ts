import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { FIREBASE_AUTH_CONFIG } from './constants';
import { FirebaseAuthModule } from './firebase-auth.module';
import { FirebaseStrategy } from './firebase.strategy';

describe('Firebase Auth Module', () => {
  let module: TestingModule;
  let strategy: FirebaseStrategy;
  let passportModule: PassportModule;
  const mockDecodedToken = {
    aud: 'asd',
    auth_time: 123,
    exp: 123,
    firebase: {
      sign_in_provider: 'google',
      identities: {
        any: 'asd',
      },
    },
    iat: 123,
    iss: 'asd',
    sub: 'asd',
    uid: 'asd',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [FirebaseAuthModule, PassportModule],
      providers: [
        {
          provide: FIREBASE_AUTH_CONFIG,
          useValue: {},
        },
        FirebaseStrategy,
      ],
    }).compile();
    strategy = module.get(FirebaseStrategy);
    passportModule = module.get(PassportModule);
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
    expect(strategy).toBeInstanceOf(FirebaseStrategy);
    expect(passportModule).toBeInstanceOf(PassportModule);
  });

  describe('Firebase Strategy validate', () => {
    it('it should return mockDecodedToken', () => {
      expect(strategy.validate(mockDecodedToken)).toEqual(mockDecodedToken);
    });
  });
});
