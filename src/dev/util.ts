export function openExternalLink(url: string) {
    var s = window.open(url, '_blank');

    if (s && s.focus) {
        s.focus();
    }
    else if (!s) {
        window.location.href = url;
    }
}


export function mapGetOrElse<K, V>(map: Map<K, V>, getValue: K, defaultValue: V): V {
    if (map.has(getValue)) {
        let val = map.get(getValue);
        if (val != undefined) {
            return val;
        } else {
            return defaultValue;
        }
    } else {
        return defaultValue;
    }
}

/**
 * Reference: Function code based on 'Fisher-Yates shuffle' taken from https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
 * Shuffles the given array in place. This changes the original array.
 * 
 * @param arr The array to be shuffled
 */
export function shuffleArray(arr: any[]) {
    let pos = arr.length;

    while (pos > 0) {
        // Find a random index 0 <= randPos < pos
        let randPos = Math.floor(Math.random() * pos);
        pos -= 1;

        // Swap positions of the two indexes
        let tmp = arr[pos];
        arr[pos] = arr[randPos];
        arr[randPos] = tmp;
    }
}


export class SelfReplenishingStack<T> {
    refillFunction: Function;
    shuffleElements: boolean;
    popCounter: number;

    stack: T[];
    stackSize: number;

    constructor (refillFunction: () => T[], shuffleElements: boolean) {
        this.refillFunction = refillFunction;
        this.shuffleElements = shuffleElements;
        this.popCounter = 0;

        this.stack = this.refillFunction().slice();
        this.stackSize = this.stack.length;
        if (this.shuffleElements) shuffleArray(this.stack);
    }

    pop(): T {
        if (this.stackSize == 0) this._refill();
        if (this.stackSize == 0) throw `Could not populate the stack with new elements`;
        let val = this.stack.pop();
        this.stackSize -= 1;
        if (this.stackSize == 0) this._refill();
        if (val != undefined) {
            this.popCounter++;
            return val;
        } else {
            throw `Fatal Error: stack size variable and actual stack size are not synced`;
        }
    }

    clear() {
        this.stack.splice(0, this.stackSize);
        this.stackSize = 0;
        this.popCounter = 0;
    }

    _refill() {
        this.stack = this.refillFunction().slice();
        this.stackSize = this.stack.length;
        if (this.shuffleElements) shuffleArray(this.stack);
    }
}


export class BidirectionalArray<T> {
    posArr: T[];
    negArr: T[];

    posSize: number;
    negSize: number;

    constructor() {
        this.posArr = [];
        this.negArr = [];

        this.posSize = 0;
        this.negSize = 0;
    }

    length(): number {
        return this.posSize + this.negSize;
    }

    rightLength(): number {
        return this.posSize;
    }

    leftLength(): number {
        return this.negSize;
    }

    leftIndex(): number {
        return -this.negSize;
    }

    rightIndex(): number {
        return this.posSize-1;
    }

    set(index: number, element: T) {
        if (index >= 0) {
            this.posArr[index] = element;
        } else {
            this.negArr[-index-1] = element;
        }
    }

    get(index: number): T {
        if (index >= 0) {
            return this.posArr[index];
        } else {
            return this.negArr[-index-1];
        }
    }

    pushRight(element: T): number {
        this.posSize = this.posArr.push(element);
        return this.length();
    }

    pushLeft(element: T): number {
        this.negSize = this.negArr.push(element);
        return this.length();
    }

    getIndexes() {
        let indexArray: number[] = [];
        for (let i = -this.leftLength(); i < 0; i++) {
            indexArray.push(i);
        }
        for (let i = 0; i < this.rightLength(); i++) {
            indexArray.push(i);
        }
        return indexArray;
    }

    normalize(paddingLeft?: number, paddingRight?: number): (T | null)[] {
        if (paddingLeft == undefined) paddingLeft = 0;
        if (paddingRight == undefined) paddingRight = 0;
        let normArr: (T | null)[] = this.negArr.slice().reverse().concat(this.posArr);
        paddingLeft -= this.negSize;
        while (paddingLeft > 0) {
            normArr.unshift(null);
            paddingLeft--;
        }
        paddingRight -= this.posSize;
        while (paddingRight > 0) {
            normArr.push(null);
            paddingRight--;
        }
        return normArr;
    }

    toString(): string {
        let str = "[ ";
        this.negArr.slice().reverse().concat(this.posArr).forEach((val) => {
            // @ts-ignore
            if (typeof val.toString == 'function') {
                // @ts-ignore
                str += `${val.toString()}, `;
            } else {
                str += `${val}, `;
            }
            
        });
        return str + " ]";
    }
}



export class UncheckedMap<K, V> extends Map<K, V> {
    constructor() {
        super();
    }

    get(key: K, fallback?: V): V {
        let value = super.get(key);
        if (value == undefined) {
            if (fallback == undefined) {
                throw `KeyError: "${key}" does not map to a value`;
            } else {
                return fallback;
            }
        } else {
            return value;
        }
    }
}