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

## Development

To start the development server with hot-reloading:

```bash
npm install -g nodemon
npm run dev
```

The server will restart automatically when you make changes to your code.

## Production

To start the server in production mode:

```bash
npm start
```

## Project Structure

```
besi-th/
├── datasources/       # Contains BaseDataSource implementations
├── graphql/
│   ├── resolvers/     # GraphQL resolvers
│   ├── schemas/       # GraphQL type definitions
│   └── index.js       # GraphQL schema configuration
├── datasources.js     
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
// datasources/UserDataSource.js
const BaseDataSource = require('./BaseDataSource');

class UserDataSource extends BaseDataSource {
  constructor(db) {
    super(db, 'users'); // 'users' is the collection name
  }
  
  // Add custom methods for this specific collection
  async findByEmail(email) {
    return this.findOne({ email });
  }
}

module.exports = UserDataSource;
```

Then use it in your resolvers:

```javascript
// In your resolver
const user = await dataSources.users.findByEmail(email);
```

## License

ISC License

Copyright (c) 2024, besi-th

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
