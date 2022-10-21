import Event from '../struct/Event';
import Constants from '../util/constants';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } from "discord.js";

/**
 * the mf like button
 */
class LikeButton extends Event {

  constructor() {
    super({ name: "likebutton", type: "random" });
    this.cooldown = {
      onCooldown: false,
      timeout: null
    };
    this.likeCount = 0;
  }

  /**
   * @param {boolean} [force] - to force event to trigger
   */
  canTrigger = ( force = false ) => {

    if( this.cooldown.onCooldown === false || force === true ) {

      const roll = Math.floor( Math.random() * 100 );

      if( roll === 69 || force === true ) {
        this.cooldown.onCooldown = true;
        this.cooldown.timeout = setTimeout( () => {
          this.cooldown.onCooldown = false;
        }, Constants.time.ONE_HOUR );
        this.cooldown.timeout.unref();
        return( true );
      }

    }

    return( false );

  }

  /**
   * could also save the interaction and then disable the button when the cooldown is finished
   * maybe pull the like count straight from the button label
   * @param {ButtonInteraction} interaction
   */
  handleInteraction = ( interaction ) => {
    this.likeCount += 1;
    const label = "LIKE x" + this.likeCount;
    const roll = Math.floor( Math.random() * 11 );
    const button = new ButtonBuilder( interaction.component.data );
    if( roll === 10 ) {
      button.setDisabled( true );
    }
    button.setLabel( label );
    const actionRow = new ActionRowBuilder().addComponents( [ button ] );
    interaction.update({ components: [ actionRow ] });
  }

  /**
   * @param {Bot} bot
   */
  likebutton = ( bot, context ) => {

    const channel = context.channel || bot.guilds.cache.random().channels.cache.find( c => {
      return( c.isTextBased() && c.permissionsFor( bot.user.id ).has( PermissionsBitField.Flags.SendMessages ) );
    });

    if( !!channel ) {

      console.debug( "creating like button" );

      const component = new ButtonBuilder({
        label: "LIKE",
        style: ButtonStyle.Primary,
        disabled: false,
        customId: `${this.name}-handleInteraction`
      });

      const actionRow = new ActionRowBuilder().addComponents( [ component ] );

      channel.send({ components: [ actionRow ] });
      bot.user.setActivity( "SMASH LIKE", { type: "WATCHING" } );
    }
    else {
      console.info( "no valid channel to create that mf like button in" );
    }

  }

}

export default new LikeButton();

/**
 * @typedef {import('discord.js').ButtonInteraction} ButtonInteraction
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').TextChannel} TextChannel
 * @typedef {import('../struct/Bot').default} Bot
 */