/**
 * various constants for bean to reduce errors from my inability to spell
 */
class Constants {

  static interactionMethods = Object.freeze({
    /** base interaction */
    DEFER_REPLY: "deferReply", 
    /** base interaction */
    DELETE_REPLY: "deleteReply",
    /** base interaction */
    EDIT_REPLY: "editReply",
    /** base interaction */
    FETCH_REPLY: "fetchReply",
    /** base interaction */
    FOLLOW_UP: "followUp",
    /** base interaction (use this 90% of the time) */
    REPLY: "reply",
    /** message component interactions (button & select menu) */
    UPDATE: "update",
    /** auto complete interaction */
    RESPOND: "respond"
  });

  static emoji = Object.freeze({

    B: ":b:",

    FLUSHED: ":flushed:",
    TRIUMPH: ":triumph:",
    RAGE: ":rage:",
    CRY: ":cry:",
    SOB: ":sob:",

    ZERO: ":zero:",
    ONE: ":one:",
    TWO: ":two:",
    THREE: ":three:",
    FOUR: ":four:",
    FIVE: ":five:",
    SIX: ":six:",
    SEVEN: ":seven:",
    EIGHT: ":eight:",
    NINE: ":nine:",

    WHITE_CIRCLE: ":white_circle:",
    RED_CIRCLE: ":red_circle:",
    BLUE_CIRCLE: ":blue_circle:",
    GREEN_CIRCLE: ":green_circle:",
    ORANGE_CIRCLE: ":orange_circle:",

    SMALL_RED_TRIANGLE_DOWN: ":small_red_triangle_down:"
  });

  static styles = Object.freeze({
    PRIMARY: "PRIMARY",
    SECONDARY: "SECONDARY",
    SUCCESS: "SUCCESS",
    DANGER: "DANGER",
    LINK: "LINK"
  });

  static limits = Object.freeze({
    /** 2000 */
    MESSAGE_CONTENT: 2000,
    /** 25 */
    SELECT_MENU_OPTIONS: 25,
    /** 5 */
    ACTION_ROW_COMPONENTS: 5
  });

  static time = Object.freeze({
    /** in ms */
    ONE_MINUTE: 60000,
    /** in ms */
    ONE_HOUR: 60000000,
    /** in ms */
    TWO_SECONDS: 2000
  });

}

export default Constants;
