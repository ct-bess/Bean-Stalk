/**
 * standard bean stalk response object
 * @property {string} method - interaction method to invoke
 * @property {MessageOptions|MessagePayload} payload - object to respond with
 */
class Response {

  /** @type {string} */
  method;
  /** @type {MessageOptions|MessagePayload} */
  payload;

  constructor( method, payload ) {
    this.method = method;
    this.payload = payload;
  }

};

export default Response;

/**
 * @typedef {import('discord.js').MessageOptions} MessageOptions
 * @typedef {import('discord.js').MessagePayload} MessagePayload
 */
