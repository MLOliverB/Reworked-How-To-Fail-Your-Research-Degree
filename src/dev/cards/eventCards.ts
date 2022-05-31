import { cardSelector, cardStatement, effect, isInstruction, isLogicOperator, isModifierArray, logicExpression, logicFunction } from "./types";
import { LOGIC_BRACKET_MAP, LOGIC_BRACKET_CARD_CLOSE, LOGIC_BRACKET_CARD_OPEN, LOGIC_BRACKET_PRECEDENCE_OPEN, LOGIC_BRACKET_LOGICEXPRESSION_CLOSE, LOGIC_BRACKET_LOGICEXPRESSION_OPEN, LOGIC_REVERSE_BRACKET_MAP, LOGIC_QUANTIFIER_ALL, LOGIC_BRACKET_PRECEDENCE_CLOSE } from "../constants";


export function parseEffect(effectString: string): effect[] {
    let output: effect[] = [];
    let stringSplit = effectString.split(" ");
    if (stringSplit.length > 0 && stringSplit.length % 2 == 0) {
        for (let i = 0; i < stringSplit.length; i += 2) {
            let instruction = stringSplit[i]
            if (isInstruction(instruction)) {
                output.push([instruction, parseLogicFunction(stringSplit[i+1])]);
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
 * @param expression The string representation of the logic function
 * @returns The array-like logicFunction
 */
export function parseLogicFunction(expression: string): logicFunction {
    verifyBracketClosure(expression);
    return recursiveParseLogicFunction(expression);
}


/**
 * Recursively parses a logic function from it's string representation.
 * This function also verifies the correct structure of the expression and throws an error if this structure is violated.
 * @param expression The string representation of the logic function
 * @returns The array-like logicFunction
 */
function recursiveParseLogicFunction(expression: string): logicFunction {
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
            return [recursiveParseLogicFunction(expression.slice(1, closeIndex)), logOperator, recursiveParseLogicFunction(expression.slice(closeIndex+3, expression.length))];
        } else {
            throw `ParseError: Expression uses unknown logic operator '${logOperator}' (${expression})`;
        }
    } else if (expression.charAt(0) == LOGIC_BRACKET_LOGICEXPRESSION_OPEN) {
        let closeIndex = expression.indexOf(LOGIC_BRACKET_LOGICEXPRESSION_CLOSE);
        if (closeIndex == expression.length-1) {
            return parseLogicExpression(expression);
        } else {
            let logOperator = expression.slice(closeIndex+1, closeIndex+3);
            if (closeIndex+3 == expression.length-1) {
                throw `ParseError: Reached EOS after logic operator - operators must be followed by another logic function (${expression})`;
            }
            if (isLogicOperator(logOperator)) {
                return [parseLogicExpression(expression.slice(0, closeIndex+1)), logOperator, recursiveParseLogicFunction(expression.slice(closeIndex+3, expression.length))];
            } else {
                throw `ParseError: Expression uses unknown logic operator '${logOperator}' (${expression})`;
            }
        }
    } else {
        throw `Illegal character ${expression.charAt(0)} at start of expression - logicFunction must start with either '{' or '(' `;
    }
}


function parseLogicExpression(expression: string): logicExpression {
    if (expression.charAt(0) == LOGIC_BRACKET_LOGICEXPRESSION_OPEN) {
        expression = expression.slice(1, expression.length-1);
    }
    let splitQuant = expression.split('~');
    let quantifier = splitQuant[0];
    expression = splitQuant[1];
    let modifierSplit = 0;
    while (!LOGIC_BRACKET_MAP.has(expression.charAt(modifierSplit))) {
        modifierSplit++;
    }
    let modifiers = expression.slice(0, modifierSplit).split('');
    expression = expression.slice(modifierSplit, expression.length);
    if (isModifierArray(modifiers)) {
        return [quantifier, modifiers, recursiveParseCardSelector(expression)];
    } else {
        throw `ParseError: Expression uses at least one unknown modifier (${modifiers})`;
    }
}


function recursiveParseCardSelector(expression: string): cardSelector {
    if (expression.charAt(0) == LOGIC_BRACKET_CARD_OPEN) {
        let closeIndex = expression.indexOf(LOGIC_BRACKET_CARD_CLOSE);
        if (closeIndex == expression.length-1) {
            return expression.slice(1, expression.length-1);
        } else {
            let logOperator = expression.slice(closeIndex+1, closeIndex+3);
            if (closeIndex+3 == expression.length-1) {
                throw `ParseError: Reached EOS after logic operator - operators must be followed by another logic function (${expression})`;
            }
            if (isLogicOperator(logOperator)) {
                return [recursiveParseCardSelector(expression.slice(0, closeIndex+1)), logOperator, recursiveParseCardSelector(expression.slice(closeIndex+3, expression.length))]
            } else {
                throw `ParseError: Expression uses unknown logic operator '${logOperator}' (${expression})`;
            }
        }
    } else if (expression.charAt(0) == LOGIC_BRACKET_PRECEDENCE_OPEN) {
        let closeIndex = expression.indexOf(LOGIC_BRACKET_PRECEDENCE_CLOSE);
        if (closeIndex == expression.length-1) {
            return recursiveParseCardSelector(expression.slice(1, expression.length-1));
        } else {
            let logOperator = expression.slice(closeIndex+1, closeIndex+3);
            if (closeIndex+3 == expression.length-1) {
                throw `ParseError: Reached EOS after logic operator - operators must be followed by another logic function (${expression})`;
            }
            if (isLogicOperator(logOperator)) {
                return [recursiveParseCardSelector(expression.slice(1, closeIndex)), logOperator, recursiveParseCardSelector(expression.slice(closeIndex+3, expression.length))]
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
 * @param expression The expression to be tested for bracket closure
 * @returns True if and only if bracket closure has been verified
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