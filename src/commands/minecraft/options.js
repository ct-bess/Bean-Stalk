import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

export default {
  "name": "minecraft",
  "description": "minecraft system commands",
  "type": ApplicationCommandType.ChatInput,
  "options":
  [
    {
      "name": "ip",
      "description": "show server's ip address",
      "type": ApplicationCommandOptionType.Subcommand
    },
    {
      "name": "start",
      "description": "start server",
      "type": ApplicationCommandOptionType.Subcommand
    },
    {
      "name": "stop",
      "description": "stop server",
      "type": ApplicationCommandOptionType.Subcommand
    },
    {
      "name": "whitelist",
      "description": "add user to whitelist",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "username",
          "description": "minecraft username",
          "required": true,
          "type": ApplicationCommandOptionType.String
        }
      ]
    },
    {
      "name": "say",
      "description": "broadcast a message to the server",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "message",
          "description": "message to broadcast",
          "required": true,
          "type": ApplicationCommandOptionType.String
        }
      ]
    },
    {
      "name": "logs",
      "description": "get log entries",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "lines",
          "description": "number of lines to retrieve",
          "required": false,
          "type": ApplicationCommandOptionType.Number
        }
      ]
    }
  ]
};
