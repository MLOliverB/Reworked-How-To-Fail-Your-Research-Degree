/**
 * 
 * @param str The string to be checked for non-ascii characters.
 * @returns The number of non-ascii characters in the string.
 */
function countNonAscii(str: string): number {
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
function showNonAscii(str: string): string {
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
 * Finds duplicate elements in an array. It only ever detects the first duplicate encountered. There is no guarantee that there a no further duplicates.
 * @param items Array of any type to be checked for duplicates.
 * @returns The duplicate that was first encountered if a duplicate is found, null otherwise.
 */
function hasDuplicates(items: any[]): any {
    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            if (items[i] == items[j]) {
                return items[i];
            }
        }
    }
    return null;
}


function countOccurences<Type>(item: Type, arr: Type[]): number {
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
            counter++;
        }
    }
    return counter;
}

export { countNonAscii, showNonAscii, hasDuplicates, countOccurences };