const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./schema");
const { resolvers } = require("./resolvers");
const { dataSources, initializeDataSources } = require("./datasources");

async function startApolloServer() {
    await initializeDataSources();
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