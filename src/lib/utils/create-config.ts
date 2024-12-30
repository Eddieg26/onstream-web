import { CognitoUserPool } from "amazon-cognito-identity-js";
import { Config, Environment, Nullable } from "../types";

export function createConfig(config: Partial<Config>): Config {
    const userPoolId = process.env["NEXT_PUBLIC_COGNITO_USER_POOL_ID"] ?? "";
    const clientId = process.env["NEXT_PUBLIC_COGNITO_CLIENT_ID"] ?? "";

    return {
        env:
            config.env ??
            (process.env["NEXT_PUBLIC_ENV"] as Environment) ??
            "development",
        platform: config.platform ?? "browser",
        version:
            config.version ?? process.env["NEXT_PUBLIC_VERSION"] ?? "0.0.0",
        apiUrl: config.apiUrl ?? process.env["NEXT_PUBLIC_ONSTREAM_API"] ?? "",
        cmpApiUrl: config.cmpApiUrl ?? process.env["NEXT_PUBLIC_CMP_API"] ?? "",
        cosmosApiUrl:
            config.cosmosApiUrl ?? process.env["NEXT_PUBLIC_COSMOS_API"] ?? "",
        aws: config.aws ?? {
            cognito: {
                userPoolId: userPoolId,
                clientId: clientId,
                identityPoolId:
                    process.env["NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID"] ?? "",
            },
            region: process.env["NEXT_PUBLIC_AWS_REGION"] ?? "",
            pool: new CognitoUserPool({
                UserPoolId: userPoolId,
                ClientId: clientId,
            }),
        },
        storage: {
            get: async <T>(key: string) => {
                const value = localStorage.getItem(key);
                return value ? (JSON.parse(value) as T) : null;
            },
            set: async <T>(key: string, value: T) =>
                localStorage.setItem(key, JSON.stringify(value)),
            delete: async (key: string) => localStorage.removeItem(key),
            clear: async () => localStorage.clear(),
        },
        newRelic: {
            setCustomAttribute: (key: string, value: Nullable<string>) => {},
        },
    };
}

export function env<T extends string | number | boolean>(
    key: string,
    defaultValue: T
): T {
    const value = process.env[key];
    if (value === undefined) {
        return defaultValue;
    }
    return value as T;
}
