import { BRACKET_MAP, REVERSE_BRACKET_MAP } from "../dev/constants";

/**
 * 
 * @param str The string to be checked for non-ascii characters.
 * @returns The number of non-ascii characters in the string.
 */
export function countNonAscii(str: string): number {
    let counter = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127) {
            counter++;
        }
    }
    return counter;
}


/**
 * Generates a three-line string with the original string in the center and arrows at the top and bottom lines indicating the positions of non-ascii characters.
 * @param str The string to be checked for non-ascii characters.
 * @returns A three-line string showing the positions of non-ascii characters.
 */
export function showNonAscii(str: string): string {
    let topLine = "";
    let bottomLine = "";
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127) {
            topLine = topLine + "v";
            bottomLine = bottomLine + "^";
        } else {
            topLine = topLine + "-";
            bottomLine = bottomLine + "-";
        }
    }
    return "\n" + topLine + "\n" + str + "\n" + bottomLine;
}

/**
 * Verifies that the given string contains only the characters specified in charSet
 * @param str The string to be checked
 * @param charSet Array of single character strings specifiying the allowed characters or a regular expression to which single allowe characters will match
 * @returns True if and only if all characters in the string are allowed
 */
export function verifyCharacters(str: string, charSet: string[] | RegExp): boolean {
    if (charSet instanceof RegExp) {
        for (let i = 0; i < str.length; i++) {
            let c = str.charAt(i);
            if (c.search(charSet) == -1) {
                throw `Detected illegal character ${c} at position ${i} in string ${str}`;
            }
        }
    } else {
        for (let i = 0; i < str.length; i++) {
            let c = str.charAt(i);
            if (!charSet.includes(c)) {
                throw `Detected illegal character ${c} at position ${i} in string ${str}`;
            }
        }
    }
    return true;
}


/**
 * Finds duplicate elements in an array. It only ever detects the first duplicate encountered. There is no guarantee that there a no further duplicates.
 * @param items Array of any type to be checked for duplicates.
 * @returns The duplicate that was first encountered if a duplicate is found, null otherwise.
 */
export function hasDuplicates(items: any[]): any {
    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            if (items[i] == items[j]) {
                return items[i];
            }
        }
    }
    return null;
}


export function countOccurences<Type>(item: Type, arr: Type[]): number {
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
            counter++;
        }
    }
    return counter;
}


/**
 * Verifies that all brackets within an expression come in matching pairs with correct nesting.
 * If brackets don't match, an error is thrown.
 * @param expression The expression to be tested for bracket closure
 * @returns True if and only if bracket closure has been verified
 */
 export function verifyBracketClosure(expression: string): boolean {
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
    return true;
}