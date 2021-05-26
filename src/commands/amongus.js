import { Collection } from "discord.js";
import { argHandler, coalesce } from "../commandUtil.js";

export default {
  name: "amongus",
  aliases: [ "amogus" ],
  description: "Play the hit game *amongus* but completly text based and at a very slow pace",
  game: {
    tickRate: 0,
    ticks: 0,
    players: null,
    map: null
  },
  exec( message, bot ) {
    // trust me
    message.reply( "amogus" );
  }
};
