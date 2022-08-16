import { cardSelector, cardSlug, effect, isCardGroup, isCardStatement, isInstruction, isLogicOperator, isModifierArray, isQuantifier, logicExpression, logicFunction, quantifier } from "./types";
import { LOGIC_BRACKET_MAP, LOGIC_BRACKET_CARD_CLOSE, LOGIC_BRACKET_CARD_OPEN, LOGIC_BRACKET_PRECEDENCE_OPEN, LOGIC_BRACKET_LOGICEXPRESSION_CLOSE, LOGIC_BRACKET_LOGICEXPRESSION_OPEN, LOGIC_REVERSE_BRACKET_MAP, LOGIC_BRACKET_PRECEDENCE_CLOSE, LOGIC_LOGICEXPRESSION_SEPARATOR } from "../constants";
import { mapGetOrElse } from "../util";


/**
 * Parses the effect or effects from the given string and converts card slugs into ID's using the given mapping.
 * 
 * @throws Unknown instruction.
 * @throws Could not recognize effect.
 * @see {@link parseLogicFunction}
 * 
 * @param effectString The string from which the effect(s) will be parsed.
 * @param slugIDMap A map mapping card slugs to card ID's.
 * @returns An array of the effect(s) that could be parsed.
 */
export function parseEffect(effectString: string, slugIDMap?: Map<cardSlug, number>): effect[] {
    let output: effect[] = [];
    let stringSplit = effectString.split(" ");
    if (stringSplit.length > 0 && stringSplit.length % 2 == 0) {
        for (let i = 0; i < stringSplit.length; i += 2) {
            let instruction = stringSplit[i]
            if (isInstruction(instruction)) {
                output.push([instruction, parseLogicFunction(stringSplit[i+1], slugIDMap)]);
            } else {
                throw `Unknown instruction '${instruction}' used in effect '${stringSplit[i]} ${stringSplit[i+1]}'`;
            }
        }
    } else if (effectString == '-') {
        return [];
    } else {
        throw `Could not recognize effect ${effectString}`;
    }
    return output;
}


/**
 * Verifies bracket closure and then calls a recursive parse of the given logic function.
 * 
 * @see {@link verifyBracketClosure}
 * 
 * @param expression The string representation of the logic function.
 * @returns The array-like logicFunction.
 */
export function parseLogicFunction(expression: string, slugIDMap?: Map<cardSlug, number>): logicFunction {
    verifyBracketClosure(expression);
    return recursiveParseLogicFunction(expression, slugIDMap);
}


/**
 * Recursively parses a logic function from it's string representation.
 * This function also verifies the correct structure of the expression and throws an error if this structure is violated.
 * 
 * @throws ParseError: Reached EOS after logic operator.
 * @throws ParseError: Expression uses unknown logic operator.
 * @throws Illegal character.
 * @see {@link parseLogicExpression}
 * 
 * @param expression The string representation of the logic function.
 * @param slugIDMap A map mapping card slugs to card ID's.
 * @returns The array-like logicFunction.
 */
function recursiveParseLogicFunction(expression: string, slugIDMap?: Map<cardSlug, number>): logicFunction {
    if (expression == "true") {
        return true;
    } else if (expression == "false") {
        return false;
    }
    if (expression.charAt(0) == LOGIC_BRACKET_PRECEDENCE_OPEN) {
        let closeIndex = expression.indexOf(LOGIC_BRACKET_PRECEDENCE_CLOSE);
        if (closeIndex == expression.length-1) {
            expression = expression.slice(1, expression.length-1);
        }
        let logOperator = expression.slice(closeIndex+1, closeIndex+3);
        if (closeIndex+3 == expression.length-1) {
            throw `ParseError: Reached EOS after logic operator - operators must be followed by another logic function (${expression})`;
        }
        if (isLogicOperator(logOperator)) {
            return [recursiveParseLogicFunction(expression.slice(1, closeIndex), slugIDMap), logOperator, recursiveParseLogicFunction(expression.slice(closeIndex+3, expression.length), slugIDMap)];
        } else {
            throw `ParseError: Expression uses unknown logic operator '${logOperator}' (${expression})`;
        }
    } else if (expression.charAt(0) == LOGIC_BRACKET_LOGICEXPRESSION_OPEN) {
        let closeIndex = expression.indexOf(LOGIC_BRACKET_LOGICEXPRESSION_CLOSE);
        if (closeIndex == expression.length-1) {
            return parseLogicExpression(expression, slugIDMap);
        } else {
            let logOperator = expression.slice(closeIndex+1, closeIndex+3);
            if (closeIndex+3 == expression.length-1) {
                throw `ParseError: Reached EOS after logic operator - operators must be followed by another logic function (${expression})`;
            }
            if (isLogicOperator(logOperator)) {
                return [parseLogicExpression(expression.slice(0, closeIndex+1), slugIDMap), logOperator, recursiveParseLogicFunction(expression.slice(closeIndex+3, expression.length), slugIDMap)];
            } else {
                throw `ParseError: Expression uses unknown logic operator '${logOperator}' (${expression})`;
            }
        }
    } else {
        throw `Illegal character ${expression.charAt(0)} at start of expression - logicFunction must start with either '{' or '(' `;
    }
}


/**
 * Parses the given expression to extract a logic expression.
 * 
 * @throws ParseError.
 * @see {@link recursiveParseCardSelector}
 * 
 * @param expression The expression string to be parsed.
 * @param slugIDMap A map mapping card slugs to card ID's.
 * @returns The parsed logic expression.
 */
