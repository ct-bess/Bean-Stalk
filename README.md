# Bean Stalk

A personal Discord bot using Discord.js and questionable programming practices.

## Commands

Commands are defined in the `src/commands/` directory.
They are set to a Discord Collection map with the `name` as the key.


To add a new command, or edit an existing one, follow this format:

```js
export default {
  name: "command's name",
  description: "command's help text",
  aliases: [ "other names", "..." ],
  // You can also include state variables here
  state: { /* 100% optional */ },
  exec( message, args ) {
    // what is executed for this command...
  }
};
```
