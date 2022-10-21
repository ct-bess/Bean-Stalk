import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

export default {
  "name": "connect4",
  "description": "play a fantastic game of connect4",
  "type": ApplicationCommandType.ChatInput,
  "options":
  [
    {
      "name": "join",
      "description": "join the game",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "emoji",
          "description": "specify an emoji to use as your marker (press TAB after typing it in)",
          "type": ApplicationCommandOptionType.String,
          "required": false
        }
      ]
    },
    {
      "name": "new",
      "description": "create a new game (no custom board size, maybe ever)",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "override",
          "description": "trigger a hard reset of the board and players",
          "type": ApplicationCommandOptionType.Boolean,
          "required": false
        }
      ]
    },
    {
      "name": "kick",
      "description": "remove a user from the game (this is so sad)",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "who",
          "description": "literally who?",
          "type": ApplicationCommandOptionType.User,
          "required": true
        }
      ]
    }
  ]
};
