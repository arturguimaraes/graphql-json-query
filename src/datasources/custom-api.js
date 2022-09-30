const { RESTDataSource } = require("apollo-datasource-rest");
const extractor = require("unfluff");

const EMPTY_RESPONSE = {
  mentions: [],
  emoticons: [],
  links: [],
};

class CustomAPI extends RESTDataSource {
  constructor() {
    super();
  }

  /***
   * Takes a chat message string in GraphQL query format as input,
   * and returns a JSON object containing information about its contents.
   */
  getRecords(message) {
    if (this.messageInvalid(message)) return EMPTY_RESPONSE;
    return {
      mentions: this.getMentions(message),
      emoticons: this.getEmoticons(message),
      links: this.getLinks(message),
    };
  }

  /***
   * Validates message field for undefined, null and empty string values
   */
  messageInvalid(message) {
    return message === undefined || message === null || message === "";
  }

  /***
   * A way to mention a user. Always starts with an '@' and ends when
   * hitting a non-word character.
   */
  getMentions(message) {
    //if doesn't have '@', return empty
    const hasAt = (message.match(/@/g) || []).length > 0;
    if (!hasAt) return [];

    //splits in substrings removing the '@'
    //anything to the left of the first '@' should not be disconsidered
    const substrings = message.split("@").slice(1);

    //Only considers alphanumeric characters, underscore and dash, and
    //dot but not as the last element
    const mentions = substrings.map((mention) => {
      const nonWord = mention.match(/[^a-zA-Z0-9_-\S]+/);

      //removes non-word chars and everything after that
      if (nonWord !== null) mention = mention.substr(0, nonWord.index);

      //dot at the end check
      const lastDotIndex = mention.lastIndexOf(".");
      if (lastDotIndex === mention.length - 1)
        mention = mention.substr(0, mention.length - 1);

      return mention;
    });
    mentions.sort((a, b) => {
      if (a < b) return -1;
      return 1;
    });
    return mentions;
  }

  /***
   * For this exercise, you only need to consider 'custom' emoticons which
   * are alphanumeric strings, no longer than 15 characters, contained in parenthesis.
   * You can assume that anything matching this format is an emoticon.
   */
  getEmoticons(message) {
    //get occurrencies of ( and ), if not at least one each, return empty array
    const hasParenthesis =
      (message.match(/\(/g) || []).length > 0 &&
      (message.match(/\)/g) || []).length > 0;
    if (!hasParenthesis) return [];

    //splits in substrings removing the '('
    //anything to the left of the first '(' should not be disconsidered
    const substrings = message.split("(").slice(1);

    //Only considers alphanumeric characters, no longer than 15 characters, contained in parenthesis
    const emoticons = substrings.reduce((array, emoticon) => {
      //if it doesn't have closing parenthesis, skip element
      const closePar = emoticon.indexOf(")");
      if (closePar === -1) return [...array];

      const nonWord = emoticon.match(/[^a-zA-Z0-9]+/);

      //removes non-alphanumeric chars and everything after that
      if (nonWord !== null) emoticon = emoticon.substr(0, nonWord.index);

      //if string not valid or bigger than 15, skip this element
      if (emoticon === "" || emoticon.length > 15) return [...array];

      //concat element in the array
      return array.concat(emoticon);
    }, []);

    emoticons.sort((a, b) => {
      if (a < b) return -1;
      return 1;
    });
    return emoticons;
  }

  /***
   * Any URLs contained in the message.
   */
  getLinks(message) {
    //get occurrencies of 'http' which also includes 'https', if not, return empty array
    const hasUrl = (message.match(/http/g) || []).length > 0;
    if (!hasUrl) return [];

    //splits in substrings removing the 'http'
    //anything to the left of the first 'http' should not be disconsidered
    const substrings = message.split("http").slice(1);

    //Only considers alphanumeric characters, no longer than 15 characters, contained in parenthesis
    const links = substrings.map((url) => {
      //add http again
      url = "http" + url;

      const nonWord = url.match(/[^a-zA-Z0-9_-\S]+/);

      //removes non-alphanumeric chars and everything after that
      if (nonWord !== null) url = url.substr(0, nonWord.index);

      //dot at the end check
      const lastDotIndex = url.lastIndexOf(".");
      if (lastDotIndex === url.length - 1) url = url.substr(0, url.length - 1);

      const link = {
        url: url,
      };
      return link;
    });

    links.sort((a, b) => {
      if (a.url < b.url) return -1;
      return 1;
    });

    return links;
  }

  /***
   * Get the page's title.
   */
  async getTitle(url) {
    try {
      const page = await fetch(url);
      const html = await page.text();
      const data = extractor(html);
      if (data.title == undefined || data.title == null || data.title == "")
        return "No title found";
      return data.title;
    } catch (error) {
      return `Error fetching title for ${url}: ${error.message}`;
    }
  }
}

module.exports = CustomAPI;
