# Setup Testing Framework in Project

## Prerequisite

- npm
- npx
- node
- typescipt

## Basic Theory

- NPM - Manages packages but doesn't make life easy executing any.
- NPX - A tool for executing Node packages.
- [Difference between npx and npm?](https://stackoverflow.com/questions/50605219/difference-between-npx-and-npm)


## Required npm modules

- [x] `jest`
- [x] `@types/jest`
- [x] `ts-jest`
- [x] `supertest`

### jest

- Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
- [jest](https://github.com/facebook/jest)

```
npm install --save-dev jest
```

### @types/jest

- This package contains type definitions for Jest (https://jestjs.io/).
- [@types/jest](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jest)

```
npm install --save-dev @types/jest
```

### ts-jest

- This is the TypeScript preprocessor for jest (`ts-jest`) which allows jest to transpile TypeScript on the fly and have source-map support built in.
- A Jest transformer with source map support that lets you use Jest to test projects written in TypeScript.
- [ts-jest](https://github.com/kulshekhar/ts-jest)

```
npm install --save-dev ts-jest
```

### supertest

- SuperTest is an HTTP assertions library that allows you to test your Node.js HTTP servers. It is built on top of SuperAgent library, wich is an HTTP client for Node.js.

```
npm install --save-dev supertest
```

## Configure Jest

Add the following `jest.config.js` file to the root of your project:

```
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```


## Links

- https://rahmanfadhil.com/test-express-with-supertest/
- https://itnext.io/testing-with-jest-in-typescript-cc1cd0095421
