export function convertToSnakeCase(str: string): string {
    if (isSnakeCase(str)) {
        return str;
    }
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function isSnakeCase(str: string): boolean {
    const snakeCaseRegex = /^[a-z0-9]+(_[a-z0-9]+)*$/;
    return snakeCaseRegex.test(str);
}

export function isDefaultRustKeyword(str: string): boolean {
    return RUST_KEYWORDS.has(str);
}

/**
 * Judge the str is number
 * @param str 
 * @returns 
 */
export function isDigit(str: string): boolean {
    return typeof str === 'number'
}

export function hashCode(value: any): number {
    let hash = 0;
    if (typeof value == 'string') {
        for (let i = 0; i < value.length; i++) {
            hash = value.charCodeAt(i) + ((hash << 5) - hash);
        }
    } else if (typeof value == 'number') {
        for (let i = 0; i < value.toString().length; i++) {
            hash = value.toString().charCodeAt(i) + ((hash << 5) - hash);
        }
    } else if (typeof value == 'object') {
        let str = JSON.stringify(value);
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
    } else if (typeof value == 'boolean') {
        for (let i = 0; i < value.toString().length; i++) {
            hash = value.toString().charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    return hash;
}