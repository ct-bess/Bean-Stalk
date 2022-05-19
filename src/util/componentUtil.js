import { MessageActionRow, MessageSelectMenu } from "discord.js";
import InternalError from "../struct/InternalError";
import Constants from "./constants";

class ComponentUtil {

  /**
   * Builds select menus
   * - note: select menus can have 1 to 25 options, no duplicate options, 1 select menu per action row, and 5 max action rows
   * @param {MessageSelectMenuOptions} selectData
   * @returns {Array<MessageActionRow>}
   */
  static buildSelectMenus = ( selectData ) => {

    const actionRows = [];

    if( selectData.options.length <= Constants.limits.SELECT_MENU_OPTIONS ) {
      actionRows.push( new MessageActionRow().addComponents(
        new MessageSelectMenu( selectData )
      ));
    }
    else {

      let i = 0;

      while( selectData.options.length > Constants.limits.SELECT_MENU_OPTIONS ) {
        const elements = selectData.options.splice( 0, Constants.limits.SELECT_MENU_OPTIONS5 );
        const data = Object.create( selectData );
        data.options = elements;
        data.customId = selectData.customId + i;
        actionRows.push( new MessageActionRow().addComponents(
          new MessageSelectMenu( data )
        ));
        ++i;
      }

      // finally, push remaining options
      if( selectData.options.length > 0 ) {
        selectData.customId = selectData.customId + i;
        actionRows.push( new MessageActionRow().addComponents(
          new MessageSelectMenu( selectData )
        ));
      }

    }

    if( actionRows.length > Constants.limits.ACTION_ROW_COMPONENTS ) {
      throw new InternalError( `action rows exceeds the max of 5; action row length: ${actionRows.length}` );
    }

    return( actionRows );

  }

}

export default ComponentUtil;
