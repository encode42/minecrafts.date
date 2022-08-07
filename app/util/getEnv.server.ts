import "dotenv/config";

/**
 * Available environment variables
 */
export interface Env {
    /**
     * URL of the website.
     */
    "WEBSITE_URL": string,

    /**
     * Secret to use to encrypt cookies.
     */
    "COOKIE_AUTH_SECRET": string,
}

/**
 * Get a key from the process env
 *
 * @param key Key to get
 */
export function getEnv<T extends keyof Env>(key: T): Env[T] | undefined;

/**
 * Get a key from the process env
 *
 * @param key Key to get
 * @param def Default value if not set
 */
export function getEnv<T extends keyof Env>(key: T, def: Env[T]): Env[T];

/**
 * Get a key from the process env
 *
 * @param key Key to get
 * @param def Default value if not set
 * @param parse Function used to parse values
 */
export function getEnv<T extends keyof Env>(key: T, def: Env[T], parse?: (value: string | undefined) => Env[T]): Env[T];

/**
 * Get a key from the process env
 *
 * @param key Key to get
 * @param def Default value if not set
 * @param parse Function used to parse values
 */
export function getEnv<T extends keyof Env>(key: T, def?: Env[T], parse?: (value: string | undefined) => Env[T]): Env[T] | undefined {
    let value = process.env[key];

    if (parse) {
        value = parse(value);
    }

    return value ?? def;
}
