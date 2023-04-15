import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { FIREBASE_AUTH_CONFIG } from './constants';
import { FirebaseAuthModule } from './firebase-auth.module';
import { FirebaseStrategy } from './firebase.strategy';

describe('Firebase Auth Module', () => {
  let module: TestingModule;
  let strategy: FirebaseStrategy;
  let passportModule: PassportModule;

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

  describe('register', () => {
    it('should be defined', () => {
      const { module } = FirebaseAuthModule.register({
        issuer: Math.random().toString(36).substring(2),
        audience: Math.random().toString(36).substring(2),
      });

      expect(module).toEqual(FirebaseAuthModule);
    });
  });
});
