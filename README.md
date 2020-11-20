# Bean Stalk

A personal Discord bot using Discord.js and questionable programming practices.

## Commands

Commands are defined in the `src/commands/` directory.
They are set to a Discord Collection map with the `name` as the key.


To add a new command, or edit an existing one, follow the format of this example command:

```js
  /**
   * @interface
   * @property { String } name
   * @property { String } description
   * @property { Array<String> } aliases
   * @method
   * * @name exec
   * * @param { Discord.Message } message
   * * @param { Discord.Client } bot
   * * @requires Discord.js
   * * @returns { void }
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
