import { countNonAscii, verifyCharacters } from "../../test/util";

// ================================================================================================

/**
 * Interface for any Generic Card.
 * This interface is not used within the game logic.
 */
export interface Card {
    title: string,
    slug: cardSlug,
    stage: stageT,
    image: cardImage,
    frequency?: posInt,
    description?: string,
    connectivity?: Connectivity,
    isOptional?: boolean,
    effect?: string,
    elseCondition?: string,
    elseEffect?: string,
}

/**
 * Interface for a Activity Card.
 * This interface is not used within the game logic.
 */
export interface ActivityCard {
    title: string,
    slug: cardSlug,
    stage: stageT,
    frequency: posInt,
    image: cardImage,
    description: string,
    connectivity: Connectivity
}

/**
 * Interface for a Event Card.
 * This interface is not used within the game logic.
 */
export interface EventCard {
    title: string,
    slug: cardSlug,
    stage: stageT,
    image: cardImage,
    isOptional: boolean,
    effect: string,
    elseCondition: string,
    elseEffect: string,
}

/**
 * Interface for a Activity Card as used within the game logic.
 */
export interface GameActivityCard {
    id: number,
    title: string,
    stage: stageT,
    frequency: posInt,
    image: cardImage,
    description: string,
    connectivity: Connectivity
}

/**
 * Interface for a Event Card as used within the game logic.
 */
export interface GameEventCard {
    id: number,
    title: string,
    stage: stageT,
    image: cardImage,
    isOptional: boolean,
    effect: effect[],
    elseCondition: logicFunction,
    elseEffect: effect[],
}

/**
 * Interface for Activity Card Connectivity.
 */
export interface Connectivity {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
}

/**
 * Interface for Generator Expressions to select groups of cards based on common criteria.
 * e.g. a common stage.
 */
export interface CardGroupGenerator {
    activityCardFilter: string,
    eventCardFilter: string,
}

// ================================================================================================

/**
 * A convenience function to determine whether an Enumerated data type contains a specific value.
 * @param enumerated The given Enum.
 * @param value The given value.
 * @returns True if the given Enum contains the given value, False otherwise.
 */
function has(enumerated: Object, value: Object) {
    return Object.values(enumerated).includes(value);
}

// ================================================================================================

/**
 * Allowed Image Extensions.
 */
const ImageExtension = {
    JPG : 'jpg',
    JPEG : 'jpeg',
    PNG : 'png',
    GIF : 'gif',
    WEBP : 'webp',
}

/**
 * Logic Operators used in card logic functions and card selector statements.
 */
const LogicOperator = {
    AND : '&&',
    OR : '||',
}

/**
 * Quantifier Operators.
 */
const QuantifierOperator = {
    ALL : '*',
}

/**
 * Modifiers used in logic expressions.
 */
const Modifier = {
    NON_ADJACENT : '!',
    UNIQUE_SELECT : '^',
}

/**
 * Types of cards used in the game.
 */
const CardType = {
    ACTIVITY : 'act',
    EVENT : 'event',
}

/**
 * The different stages appearing in the game.
 */
const CardStage = {
    PLAN : 'PLAN',
    CONTEXT : 'CONTEXT',
    IMPLEMENTATION : 'IMP',
    WRITEUP : 'WRITEUP',
}

/**
 * Effect instructions.
 */
const Instruction = {
    ADD : 'add',
    REMOVE : 'remove',
    REMOVE_ALL : 'removeall',
    QUEUE : 'queue',
    BLOCK : 'block',
    SAVE : 'save',
    FLIP : 'flip',
}

// ================================================================================================

declare class LogicOperatorTag {
    private __kind: 'LogicOperator';
}

declare class PositiveIntegerTag {
    private __kind: 'positiveInteger';
}

declare class CardSlugTag {
    private __kind: 'cardSlug';
}

declare class CardGroupTag {
    private __kind: 'cardGroup';
}

declare class ImageExtensionTag {
    private __kind: 'imageExtension';
}

declare class QuantifierOperatorTag {
    private __kind: 'quantifierOperator';
}

