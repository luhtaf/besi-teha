const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./src/schema");
const { resolvers } = require('./src/resolvers');
const { dataSources } = require("./datasources");

async function startApolloServer() {
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers 
    });
    
    const { url } = await startStandaloneServer(server, {
        context: async () => ({ dataSources })
      });
    
    console.log(`
        🚀  Server is running!
        📭  Query at ${url}
    `);
}

startApolloServer();