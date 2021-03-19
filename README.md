<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<h3 align="center">Passport - Firebase Auth Module for NestJS</h3>

<p align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20for-NestJs-red.svg" alt="Built for NestJS">
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
import { Module } from '@nestjs/common';
import { FirebaseAuthModule } from '@whitecloak/nestjs-passport-firebase';

@Module({
  imports: [
     FirebaseAuthModule.register({
        audience: '<PROJECT_ID>',
        issuer: 'https://securetoken.google.com/<PROJECT_ID>',
     }),
  ],
})
export class AppModule {}
```

The value of `audience` is a string equal to your Firebase project ID, the unique identifier for your Firebase project.
For the `issuer` it should be set to `https://securetoken.google.com/<PROJECT_ID>`. You can also store this config to the
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
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseAuthGuard } from '@whitecloak/nestjs-passport-firebase';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @UseGuards(FirebaseAuthGuard)
    getHello(): string {
        return this.appService.getHello();
    }
}
```

If you are using GraphQL, you need to extend the `FirebaseAuthGuard` and override the `getRequest()` method. Read more [here](https://docs.nestjs.com/techniques/authentication).

```typescript
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FirebaseAuthGuard } from '@whitecloak/nestjs-passport-firebase';

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
import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class VersionsResolver {
    constructor(private readonly appService: AppService) {}

    @Query(() => String)
    @UseGuards(GqlAuthGuard)
    getHello(): string {
        return this.appService.getHello();
    }
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
