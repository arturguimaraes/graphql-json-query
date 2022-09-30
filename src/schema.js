const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    """
    Takes a chat message string in GraphQL query format as input,
    and returns a JSON object containing information about its contents.
    """
    records(message: String!): Response!
  }

  "JSON object containing information about its contents: mentions, emoticons and links."
  type Response {
    """
    A way to mention a user. Always starts with an '@' and ends when
    hitting a non-word character.
    """
    mentions: [String]

    """
    For this exercise, you only need to consider 'custom' emoticons which
    are alphanumeric strings, no longer than 15 characters, contained in parenthesis.
    You can assume that anything matching this format is an emoticon.
    """
    emoticons: [String]

    "Any URLs contained in the message, along with the page's title."
    links: [Link]
  }

  "Any URLs contained in the message, along with the page's title."
  type Link {
    "The link's URL."
    url: String!
    "The link's page title for the URL given."
    title: String!
  }
`;

module.exports = typeDefs;
