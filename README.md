# react-express-webpack-boilerplate

A React, Express and Webpack boilerplate.

## Basic Tech Stack

The boilaerplate uses **React**, **Express** and **Webpack 4**. It also includes the frameworks **Jest** and **Enzyme** for testing.

### Current versions

- React 16.4
- Express 4
- Webpack 4
- Webpack-dev-middleware 3
- Webpack-hot-middleware 2
- Babel-core 6
- Jest 23
- Enzyme 3
- ESLint 3

## Development environment

```sh
git clone
 https://github.com/ibechev/react-express-webpack-boilerplate.git

cd react-express-webpack-boilerplate

# install all node modules in the package.jeon file
npm install

# start the application - this will enable hot-reloading, linting and run tests, and will display the coverage in the console
npm start
```

Project will open at [http://localhost:3000/](http://localhost:3000/)

## Production environment

For production, run the 'build' script to transpile code to 'dist' folder. The 'start:dist' script runs the production code in localhost to ensure the app is running correctly usine 'dist' filder files:

```sh
# run build with webpack and generate bundle files in dist folder
npm run build

# run the built files and view in browser
npm run start:dist
```

Project will open at [http://localhost:4000/](http://localhost:4000/)
