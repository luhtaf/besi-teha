# Besi-TH

A Node.js starter project for building GraphQL APIs with ArangoDB as the database.

## Overview

This project provides a foundation for creating GraphQL services using:
- Apollo Server for GraphQL
- ArangoDB as the database
- BaseDataSource pattern for data modeling (similar to models in other frameworks)

## Prerequisites

- Node.js (v14 or higher)
- ArangoDB (installed and running)

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your ArangoDB configuration:

```
ARANGO_URL=http://localhost:8529
ARANGO_DB=your_database_name
ARANGO_USERNAME=your_username
ARANGO_PASSWORD=your_password
```



## Run Application

To start the server :

```bash
npm start
```

## Hot Reload

To start the development server with hot-reloading:

```bash
npm install -g nodemon
npm run dev
```

The server will restart automatically when you make changes to your code.

## Project Structure

```
besi-th/
├── datasource/       # Contains BaseDataSource implementations
│   ├── index.js       # Base Datasource
├── schemas/
│   └── index.js       # GraphQL schema configuration
├── datasources.js     
├── resolvers.js     
├── .env               # Environment variables (create this)
├── .gitignore
├── index.js           # Application entry point
├── package.json
└── README.md
```

## Using BaseDataSource

The BaseDataSource pattern provides a consistent interface for interacting with ArangoDB collections, similar to models in frameworks like Mongoose or Sequelize.

Example usage:

```javascript
// datasources/user.js
const BaseDataSource = require('./BaseDataSource');

class UserDataSource extends BaseDataSource {
  constructor() {
    super();
    this.collectionName = 'users'; // Defining collection name at class level
  }
  
  // Add custom methods for this specific collection
  async findByEmail(email) {
    return this.findOne({ email });
  }
}

module.exports = UserDataSource;
```

Define datasource in your `datasources.js` file:

```javascript
// In your datasources.js
// Import all datasources
const userDataSource = require('./datasource/user');
// other datasources...

// Optional: Initialize them all at once
async function initializeDataSources() {
  if (userDataSource.initialize) await userDataSource.initialize();
  // Initialize others...
}

module.exports = {
  dataSources: {
    user: userDataSource,
  },
  initializeDataSources
};
```

Then use it in your resolvers:

```javascript
// In your resolver
const user = await dataSources.user.findByEmail(email);
```

## License

This project is open source and available under the ISC License. The ISC license is a permissive free software license that allows you to:

- Use the code commercially
- Distribute the code
- Modify the code
- Use the code privately

You are free to use, modify, and distribute this project as long as you include the original copyright and license notice in any copy of the software/source.

See the [LICENSE](./LICENSE) file for the full license text.
