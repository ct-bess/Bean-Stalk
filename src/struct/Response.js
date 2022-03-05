import { CommandInteraction as interaction } from "discord.js";
/**
 * standard bean stalk response object
 * @property {string} method - interaction method to invoke
 * @property {MessageOptions|MessagePayload} payload - object to send
 */
class Response {

  /** @type {string} */
  method;
  /** @type {MessageOptions|MessagePayload} */
  payload = {};

  constructor( method, payload = {} ) {
    this.method = method;
    this.payload = payload;
  }

  /**
   * Returns the intended response
   */
  get response() {
    return( [ interaction[this.method], payload ] );
  }

};

export default Response;

/**
 * @typedef {import('discord.js').MessageOptions} MessageOptions
 * @typedef {import('discord.js').MessagePayload} MessagePayload
 */
