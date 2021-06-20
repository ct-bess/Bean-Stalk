# Bean-Stalk :seedling:

A personal Discord bot using [Discord.js](https://discord.js.org) and questionable programming practices (proceed with caution).


Bean-Stalk was developed to run on a single server. Some commands may behave *strange* if multiple servers are using them at once.
> For example, the connect4 command doesn't create seperate board instances per server.
> So you could consider it a feature that you can play connect4 across different servers

### Contents

- [ Design ]( #Design )
- [ Build and Run ]( #Build-and-Run )
- [ Key Features ]( #Key-Features )
- [ Commands ]( #Commands )
- [ MessageOps ]( #MessageOps )

## Design

Bean-Stalk is designed to be agile. Commands can be added or even modified on the fly.
Commands are also created with flexibility in mind; One command can call or change the state of another.

## Build and Run

1. Create the bot from Discord's developer portal & invite to your server

2. Install the node.js version Discord.js is dependent on

   You can find out [here](https://www.npmjs.com/package/discord.js)
   Installing node.js should also install `npm`

3. Clone the repository and download this project's node module dependencies by running `npm i` in the project's directory

4. Initialize some of Bean Stalk's private files so he doesn't break on start up (all files called `*.template`)

5. Build the bot with `npm run build` then start him with `npm run start`

## Key Features

- Show the server how many mistakes you make by developing new commands or editing existing ones on the fly with the system command!

   `[system reload CommandName`

- Ping your friends to oblivion with arbitrary and uncontainerized JavaScript sent straight to the host OS running Bean!

   `[js for( let i = 0; i < Number.MAX_SAFE_INTEGER; ++i ) console.log('<@!your_friend's_id>')`

- Make voice chat unusable for the entire call with the voice echoing command!

   `[vc echo --user=user_to_echo`

- Play a 6 way game of inverted connect 4!

   `[c4 new` then have everyone `[c4 join` and start playing!

- Yeet very important messages across servers with the echo command!

   `[yeet --channel=other_server's_channel`

- Create custom events to trigger messages or commands at certain hours of the day with the event commands!

   `[event create ...`

- Give your server members the power of the gods by letting them create and run their own custom commands!

   `[cc new ...`

## Commands

Commands are defined in the `src/commands/` directory.
They are set to a Discord Collection map with the `name` as the key.


To add a new command, or edit an existing one, follow the format of this example command:

```js
import { argHandler } from "../util/argHandler.js";

export default {
  name: "the_command_name_without_spaces",
  description: "command's description; in depth help text is defined in help.json",
  aliases: [ "shorthand_cmd_names", "no_spaces_here_too" ],
  /** @param {Discord.Message} message - the message object that triggered the command
   *  @param {Discord.Client} bot - the client handling the command
   */
  exec( message, bot ) {

    // create argument map
    const args = argHandler( message );

    // do something with the args
    message.reply( args.random() ?? "no args :sob:" );

  }

};
```

## MessageOps

AKA Regex Responses

This is a cheeky function ran against all messages and can be used to unleash your inner dad jokes.
This file is found at `src/messageOps.js`

The goal is to have the bot say something amusing every once in a while.
We don't want to spam the server with these messages.

```js
/** @param {Discord.Message} message - the message object that triggered the message op
 *  @param {Discord.Client} bot - the client handling the command
 */
export const messageOps = ( message, bot ) => {

   // make sure to put something in place that prevents these from firing each time
   if( message.createdTimestamp % 7 !== 0 ) return;

  if( /i('m)?\b.+(really|so|for)\b.+/i.test( message.content ) ) {
    message.reply( "yeah same bro" );
  }

};
```
