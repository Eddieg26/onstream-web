import {
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ICognitoUserAttributeData,
} from "amazon-cognito-identity-js";
import { Account, AppContext, Nullable, User } from "../types";
import { createSessionData } from "../utils";
import { useAuth } from "./useAuth";
import { useOnstream } from "./useOnstream";

export const UserAccount = (
    ctx: AppContext,
    pool: CognitoUserPool,
    session?: CognitoUserSession
) => {
    async function getUser() {
        const url = `${ctx.config.apiUrl}/api/users`;
        const response = await ctx.api.get<{ result: Account }>(
            url,
            getSessionOptions()
        );

        const attributes = await getAttributes();
        const isActive = attributes.some(
            (attr) => attr.Name === "custom:active" && attr.Value === "true"
        );
        const lastLogin = session
            ? new Date(session.getAccessToken().getIssuedAt() * 1000)
            : new Date();

        return {
            ...response.result,
            active: isActive,
            attributes,
            lastLogin,
        } as User;
    }

    async function createUser(email: string) {
        const url = `${ctx.config.apiUrl}/api/users`;
        const response = await ctx.api.post<{ result: Account }>(url, {
            email,
        });
        const attributes = await getAttributes();
        const lastLogin = session
            ? new Date(session.getAccessToken().getIssuedAt() * 1000)
            : new Date();

        return {
            ...response.result,
            active: true,
            attributes,
            lastLogin,
        } as User;
    }

    async function isActive() {
        const attributes =
            (await getAttributes()) ?? new Array<CognitoUserAttribute>();

        return attributes.some(
            (attribute) =>
                attribute.Name === "custom:active" && attribute.Value === "true"
        );
    }

    async function activate() {
        await updateAttributes([
            { Name: "custom:active", Value: "true" },
            { Name: "custom:deactivatedDate", Value: "null" },
        ]);
    }

    async function deactivate() {
        await updateAttributes([
            { Name: "custom:active", Value: "false" },
            { Name: "custom:deactivatedDate", Value: Date.now().toString() },
        ]);
    }

    async function deleteUser() {
        const deleteCognito = new Promise<void>((resolve, reject) => {
            const user = pool.getCurrentUser();

            user?.deleteUser((error) => {
                error ? reject(error) : resolve();
            });
        });

        const url = `${ctx.config.apiUrl}/api/users/delete`;
        const deleteMongo = ctx.api.post<{ result: User }>(
            url,
            getSessionOptions()
        );

        Promise.all([deleteCognito, deleteMongo]);
    }

    async function getAttributes() {
        return new Promise<CognitoUserAttribute[]>((resolve, reject) => {
            const user = pool.getCurrentUser();
            if (!user) return resolve(new Array<CognitoUserAttribute>());

            user.getUserAttributes((error, attributes) => {
                error ? reject(error) : resolve(attributes ?? []);
            });
        });
    }

    async function updateAttributes(attributes: ICognitoUserAttributeData[]) {
        await new Promise<void>((resolve, reject) => {
            const user = pool.getCurrentUser();
            if (!user) return reject(new Error("No user found"));

            user.updateAttributes(attributes, (error) => {
                error ? reject(error) : resolve();
            });
        });
    }

    async function getParentalControls() {}
    async function updateParentalControls() {}
    async function updatePin() {}
    async function validatePin() {}

    function getSessionOptions(userId: Nullable<string> = null) {
        return {
            headers: {
                session: session
                    ? createSessionData(session, userId).toJson()
                    : "",
            },
        };
    }

    return {
        getUser,
        createUser,
        isActive,
        activate,
        deactivate,
        deleteUser,
        getAttributes,
        updateAttributes,
        getParentalControls,
        updateParentalControls,
        updatePin,
        validatePin,
    };
};

export function useAccount() {
    const { context } = useOnstream();
    const auth = useAuth();

    return {
        ...UserAccount(context, auth.pool),
    };
}
