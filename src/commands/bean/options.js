import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

export default {
  "name": "bean",
  "description": "bean stalk system commands",
  "type": ApplicationCommandType.ChatInput,
  "options":
  [
    {
      "name": "logs",
      "description": "fetch awesome logs",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "lines",
          "description": "how many lines to fetch (defaults to 15)",
          "type": ApplicationCommandOptionType.Number,
          "required": false
        }
      ]
    },
    {
      "name": "post_command",
      "description": "post a slash command",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "command",
          "description": "command name to post",
          "type": ApplicationCommandOptionType.String,
          "required": false
        }
      ]
    },
    {
      "name": "trigger_event",
      "description": "manualy trigger a bean event",
      "type": ApplicationCommandOptionType.Subcommand
    },
    {
      "name": "prune_commands",
      "description": "delete unused interactions",
      "type": ApplicationCommandOptionType.Subcommand
    },
    {
      "name": "status",
      "description": "get bean's awesome systemd status",
      "type": ApplicationCommandOptionType.Subcommand,
      "options":
      [
        {
          "name": "status",
          "description": "what kind of status",
          "type": ApplicationCommandOptionType.String,
          "required": false,
          "choices":
          [
            { "name": "specs", "value": "specs" },
            { "name": "service", "value": "service" }
          ]
        }
      ]
    }
  ]
};
