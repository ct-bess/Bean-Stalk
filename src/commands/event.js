import { Collection } from "discord.js";

export default {
  name: "event",
  aliases: [ "rsvp" ],
  description: "RSVP/event tool. Bean will spam your group with this command",
  options: [
    "create <name> <when> <where> <?repeats>\tCreates a new event; When needs to be formatted MM/dd/YYYY ${GMT_OFFSET}, repeats is boolean",
    "edit",
    "show",
    "join",
    "leave"
  ],
  examples: [],
  events: new Collection(),
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/ );
    args.shift();
    const subCommand = args[0].toLowerCase() || "lmao";
    let response = "";
    switch( subCommand ) {
      case "create":
        if( this.events.has( args[1] ) ) {
          response = `event ${args[1]} already exists`;
        }
        else {
          const event = {
            name: args[1],
            when: args[2],
            where: args[3],
            repeats: args[4] || false,
            participants: [ "bean-stalk" ]
          };
          this.events.set( event.name, event );
          response = `created ${args[1]}`;
        }
        break;
      case "join":
        const eventName = args[1];
        // remove the .username part to @
        // also this looks disgusting
        if( this.events.has( eventName ) ) {
          if( this.events.get( eventName ).participants.find( elem => elem !== message.author.username ) ) {
            this.events.get( eventName ).participants.push( message.author.username );
            response = `succ join ${eventName}`;
          }
          else {
            response = `bruH your already in it`;
          }
        }
        else {
          response = `event ${eventName} DNE`;
        }
        break;
      case "show":
        // Very WET -- make this a helper function like JSONtoString( object, depth, format )
        if( this.events.has( args[1] ) ) {
          const content = this.events.get( args[1] );
          for( const key in content ) {
            if( typeof( content[key] ) === "object" ) {
              response += `**${key}**:\n`;
              for( const nestedKey in content[key] ) {
                response += `${content[key][nestedKey]} `;
              }
            }
            else response += `\`${key}\`: ${content[key]}\n`;
          }
        }
        else {
          response = `event ${eventName} DNE`;
        }
        break;
      default:
        response = `No such sub command ${subCommand} brO`;
    }
    message.channel.send( !!response && response.length > 0 ? response : "this Bruh empty" );
  }
};
