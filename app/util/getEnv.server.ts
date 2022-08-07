import "dotenv/config";

/**
 * Get a key from the process env
 *
 * @param key Key to get
 * @param def Default value if not set
 */
export function getEnv(key: string, def?: string) {
    return process.env[key] ?? def;
}
