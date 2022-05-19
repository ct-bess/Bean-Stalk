import { CommandInteraction as interaction } from "discord.js";

/**
 * standard bean stalk response object
 * @property {string} method - interaction method to invoke
 * @property {MessageOptions|MessagePayload|string} payload - object to send; some interaction payloads support plain strings
 */
class Response {

  /** @type {string} */
  method;
  /** @type {MessageOptions|MessagePayload|String} */
  payload = {};

  constructor( method, payload = {} ) {
    this.method = method;
    this.payload = payload;

    if( !!this.payload.embeds && !( this.payload.embeds instanceof Array ) ) {
      throw new ReferenceError( `embeds must be an array` );
    }
    if( !!this.payload.components && !( this.payload.components instanceof Array ) ) {
      throw new ReferenceError( `components must be an array` );
    }

  }

  /**
   * Returns the intended response if you care
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
