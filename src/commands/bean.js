import Command from "../struct/Command";
import CommandOptions from "../../slashCommands/bean.json";
import { execSync } from "child_process";
import { testGuild } from "../../secrets.json";

/**
 * very safe bean system commands
 */
class Bean extends Command {

  constructor() {
    super( CommandOptions );
    this.guild = testGuild;
  }

  status = () => {
    const response = "```\n" + execSync( "systemctl status bean" ).toString() + "\n```";
    return({ type: "reply", payload: response });
  }

  logs = ( interaction ) => {
    const lines = parseInt( interaction.options.getNumber( "lines" ) ) || 15;
    const response = "```\n" + execSync( `journalctl -n ${lines} --no-pager -u bean` ).toString() + "\n```";
    return({ type: "reply", payload: response });
  }

};

export default new Bean();
