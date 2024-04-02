import { Env } from "./env";

export interface EmbedResponse {
  url: string;
  author_name: string;
  author_url: string;
  html: string;
  width: number;
  height: any;
  type: string;
  cache_age: string;
  provider_name: string;
  provider_url: string;
  version: string;
}

const TWITTER_V2_API_URL = "https://api.twitter.com/2";

type EmbedFn<A extends Record<string, any>, R> = (arg: A) => Promise<R>;

export const tweetEmbed: EmbedFn<{ tweetUrl: string }, EmbedResponse> = async ({
  tweetUrl,
}) => {
  const EMBED_SERVICE_URL = "https://publish.twitter.com/oembed";

  const response = await fetch(
    `${EMBED_SERVICE_URL}?url=${tweetUrl}&hide_thread=true`,
  );

  const json = (await response.json()) as EmbedResponse;

  console.log(json, ":::Making all this mean something...");

  return json;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TwitterAuth {
  interface ExchangeTokenInput {
    code: string;
    redirectUrl: string;
    codeVerifier: string; // The challenge cerated for the code
    clientId: string;
  }
  export const exchangeCodeForToken = async ({
    code,
    redirectUrl,
    codeVerifier,
    clientId,
  }: ExchangeTokenInput): Promise<Record<string, any>> => {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", redirectUrl);
    formData.append("code_verifier", codeVerifier);
    formData.append("client_id", clientId);

    const options = {
      method: "POST",
      body: formData,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic`,
      },
    };

    try {
      const response = await fetch(
        `${TWITTER_V2_API_URL}/oauth2/token`,
        options,
      );

      const json = (await response.json()) as Record<string, any>;

      return json;
    } catch (err: any) {
      console.log(err, ":::Error for oauth2 token");
      throw new Error(err);
    }
  };

  interface RefreshTokenInput {
    refreshToken: string;
    redirectUrl: string;
    clientId: string;
  }
  export const refreshToken = async ({
    refreshToken,
    // clientId,
  }: RefreshTokenInput): Promise<Record<string, any>> => {
    try {
      const formData = new FormData();
      // formData.append("code", code);
      formData.append("grant_type", "refresh_token");
      formData.append("refresh_token", refreshToken);

      const options = {
        method: "POST",
        body: formData,
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Env.TWITTER_CLIENT_ID}`,
        },
      };

      const response = await fetch(
        `${TWITTER_V2_API_URL}/oauth2/token`,
        options,
      );
      const json = (await response.json()) as Record<string, any>;
      return json;
    } catch (err: any) {
      console.log(err, ":::Error for refresh token");
      throw new Error(err);
    }
  };

  interface RevokeTokenInput {
    clientId: string;
    token: string;
  }
  export const revokeToken = async ({
    clientId,
    token,
  }: RevokeTokenInput): Promise<Record<string, any>> => {
    try {
      const formData = new FormData();
      // formData.append("code", code);
      formData.append("token", token);
      formData.append("client_id", clientId);

      const options = {
        method: "POST",
        body: formData,
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Env.TWITTER_CLIENT_ID}`,
        },
      };

      const response = await fetch(
        `${TWITTER_V2_API_URL}/oauth2/revoke`,
        options,
      );
      const json = (await response.json()) as Record<string, any>;

      return json;
    } catch (err: any) {
      console.log(err, "::: Error in revoke");
      throw new Error(err);
    }
  };
}
