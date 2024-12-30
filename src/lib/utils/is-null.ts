import { Nullable } from "../types";

export function isNull<T>(value: Nullable<T>): value is null {
    return value === null || value === undefined;
}

export function notNull<T>(value: Nullable<T>): T {
    return value as T;
}
