import Command from "../../struct/Command";
import CommandOptions from "./options.json";
import Response from "../../struct/Response";
import Constants from "../../util/constants"
import { testGuild, homeGuildId } from "../../../secrets.json";
import InternalError from "../../struct/InternalError";
import gunner from "../../../kb/drg/gunner.json";
import driller from "../../../kb/drg/driller.json";
import scout from "../../../kb/drg/scout.json";
import engineer from "../../../kb/drg/engineer.json";
import generic from "../../../kb/drg/generic.json";
import { Collection, MessageEmbed } from "discord.js";
import { selectUpgrades } from "./selectUpgrades";

/**
 * very important DRG commands
 */
class Drg extends Command {

  constructor() {
    super( CommandOptions );
    this.guild = [ testGuild, homeGuildId ];
    // yes
    this.classes = new Collection();
    this.classes.set( "gunner", gunner );
    this.classes.set( "driller", driller );
    this.classes.set( "scout", scout );
    this.classes.set( "engineer", engineer );
  }

  /**
   * @param {CommandInteraction} interaction
   */
  build = ( interaction ) => {

    const className = interaction.options.getString( "class" )?.toLowerCase() || this.classes.randomKey();
    let dwarf = this.classes.get( className );

    const selectedPrimary = dwarf.primary[ Math.floor( Math.random() * dwarf.primary.length ) ];
    const primaryUpgrades = selectUpgrades( selectedPrimary.upgrades );

    const selectedSecondary = dwarf.secondary[ Math.floor( Math.random() * dwarf.secondary.length ) ];
    const secondaryUpgrades = selectUpgrades( selectedSecondary.upgrades );

    const traversalUpgrades = selectUpgrades( dwarf.traversal[0].upgrades );

    const selectedThrowable = dwarf.throwable[ Math.floor( Math.random() * dwarf.throwable.length ) ];

    const armorUpgrades = selectUpgrades( generic.armor.upgrades );

    const passivePerks = [ ...generic.perks.passive ];
    const selectedPassivePerks = [
      passivePerks.splice( Math.floor( Math.random() * passivePerks.length ), 1 ),
      passivePerks.splice( Math.floor( Math.random() * passivePerks.length ), 1 ),
      passivePerks.splice( Math.floor( Math.random() * passivePerks.length ), 1 )
    ];

    const activePerks = [ ...generic.perks.active ];
    const selectedActivePerks = [
      activePerks.splice( Math.floor( Math.random() * activePerks.length ), 1 ),
      activePerks.splice( Math.floor( Math.random() * activePerks.length ), 1 )
    ];

    // color code based on class
    const embed = new MessageEmbed({
      title: `${interaction.member.nickname}`,
      description: `${className}`,
      fields: [
        {
          name: `Primary: ${selectedPrimary.name} (${primaryUpgrades.shorthand})`,
          value: primaryUpgrades.upgrades.join( "\n" )
        },
        {
          name: `Secondary: ${selectedSecondary.name} (${secondaryUpgrades.shorthand})`,
          value: secondaryUpgrades.upgrades.join( "\n" )
        },
        {
          name: `Traversal: ${dwarf.traversal[0].name} (${traversalUpgrades.shorthand})`,
          value: traversalUpgrades.upgrades.join( "\n" )
        },
        {
          name: "Grenade:",
          value: selectedThrowable
        },
        {
          name: `Armor: (${armorUpgrades.shorthand})`,
          value: armorUpgrades.upgrades.join( "\n" )
        },
        {
          name: `Passive Perks:`,
          value: selectedPassivePerks.join( "\n" )
        },
        {
          name: `Active Perks:`,
          value: selectedActivePerks.join( "\n" )
        }
      ]
    });

    return( new Response( Constants.interactionMethods.REPLY, { embeds: [ embed ] } ) );

  }

};

export default new Drg();

/**
 * @typedef {import('../../struct/Bot').default} Bot
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').SelectMenuInteraction} SelectMenuInteraction
 */
