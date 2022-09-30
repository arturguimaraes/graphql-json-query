const resolvers = {
  Query: {
    /***
     * Takes a chat message string in GraphQL query format as input,
     * and returns a JSON object containing information about its contents.
     */
    records: (_, { message }, { dataSources }) => {
      return dataSources.customAPI.getRecords(message);
    },
  },
  /***
     * The title property is put in a separate resolver, so that the Apollo Server 
     * can cache the response, if needed later. This will help speeding the search
     * after the first time.
     */
  Link: {
    title: ({ url }, _, { dataSources }) => {
      return dataSources.customAPI.getTitle(url);
    },
  },
};

module.exports = resolvers;
