# Bean Stalk

A personal Discord bot using [Discord.js](https://discord.js.org) and questionable programming practices.
Bean-Stalk was developed to run on a single server. Some commands may behave *strange* if multiple servers are using them at once.
> For example, the connect4 command doesn't create seperate board instances per server.
> So you could consider it a feature that you can play connect4 across different servers

## Quick Start

1. Install the node.js version Discord.js is dependent on

   You can find out [here](https://www.npmjs.com/package/discord.js).
   Installing node.js should also install `npm`

2. Clone the repository and download this project's node module dependencies by running `npm i` in the project's directory

3. Initialize some of Bean Stalk's private files so he doesn't break on start up (script pending)

4. Optional: add Bean's home discord server to `id` in `guild.json`

5. Add a discord bot token to `auth.json` and protect it with your life

6. Build the bot with `npm run build` then start him with `npm run start`

7. Finally invite Bean-Stalk to a server

## Commands

Commands are defined in the `src/commands/` directory.
They are set to a Discord Collection map with the `name` as the key.


To add a new command, or edit an existing one, follow the format of this example command:

```js
  /**
   * @property { String } name
   * @property { String } description
   * @property { Array<String> } aliases
   * @method
   * * @name exec
   * * @returns { void }
   * * @requires Discord.js
   * * @param { Discord.Message } message
   * * @param { Discord.Client } bot
   **/
export default {
  name: "the_command_name_without_spaces",
  description: "command's description help text",
  aliases: [ "alternative_command_names", "no_spaces_here_too" ],
  exec( message, bot ) {
    const args = message.content.shift( 1 ).split( /\s+/ );
    console.debug( "args for subcommands:", args );
    if( /@|mention|reply/i.test( args[0] ) ) {
      message.reply( "Hello!" );
    }
    else {
      message.channel.send( "Hello " + message.author.username );
    }
    return;
  },
  // -- You might also want to include some helper functions and/or state object
  state: { /* OPTIONAL */ },
  helperFunction() {
    // OPTIONAL
  },
};
```

## Message Ops (Regex responses)

This is a cheeky function ran against all messages and can be used to unleash your inner dad jokes.
This file is found at `src/messageOps.js`

```js
/** 
 * @name messageOps
 * @returns { void }
 * @requires Discord.js
 * @param { Discord.Message } message 
 * @param { Discord.Client } bot
 * **/
export const messageOps = ( message, bot ) => {
  if( /i('m)?\b.+(really|so|for)\b.+/i.test( message.content ) ) {
    message.reply( "yeah same bro" );
  }
  // ...
```