declare class ModifierTag {
    private __kind: 'modifier';
}

declare class InstructionTag {
    private __kind: 'instruction';
}

// ================================================================================================

export type stageT = 1 | 2 | 3 | 4;
type logicOperator = string & LogicOperatorTag;
type posInt = number & PositiveIntegerTag;
export type cardSlug = string & CardSlugTag;
export type cardGroup = string & CardGroupTag;
type imageExtension = string & ImageExtensionTag;
type quantifierOperator = string & QuantifierOperatorTag;
type modifier = string & ModifierTag;
type instruction = InstructionTag;

// ================================================================================================

export function isLogicOperator(str: any): str is LogicOperatorTag {
    return has(LogicOperator, str);
}


function isPositiveInteger(num: any): num is PositiveIntegerTag {
    if (typeof num == 'number') {
        let flag = true;
        flag = flag && Math.round(num) == num;
        flag = flag && num > 0;
        return flag;
    } else {
        return false;
    }
}


export function isCardSlug(str: any): str is CardSlugTag {
    if (typeof str == 'string' && str.split("-").length == 3) {
        let strSplit = str.split("-");
        let flag = true;
        flag = flag && countNonAscii(str) == 0;
        flag = flag && verifyCharacters(str, /[a-zA-Z0-9\-]/, true);
        flag = flag && has(CardType, strSplit[0]);
        flag = flag && has(CardStage, strSplit[1]);
        return flag;
    } else {
        return false;
    }
}


export function isCardGroup(str: any): str is CardGroupTag {
    if (typeof str == 'string') {
        let flag = true;
        flag = flag && verifyCharacters(str.charAt(0), /[$A-Z]/, true);
        flag = flag && verifyCharacters(str.slice(1, str.length), /[A-Z]/, true);
        return flag;
    } else {
        return false;
    }
}


function isImageExtension(str: any): str is ImageExtensionTag {
    return has(ImageExtension, str);
}


function isQuantifierOperator(str: any): str is QuantifierOperatorTag {
    return has(QuantifierOperator, str);
}

function isModifier(str: string): str is modifier {
    return has(Modifier, str);
}

export function isInstruction(str: any): str is InstructionTag {
    return has(Instruction, str);
}

// ================================================================================================

type cardImage = `${cardSlug}.${imageExtension}`;
export type quantifier = quantifierOperator | `${posInt}`;
export type cardStatement = cardSlug | cardGroup | number;
export type cardSelector = cardStatement | [cardSelector, logicOperator, cardSelector]; //type cardSelector = cardStatment | (cardStatment | logicOperator | cardSelector)[];
export type logicExpression = [quantifier, modifier[], cardSelector] | boolean;
export type logicFunction = logicExpression | [logicFunction, logicOperator, logicFunction]; //type logicFunction = logicExpression | (logicFunction | logicOperator | logicFunction)[]
export type effect = [instruction, logicFunction];

// ================================================================================================

function isCardImage(str: string): str is cardImage {
    if (typeof str == 'string' && str.split(".").length == 2) {
        let strSplit = str.split(".");
        let flag = true;
        flag = flag && isCardSlug(strSplit[0]);
        flag = flag && has(ImageExtension, strSplit[1]);
        return flag;
    } else {
        return false;
    }
}


export function isQuantifier(str: string): str is quantifier {
    if (str.length >= 1) {
        let flag = isPositiveInteger(parseInt(str));
        flag = flag || has(QuantifierOperator, str);
        return flag;
    } else {
        return false;
    }
}


export function isCardStatement(str: any): str is cardStatement {
    if (typeof str == 'number') {
        return true;
    } else if (typeof str == 'string') {
        return isCardSlug(str) || isCardGroup(str);
    } else {
        return false;
    }   
}

// ================================================================================================

export function isModifierArray(arr: string[]): arr is modifier[] {
    let flag = true;
    for (let i = 0; i < arr.length; i++) {
        flag = flag && isModifier(arr[i]);
        if (!flag) {
            break;
        }
    }
    return flag;
}