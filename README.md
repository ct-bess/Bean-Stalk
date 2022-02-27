# Bean-Stalk :seedling:

A personal Discord bot using [Discord.js](https://discord.js.org) and questionable programming practices (proceed with caution).

### Contents

- [ Design ]( #Design )
- [ Build and Run ]( #Build-and-Run )
- [ Key Features ]( #Key-Features )

## Design

Files:

- `src/index.js` is the driver; Contains the event listeners
- `src/struct/` contains the important classes
- `src/commands/` contains command classes
- `slashCommands/` contains each command's respective command options
- `kb/` contains data and system admin scripts
- `secrets.json` a very important file

## Build and Run

1. Create the bot from Discord's developer portal & invite to your server

2. Install the node.js version Discord.js is dependent on

   You can find out [here](https://www.npmjs.com/package/discord.js)
   Installing node.js should also install `npm`

3. Clone the repository and download this project's node module dependencies by running `npm i` in the project's directory

4. Obtain `secrets.json` by some means

5. Build the bot with `npm run build` then start him with `npm run start`

**Note:** the minecraft commands will fail if you don't register a minecraft service in systemd

## Key Features

- Spin-up an awesome minecraft server
