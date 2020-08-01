# Bean Stalk

A personal Discord bot using Discord.js and questionable programming practices.

## Commands

Commands are defined in the `src/commands/` directory.
They are set to a Discord Collection map with the `name` as the key.


To add a new command, or edit an existing one, follow this format:

```js
  /**
   * @interface
   * @property { String } name
   * @property { String } description
   * @property { Array<String> } aliases
   * @property { Array<String> } options
   * @property { Array<String> } examples
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
  options: [ "option1", "option2" ],
  examples: [ "examples of how to use the command" ],
  aliases: [ "alternative_command_names", "no_spaces_here_too" ],
  exec( message, bot ) {
    const args = message.content.shift( 1 ).split( /\s+/ );
    console.debug( "args:", args );
    // ...
    message.channel.send( "Hello " + message.author );
    // ...
    return;
  },
  // -- You might also want to include some helper functions and/or state object
  state: { /* OPTIONAL */ },
  helperFunction() {
    // OPTIONAL
  },
};
```
