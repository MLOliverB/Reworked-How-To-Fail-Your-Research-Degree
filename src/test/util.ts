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
export function verifyCharacters(str: string, charSet: string[] | RegExp, failSilent?: boolean): boolean {
    if (typeof failSilent == 'undefined') failSilent = false;
    if (charSet instanceof RegExp) {
        for (let i = 0; i < str.length; i++) {
            let c = str.charAt(i);
            if (c.search(charSet) == -1) {
                if (failSilent) return false;
                throw `Detected illegal character ${c} at position ${i} in string ${str}`;
            }
        }
    } else {
        for (let i = 0; i < str.length; i++) {
            let c = str.charAt(i);
            if (!charSet.includes(c)) {
                if (failSilent) return false;
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


export function recursiveExpandNestedArray(arr: any) {
    if (Array.isArray(arr)) {
        let arrLength = arr.length;
        let str = "[ ";
        arr.forEach(function(currentValue: any, index: number, arr: any[]) {
            str += `${recursiveExpandNestedArray(currentValue)}`
            if (index < arrLength-1) {
                str += ", ";
            }
        });
        return str + " ]";
    } else {
        return arr;
    }
}