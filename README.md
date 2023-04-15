<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<h3 align="center">Passport - Firebase Auth Module for NestJS</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/@whitecloak/nestjs-passport-firebase" target="_blank">
    <img src="https://img.shields.io/npm/v/@whitecloak/nestjs-passport-firebase" alt="Latest Version">
  </a>
  <a href="https://www.npmjs.com/package/@whitecloak/nestjs-passport-firebase" target="_blank">
    <img src="https://img.shields.io/npm/l/@whitecloak/nestjs-passport-firebase" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/@whitecloak/nestjs-passport-firebase" target="_blank">
    <img src="https://img.shields.io/npm/dt/@whitecloak/nestjs-passport-firebase" alt="Total Downloads">
  </a>
</p>

## Installation

Install the following peer dependencies:

```bash
npm install passport @nestjs/passport passport-jwt jwks-rsa
npm install --save-dev @types/passport-jwt
```

Install the package

```bash
npm install @whitecloak/nestjs-passport-firebase
```

## Usage

### Setup FirebaseAuthModule

Import the `FirebaseAuthModule` into the root module (the `AppModule`, defined in the `app.module.ts` file).

```typescript 
import {Module} from '@nestjs/common';
import {FirebaseAuthModule} from '@whitecloak/nestjs-passport-firebase';

@Module({
    imports: [
        FirebaseAuthModule.register({
            audience: '<PROJECT_ID>',
            issuer: 'https://securetoken.google.com/<PROJECT_ID>',
        }),
    ],
})
export class AppModule {
}
```

The value of `audience` is a string equal to your Firebase project ID, the unique identifier for your Firebase project.
For the `issuer` it should be set to `https://securetoken.google.com/<PROJECT_ID>`. You can also store this config to
the
environment variable.

```typescript
FirebaseAuthModule.register({
    audience: process.env.FIREBASE_AUDIENCE,
    issuer: proccess.env.FIREBASE_ISSUER,
})
```

### Protect your APIs

Use `FirebaseAuthGuard` to protect your routes.

```typescript
import {Controller, Get, UseGuards} from '@nestjs/common';
import {AppService} from './app.service';
import {FirebaseAuthGuard} from '@whitecloak/nestjs-passport-firebase';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    @UseGuards(FirebaseAuthGuard)
    getHello(): string {
        return this.appService.getHello();
    }
}
```

If you are using GraphQL, you need to extend the `FirebaseAuthGuard` and override the `getRequest()` method. Read
more [here](https://docs.nestjs.com/techniques/authentication).

```typescript
import {ExecutionContext, Injectable} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {FirebaseAuthGuard} from '@whitecloak/nestjs-passport-firebase';

@Injectable()
export class GqlAuthGuard extends FirebaseAuthGuard {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}
```

You can now protect your queries and mutations by using the `GqlAuthGuard`.

```typescript
import {Query, Resolver} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from './guards/gql-auth.guard';

@Resolver()
export class VersionsResolver {
    constructor(private readonly appService: AppService) {
    }

    @Query(() => String)
    @UseGuards(GqlAuthGuard)
    getHello(): string {
        return this.appService.getHello();
    }
}

```

### Customizing Firebase Strategy `validate` Method

Sometimes you need to tweak the behavior of the `validate` method to fit into your project requirements. You can do
it by creating a custom strategy and extending the `FirebaseStrategy` to override the `validate` method.

```typescript
import {DecodedIdToken, FirebaseStrategy} from '@whitecloak/nestjs-passport-firebase';
import {Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '@entities/user.entity';

@Injectable()
export class FirebaseCustomStrategy extends FirebaseStrategy {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
        super({
            audience: process.env.FIREBASE_AUDIENCE,
            issuer: proccess.env.FIREBASE_ISSUER,
        });
    }

    async validate(payload: DecodedIdToken): Promise<User> {
        // Do the custom behavior here.

        return this.userRepository.findOne({email: payload.email});
    }
}
```

Then add the `FirebaseCustomStrategy` to the providers list of the module and don't forget to import its dependencies

```typescript
import {Module} from '@nestjs/common';
import {User} from '@entities/user.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FirebaseAuthModule} from '@whitecloak/nestjs-passport-firebase';
import {FirebaseCustomStrategt} from '@modules/auth/strategy/firebase-custom.strategy';

@Module({
    imports: [
        TypeormModule.forFeature([User]),
        FirebaseAuthModule.register({
            audience: '<PROJECT_ID>',
            issuer: 'https://securetoken.google.com/<PROJECT_ID>',
        }),
    ],
    providers: [FirebaseCustomStrategy]
})
export class AppModule {
}
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

**Jimuel Palaca**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
