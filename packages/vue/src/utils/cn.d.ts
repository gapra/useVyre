/**
 * useVyre — className utility (Vue)
 * Lightweight zero-dependency class name joiner.
 */
type ClassValue = string | undefined | null | false | Record<string, boolean | undefined | null> | ClassValue[];
export declare function cn(...inputs: ClassValue[]): string;
export {};
