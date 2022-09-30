const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const CustomAPI = require("./datasources/custom-api");

/***
 * Mentions
 */
describe("Mentions", () => {
  it("returns empty array of mention: []", async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => {
        return {
          customAPI: new CustomAPI(),
        };
      },
    });

    const message = "Fabio, where did you go?";
    const objects = "mentions";
    const result = await testServer.executeOperation({
      query: `{ records(message: "${message}") { ${objects} } }`,
    });

    expect(result.errors).toBeUndefined();
    expect(result?.data?.records?.mentions.length).toBe(0);
  });

  it("returns array of 1 mention: [ 'chris' ]", async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => {
        return {
          customAPI: new CustomAPI(),
        };
      },
    });

    const message = "@chris you around?";
    const objects = "mentions";
    const result = await testServer.executeOperation({
      query: `{ records(message: "${message}") { ${objects} } }`,
    });

    expect(result.errors).toBeUndefined();
    expect(result?.data?.records?.mentions.length).toBe(1);
    expect(result?.data?.records?.mentions[0]).toBe("chris");
  });
});

/***
 * Emoticons
 */
describe("Emoticons", () => {
  it("returns empty array of emoticons: []", async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => {
        return {
          customAPI: new CustomAPI(),
        };
      },
    });

    const message = "Good morning! megusta coffee";
    const objects = "emoticons";
    const result = await testServer.executeOperation({
      query: `{ records(message: "${message}") { ${objects} } }`,
    });

    expect(result.errors).toBeUndefined();
    expect(result?.data?.records?.emoticons.length).toBe(0);
  });

  it("returns array of 2 emoticons: [ 'coffee', 'megusta' ]", async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => {
        return {
          customAPI: new CustomAPI(),
        };
      },
    });

    const message = "Good morning! (megusta) (coffee)";
    const objects = "emoticons";
    const result = await testServer.executeOperation({
      query: `{ records(message: "${message}") { ${objects} } }`,
    });

    expect(result.errors).toBeUndefined();
    expect(result?.data?.records?.emoticons.length).toBe(2);
    expect(result?.data?.records?.emoticons[0]).toBe("coffee");
    expect(result?.data?.records?.emoticons[1]).toBe("megusta");
  });
});

/***
 * Links
 */
describe("Links", () => {
  it("returns empty array of links: []", async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => {
        return {
          customAPI: new CustomAPI(),
        };
      },
    });

    const message = "Click on this link: link";
    const objects = "links { title, url }";
    const result = await testServer.executeOperation({
      query: `{ records(message: "${message}") { ${objects} } }`,
    });

    expect(result.errors).toBeUndefined();
    expect(result?.data?.records?.links.length).toBe(0);
  });

  it("returns array of 1 link, with title and url", async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => {
        return {
          customAPI: new CustomAPI(),
        };
      },
    });

    const message = "Olympics are starting soon; http://www.nbcolympics.com";
    const objects = "links { title, url }";
    const result = await testServer.executeOperation({
      query: `{ records(message: "${message}") { ${objects} } }`,
    });

    expect(result.errors).toBeUndefined();
    expect(result?.data?.records?.links.length).toBe(1);
    expect(result?.data?.records?.links[0]?.url).toBe(
      "http://www.nbcolympics.com"
    );
    expect(result?.data?.records?.links[0]?.title).not.toBe("");
  });
});

/***
 * Combined
 */
describe("Combined", () => {
  it("returns array of 0 mentions and 1 link", async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => {
        return {
          customAPI: new CustomAPI(),
        };
      },
    });

    const message = "Olympics are starting soon; http://www.nbcolympics.com";
    const objects = "mentions, links { title, url }";
    const result = await testServer.executeOperation({
      query: `{ records(message: "${message}") { ${objects} } }`,
    });

    expect(result.errors).toBeUndefined();
    expect(result?.data?.records?.mentions.length).toBe(0);
    expect(result?.data?.records?.links.length).toBe(1);
    expect(result?.data?.records?.links[0]?.url).toBe(
      "http://www.nbcolympics.com"
    );
    expect(result?.data?.records?.links[0]?.title).not.toBe("");
  });

  it("returns array of 2 mentions [ 'bob', 'john' ], 1 emoticons [ 'success' ] and 1 link", async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => {
        return {
          customAPI: new CustomAPI(),
        };
      },
    });

    const message = "@bob @john (success) such a cool feature; https://www.apollographql.com/";
    const objects = "mentions, emoticons, links { title, url }";
    const result = await testServer.executeOperation({
      query: `{ records(message: "${message}") { ${objects} } }`,
    });

    expect(result.errors).toBeUndefined();
    expect(result?.data?.records?.mentions.length).toBe(2);
    expect(result?.data?.records?.mentions[0]).toBe('bob');
    expect(result?.data?.records?.mentions[1]).toBe('john');
    expect(result?.data?.records?.emoticons.length).toBe(1);
    expect(result?.data?.records?.emoticons[0]).toBe('success');
    expect(result?.data?.records?.links.length).toBe(1);
    expect(result?.data?.records?.links[0]?.url).toBe(
      "https://www.apollographql.com/"
    );
    expect(result?.data?.records?.links[0]?.title).not.toBe("");
  });
});
