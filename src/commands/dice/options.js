import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

export default {
  "name": "dice",
  "description": "perfectly normal and fair dice rolling scheme",
  "type": ApplicationCommandType.ChatInput,
  "options":
  [
    {
      "name": "roll",
      "description": "roll a virtual dice",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "size",
          "description": "size of dice to roll; Negative implies disadvantage (defaults to 20)",
          "type": ApplicationCommandOptionType.String,
          "required": false
        },
        {
          "name": "count",
          "description": "How many dice to roll (defaults to 1)",
          "type": ApplicationCommandOptionType.String,
          "required": false
        }
      ]
    },
    {
      "name": "get_history",
      "description": "get the last 16 rolls",
      "type": ApplicationCommandOptionType.Subcommand
    }
  ]
};
