import {
	AuthenticationDetails,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserSession,
} from "amazon-cognito-identity-js";
import { create } from "zustand";
import { AppContext, Nullable, SessionData, User, UserSession } from "../types";
import { createSessionData } from "../utils";
import { UserAccount } from "./useAccount";

export type Auth = {
    user: Nullable<User>;
    session: Nullable<CognitoUserSession>;
    signin: (
        ctx: AppContext,
        email: string,
        password: string
    ) => Promise<UserSession>;
    signout: (ctx: AppContext) => Promise<void>;
    signup: (ctx: AppContext, email: string, password: string) => Promise<User>;
    loadSession: (ctx: AppContext) => Promise<Nullable<UserSession>>;
    refreshSession: (ctx: AppContext) => Promise<void>;
    updatePassword: (
        ctx: AppContext,
        oldPassword: string,
        password: string
    ) => Promise<void>;
    verifyPassword: (
        ctx: AppContext,
        email: string,
        password: string
    ) => Promise<boolean>;
    beginPasswordReset: (ctx: AppContext, email: string) => Promise<any>;
    confirmResetPassword: (
        ctx: AppContext,
        email: string,
        code: string,
        password: string
    ) => Promise<void>;
};

export const useAuth = create<Auth>((set, get) => ({
    user: null,
    session: null,
    signin: async (ctx: AppContext, email: string, password: string) => {
        const state = get();

        const user = new CognitoUser({
            Username: email,
            Pool: ctx.config.aws.pool,
        });
        //This sends the password as plain text to Cognito and is needed due to Prod Cognito Migration. Can be removed when prod migration is finished.
        user.setAuthenticationFlowType("USER_PASSWORD_AUTH");

        const authentication = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        const data = await new Promise<UserSession>((resolve, reject) => {
            user.authenticateUser(authentication, {
                onSuccess: async (session) => {
                    const account = UserAccount(
                        ctx,
                        ctx.config.aws.pool,
                        session
                    );
                    const user = await account.getUser();
                    state.user = user;
                    state.session = session;
                    ctx.config.storage.set(
                        "session",
                        createSessionData(session, user.id)
                    );
                    resolve({ user, session });
                    // TODO: Set AWS Logins
                },
                onFailure: (error) => reject(error),
                newPasswordRequired: (userAttributes, requiredAttributes) => {
                    // TODO: Handle new password required
                },
            });
        });

        set({ user: data.user, session: data.session });

        return data;
    },
    signout: async (ctx: AppContext) => {
        set({ user: null, session: null });

        const user = ctx.config.aws.pool.getCurrentUser();
        if (!user) return;

        ctx.config.storage.delete("session");

        await new Promise<void>((resolve) => user.signOut(resolve));
    },

    signup: async (ctx: AppContext, email: string, password: string) => {
        const attributes = [
            new CognitoUserAttribute({
                Name: "custom:active",
                Value: "true",
            }),
            new CognitoUserAttribute({
                Name: "custom:deactivatedDate",
                Value: "null",
            }),
        ];

        return await new Promise<User>((resolve, reject) => {
            ctx.config.aws.pool.signUp(
                email,
                password,
                attributes,
                [],
                (error) => {
                    if (error) {
                        const { code } = error as any;

                        switch (code as SignupErrorCode) {
                            case SignupErrorCode.Invalid:
                                const message =
                                    "Password invalid. Must contain: At least 8 characters, at least one uppercase character, at least one lowercase character, at least one number, at least one special character (<!?@#$%^&*>)";
                                reject({ message });
                                break;
                            case SignupErrorCode.AlreadyExists:
                                reject({ message: "User already exists." });
                                break;
                            default:
                                reject({
                                    message: "Unknown error, please try again.",
                                });
                        }
                    } else {
                        UserAccount(ctx, ctx.config.aws.pool)
                            .createUser(email)
                            .then(resolve);
                    }
                }
            );
        });
    },

    loadSession: async (ctx: AppContext) => {
        const sessionData = await ctx.config.storage.get<SessionData>(
            "session"
        );
        if (!sessionData) return null;
    },

    refreshSession: async (ctx: AppContext) => {},

    updatePassword: async (
        ctx: AppContext,
        oldPassword: string,
        password: string
    ) => {
        const state = get();
        if (!state.session || !state.user) return;

        const authentication = new AuthenticationDetails({
            Username: state.user.email,
            Password: oldPassword,
        });

        const user = new CognitoUser({
            Username: state.user.email,
            Pool: ctx.config.aws.pool,
        });

        await new Promise<void>((resolve, reject) => {
            user.authenticateUser(authentication, {
                onSuccess: () => resolve(),
                onFailure: (error) => reject(error),
            });
        });

        await new Promise<void>((resolve, reject) => {
            user.changePassword(oldPassword, password, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    },

    verifyPassword: async (
        ctx: AppContext,
        email: string,
        password: string
    ) => {
        const user = new CognitoUser({
            Username: email,
            Pool: ctx.config.aws.pool,
        });
        const authentication = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        return await new Promise<boolean>((resolve) => {
            user.authenticateUser(authentication, {
                onSuccess: () => resolve(true),
                onFailure: () => resolve(false),
            });
        });
    },

    beginPasswordReset: async (ctx: AppContext, email: string) => {
        const user = new CognitoUser({
            Username: email,
            Pool: ctx.config.aws.pool,
        });

        await new Promise<any>((resolve, reject) => {
            user.forgotPassword({
                onSuccess: (data) => resolve(data),
                onFailure: (error) => reject(error),
                inputVerificationCode: (data) => resolve(data),
            });
        });
    },

    confirmResetPassword: async (
        ctx: AppContext,
        email: string,
        code: string,
        password: string
    ) => {
        const user = new CognitoUser({
            Username: email,
            Pool: ctx.config.aws.pool,
        });

        await new Promise<void>((resolve, reject) => {
            user.confirmPassword(code, password, {
                onSuccess: () => resolve(),
                onFailure: (error) => reject(error),
            });
        });
    },
}));

enum SignupErrorCode {
    Invalid = "InvalidPasswordException",
    AlreadyExists = "UsernameExistsException",
}
