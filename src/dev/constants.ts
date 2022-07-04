export const version = "0.1.0";

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

export const QUANT_PLAN_TILES = 8;

export const COLOURS = {
    background: 0x95A3B3,
    black: 0x000000,
    button: 0x84DCC6,
    buttonEvent: 0x4B4E6D,
    buttonDisabled: 0x45494E,
    buttonHover: 0x5BA4A0,
    buttonEventHover: 0x323B50,
    toolbar: 0x222222,
    card: 0xdfe5e8,
    cardHover: 0xDCDCDC,
    cardStack: 0xFFB5B0,
    cardStackHover: 0xD28F9D
};

export const FONTS = {
    button: {color: "#000000", fontFamily: "Bahiana", fontSize: "50px"},
    buttonEvent: {color: "#FFFFFF", fontFamily: "Bahiana", fontSize: "40px"},
    h1: {color: "#000000", fontFamily: "Bahiana", fontSize: "240px"},
    h2: {color: "#FFFFFF", fontFamily: "Bahiana", fontSize: "170px"},
    h3: {color: "#000000", fontFamily: "Bahiana", fontSize: "60px"},
    h3Light: {color: "#FFFFFF", fontFamily: "Bahiana", fontSize: "60px"},
};

export const stageNames = ["", "PLAN", "CONTEXT", "IMPLEMENTATION", "WRITE-UP"];

export const LOGIC_LOGICEXPRESSION_SEPARATOR = '~';

export const LOGIC_QUANTIFIER_ALL = '*';

export const LOGIC_MODIFIER_NON_ADJACENT = '!';
export const LOGIC_MODIFIER_UNIQUE = '^';

export const LOGIC_SELECTOR_CARD_GROUP = '$';

export const LOGIC_BRACKET_LOGICEXPRESSION_OPEN = '{';
export const LOGIC_BRACKET_LOGICEXPRESSION_CLOSE = '}';
export const LOGIC_BRACKET_CARD_OPEN = '[';
export const LOGIC_BRACKET_CARD_CLOSE = ']';
export const LOGIC_BRACKET_PRECEDENCE_OPEN = '(';
export const LOGIC_BRACKET_PRECEDENCE_CLOSE = ')';

export const LOGIC_BRACKET_MAP: Map<string, string> = new Map([
    [LOGIC_BRACKET_LOGICEXPRESSION_OPEN, LOGIC_BRACKET_LOGICEXPRESSION_CLOSE],
    [LOGIC_BRACKET_CARD_OPEN, LOGIC_BRACKET_CARD_CLOSE],
    [LOGIC_BRACKET_PRECEDENCE_OPEN, LOGIC_BRACKET_PRECEDENCE_CLOSE]
]);

export const LOGIC_REVERSE_BRACKET_MAP: Map<string, string> = new Map([
    [LOGIC_BRACKET_LOGICEXPRESSION_CLOSE, LOGIC_BRACKET_LOGICEXPRESSION_OPEN],
    [LOGIC_BRACKET_CARD_CLOSE, LOGIC_BRACKET_CARD_OPEN],
    [LOGIC_BRACKET_PRECEDENCE_CLOSE, LOGIC_BRACKET_PRECEDENCE_OPEN]
]);