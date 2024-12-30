import { CognitoUserSession } from "amazon-cognito-identity-js";
import { Nullable, SessionData } from "../types";

export function createSessionData(
  session: CognitoUserSession,
  userId: Nullable<string>
): SessionData {
  const data = {
    id: userId,
    cognito: {
      IdToken: session.getIdToken(),
      AccessToken: session.getAccessToken(),
      RefreshToken: session.getRefreshToken(),
    },
    sessionToken: session.getAccessToken().getJwtToken(),
    user_email: session.getIdToken().payload.email as string,
    exp: session?.getIdToken().payload.exp,
  };
  return {
    ...data,
    toJson: () => JSON.stringify(data),
  } as SessionData;
}
