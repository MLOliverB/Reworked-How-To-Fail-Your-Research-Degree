import { BRACKET_MAP, REVERSE_BRACKET_MAP } from "../src/const";


/**
 * Verifies that all brackets within an expression come in matching pairs with correct nesting.
 * If brackets don't match, an error is thrown.
 * @param expression The expression to be tested for bracket closure
 */
function verifyBracketClosure(expression: string) {
    let bracketStack: string[] = [];
    for (let i = 0; i < expression.length; i++) {
        let c: string = expression.charAt(i);
        if (BRACKET_MAP.has(c)) {
            let reverse = BRACKET_MAP.get(c);
            if (typeof reverse == 'string') {
                bracketStack.push(reverse);
            }
        } else if (REVERSE_BRACKET_MAP.has(c)) {
            if (c == bracketStack[bracketStack.length-1]) {
                bracketStack.pop();
            } else {
                throw `${expression} bracket mismatch at ${i}: is ${c}, expected ${bracketStack[bracketStack.length-1]}`;
            }
        }
    }
    if (bracketStack.length > 0) {
        throw `${expression} bracket mismatch: could not find closing brackets for ${bracketStack}`;
    }
}

function recursiveParseLogicFunction(expression: string): any {
    let output = [];
    while (expression.length > 0) {
        if (expression.charAt(0) == "{") {
            let splitStatement = [];
            let i = 0;
            while (i < expression.length && expression.charAt(i) != "}") {
                i++;
            }
            splitStatement.push(expression.slice(0, i+1));
            expression = expression.slice(i+1);
            i = 0;
            while (!BRACKET_MAP.has(expression.charAt(i))) {
                i++;
            }
            if (i > 0) {
                splitStatement.push(expression.slice(0, i));
                expression = expression.slice(i);
            } else {
                splitStatement.push('');
            }
            let bracketStack = [BRACKET_MAP.get(expression.charAt(0)), ];
            i = 1;
            while (bracketStack.length > 0) {
                let c: string = expression.charAt(i)
                if (BRACKET_MAP.has(c)) {
                    bracketStack.push(BRACKET_MAP.get(c));
                } else if (c == bracketStack[bracketStack.length-1]) {
                    bracketStack.pop();
                }
                i++;
            }
            splitStatement.push(recursiveParseLogicFunction(expression.slice(0, i)));
            expression = expression.slice(i);
            output.push(splitStatement);
        } else if (expression.charAt(0) == "(") {
            let bracketStack = [BRACKET_MAP.get(expression.charAt(0)), ];
            let i = 1;
            while (bracketStack.length > 0) {
                let c: string = expression.charAt(i)
                if (BRACKET_MAP.has(c)) {
                    bracketStack.push(BRACKET_MAP.get(c));
                } else if (c == bracketStack[bracketStack.length-1]) {
                    bracketStack.pop();
                }
                i++;
            }
            output.push(recursiveParseLogicFunction(expression.slice(1, i-1)));
            expression = expression.slice(i);
        } else if (expression.charAt(0) == "[") {
            let i = 0;
            while (expression.charAt(i) != "]") {
                i++;
            }
            output.push(expression.slice(0, i+1));
            expression = expression.slice(i+1);
        } else {
            let i = 0;
            while (i < expression.length && !BRACKET_MAP.has(expression.charAt(i))) {
                i++;
            }
            output.push(expression.slice(0, i));
            expression = expression.slice(i);
        }
    }
    if (output.length == 1) {
        return output[0];
    } else {
        return output;
    }
}

function parseLogicFunction(logicFunction: string, cardSlugs: string[], cardGroups: any[]) {
    let output: any[] = [];
    let bracketStack: string[] = [];

    let i = 0;
    let s: string = "";
    while (i < logicFunction.length) {
        let c: string = logicFunction.charAt(i);
        if (c == "{") {                             // This indicates the start of one 'segment'

            
            if (s != "") {                          // Capture any logic operators between segments
                output.push(s);
                s = "";
            }

            let segment = [];
            s += c;                                 // c = "{"

            i++;
            c = logicFunction.charAt(i);
            while (c != "}") {                      // While the number quantifier didn't close
                s += c;
                i++;
                c = logicFunction.charAt(i);
            }
            s += c;                                 // c = "}"
            segment.push(s);                        // First entry is the number quantifier

            s = "";
            i++;
            c = logicFunction.charAt(i);
            while (["!", "^"].includes(c)) {        // While there are modifiers
                s += c;
                i++;
                c = logicFunction.charAt(i);
            }
            segment.push(s);

            s = c;
            {
                let reverse = BRACKET_MAP.get(c);
                if (typeof reverse == 'string') {
                    bracketStack.push(reverse);
                }
            }
            i++;
            c = logicFunction.charAt(i);
            while (bracketStack.length > 0) {
                if (BRACKET_MAP.has(c)) {
                    let reverse = BRACKET_MAP.get(c);
                    if (typeof reverse == 'string') {
                        bracketStack.push(reverse);
                    }
                } else if (bracketStack[bracketStack.length-1] == c) {
                    bracketStack.pop();
                }
                s += c;
                i++;
                c = logicFunction.charAt(i);
            }

            if (s.indexOf("(") == -1) {
                segment.push(s);
            } else {
                segment.push(recursiveSplit(s));
            }
            s = "";
            output.push(segment);
        } else {
            s += c;
            i++;
        }
    }
    if (s != "") {
        output.push(s);
        s = "";
    }
    return output;
}

function recursiveSplit(expression: string): string | string[] {
    console.log(expression);
    console.log(expression.indexOf("("));
    if (expression.indexOf("(") == -1) {
        return expression;
    } else if (expression.indexOf("(") == 0) {
        if (expression.charAt(expression.length-1) != ")") {
            console.log("something went incredibly wrong");
            return "";
        }
        expression = expression.slice(1, expression.length-1);
        let output: any[] = [];
        let bracketStack: string[] = [];
        let i = 0;
        let s = "";
        while (i < expression.length) {
            let c: string = expression.charAt(i);
            if (bracketStack.length == 0 && i > 0 && i < expression.length-1) {
                output.push(recursiveSplit(s));
                s = "";
            } else if (BRACKET_MAP.has(c)) {
                let reverse = BRACKET_MAP.get(c);
                if (typeof reverse == 'string') {
                    bracketStack.push(reverse);
                }
            } else if (bracketStack[bracketStack.length-1] == c) {
                bracketStack.pop();
            }
            s += c;
            i++;
        }
        console.log(s);
        if (s != "") {
            output.push(recursiveSplit(s));
        }
        return output;
    } else {
        console.log("something went incredibly wrong");
        return "";
    }
}

let s = "{1}[act-CONTEXT-veryrelarticle]&&{1}![act-CONTEXT-veryrelmethod]&&{1}([act-CONTEXT-refine]||[act-WRITEUP-revisit])"
verifyBracketClosure(s);
let result = recursiveParseLogicFunction(s);
console.log(result);
