# Changelog

## [1.0.0] - 2021-03-17
### Initial Release
- Add custom passport strategy named FirebaseStrategy, extending
  the PassportJwt Strategy.
- Create a dynamic module for initialization of FirebaseStrategy
## [1.0.1] - 2021-03-17
- Add description under _Protect your APIs_ section in documentation
## [1.0.2] - 2021-05-11
- Change the response type of the `validate` method of `FirebaseStrategy`
  to `any | Promise<any>`. This will allow customization of `validate`
  behavior using method overriding.
- Add documentation on how you can override the `validate` method.  
## [1.0.3] - 2022-09-06
- Update devDependencies NestJS packages to v8
- Update @nestjs/passport to v9
