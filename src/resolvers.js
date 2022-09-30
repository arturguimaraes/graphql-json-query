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
  Link: {
    title: ({ url }, _, { dataSources }) => {
      return dataSources.customAPI.getTitle(url);
    },
  },
};

module.exports = resolvers;