function parseLogicExpression(expression: string, slugIDMap?: Map<cardSlug, number>): logicExpression {
    if (expression.charAt(0) == LOGIC_BRACKET_LOGICEXPRESSION_OPEN) {
        expression = expression.slice(1, expression.length-1);
    }
    let splitQuant = expression.split(LOGIC_LOGICEXPRESSION_SEPARATOR);
    let quantifier: quantifier;
    if (isQuantifier(splitQuant[0])) {
        quantifier = splitQuant[0];
    } else {
        throw `ParseError: ${splitQuant[0]} is not a legal quantifier (${expression})`;
    }
    expression = splitQuant[1];
    let modifierSplit = 0;
    while (!LOGIC_BRACKET_MAP.has(expression.charAt(modifierSplit))) {
        modifierSplit++;
    }
    let modifiers = expression.slice(0, modifierSplit).split('');
    expression = expression.slice(modifierSplit, expression.length);
    if (isModifierArray(modifiers)) {
        return [quantifier, modifiers, recursiveParseCardSelector(expression, slugIDMap)];
    } else {
        throw `ParseError: Expression uses at least one unknown modifier (${modifiers})`;
    }
}


/**
 * Parses the given expression string for a card selector statement.
 * 
 * @throws ParseError: Reached EOS after logic operator.
 * @throws ParseError: Expression uses unknown logic operator.
 * @throws Illegal Character.
 * 
 * @param expression The expression string to be parsed.
 * @param slugIDMap A map mapping card slugs to card ID's.
 * @returns The parsed card selector statement.
 */
function recursiveParseCardSelector(expression: string, slugIDMap?: Map<cardSlug, number>): cardSelector {
    if (expression.charAt(0) == LOGIC_BRACKET_CARD_OPEN) {
        let closeIndex = expression.indexOf(LOGIC_BRACKET_CARD_CLOSE);
        if (closeIndex == expression.length-1) {
            let cardStatement = expression.slice(1, expression.length-1);
            if (isCardStatement(cardStatement)) {
                if (typeof slugIDMap != 'undefined' && typeof cardStatement == 'string' && !isCardGroup(cardStatement)) {
                    return mapGetOrElse(slugIDMap, cardStatement, -1);
                } else {
                    return cardStatement;
                }
            } else {
                throw `'${cardStatement}' is not a valid card statement`;
            }
        } else {
            let logOperator = expression.slice(closeIndex+1, closeIndex+3);
            if (closeIndex+3 == expression.length-1) {
                throw `ParseError: Reached EOS after logic operator - operators must be followed by another logic function (${expression})`;
            }
            if (isLogicOperator(logOperator)) {
                return [recursiveParseCardSelector(expression.slice(0, closeIndex+1), slugIDMap), logOperator, recursiveParseCardSelector(expression.slice(closeIndex+3, expression.length), slugIDMap)]
            } else {
                throw `ParseError: Expression uses unknown logic operator '${logOperator}' (${expression})`;
            }
        }
    } else if (expression.charAt(0) == LOGIC_BRACKET_PRECEDENCE_OPEN) {
        let closeIndex = expression.indexOf(LOGIC_BRACKET_PRECEDENCE_CLOSE);
        if (closeIndex == expression.length-1) {
            return recursiveParseCardSelector(expression.slice(1, expression.length-1), slugIDMap);
        } else {
            let logOperator = expression.slice(closeIndex+1, closeIndex+3);
            if (closeIndex+3 == expression.length-1) {
                throw `ParseError: Reached EOS after logic operator - operators must be followed by another logic function (${expression})`;
            }
            if (isLogicOperator(logOperator)) {
                return [recursiveParseCardSelector(expression.slice(1, closeIndex), slugIDMap), logOperator, recursiveParseCardSelector(expression.slice(closeIndex+3, expression.length), slugIDMap)]
            } else {
                throw `ParseError: Expression uses unknown logic operator '${logOperator}' (${expression})`;
            }
        }
    } else {
        throw `Illegal character ${expression.charAt(0)} at start of expression - cardSelector must start with either '[' or '(' `;
    }
}


/**
 * Verifies that all brackets within an expression come in matching pairs with correct nesting.
 * If brackets don't match, an error is thrown.
 * 
 * @throws Bracket Mismatch.
 * 
 * @param expression The expression to be tested for bracket closure.
 * @param failSilent Optional parameter to stop this function from throwing errors if true.
 * @returns True if and only if bracket closure has been verified.
 */
 export function verifyBracketClosure(expression: string, failSilent?: boolean): boolean {
    if (typeof failSilent == 'undefined') failSilent = false;
    let bracketStack: string[] = [];
    for (let i = 0; i < expression.length; i++) {
        let c: string = expression.charAt(i);
        if (LOGIC_BRACKET_MAP.has(c)) {
            let reverse = LOGIC_BRACKET_MAP.get(c);
            if (typeof reverse == 'string') {
                bracketStack.push(reverse);
            }
        } else if (LOGIC_REVERSE_BRACKET_MAP.has(c)) {
            if (c == bracketStack[bracketStack.length-1]) {
                bracketStack.pop();
            } else {
                if (failSilent) return false;
                throw `${expression} bracket mismatch at ${i}: is ${c}, expected ${bracketStack[bracketStack.length-1]}`;
            }
        }
    }
    if (bracketStack.length > 0) {
        if (failSilent) return false;
        throw `${expression} bracket mismatch: could not find closing brackets for ${bracketStack}`;
    }
    return true;
}