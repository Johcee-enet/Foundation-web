import { Base64 } from "./appUtils";
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
  const basicAuthString = Base64.btoa(
    `${Env.TWITTER_CLIENT_ID}:${Env.TWITTER_CLIENT_SECRET}`,
  );
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
    const formData = new URLSearchParams();
    formData.append("code", code);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", redirectUrl);
    formData.append("code_verifier", codeVerifier);
    formData.append("client_id", clientId);

    const urlEncodedFormData = formData.toString();

    const options = {
      method: "POST",
      body: urlEncodedFormData,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuthString}`,
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
    clientId,
  }: RefreshTokenInput): Promise<Record<string, any>> => {
    try {
      const formData = new URLSearchParams();
      // formData.append("code", code);
      formData.append("grant_type", "refresh_token");
      formData.append("refresh_token", refreshToken);
      formData.append("client_id", clientId);

      const urlEncodedFormData = formData.toString();

      const options = {
        method: "POST",
        body: urlEncodedFormData,
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuthString}`,
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
      const formData = new URLSearchParams();
      // formData.append("code", code);
      formData.append("token", token);
      formData.append("client_id", clientId);
      const urlEncodedFormData = formData.toString();
      const options = {
        method: "POST",
        body: urlEncodedFormData,
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuthString}`,
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

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Twitter {
  interface UserDataInput {
    token: string;
  }
  export const userData = async ({
    token,
  }: UserDataInput): Promise<Record<string, any>> => {
    try {
      const options = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`${TWITTER_V2_API_URL}/users/me`, options);
      const json = (await response.json()) as Record<string, any>;

      return json;
    } catch (err: any) {
      console.log(err, ":::Error in usreData");
      throw new Error(err);
    }
  };

  interface UserLookupInput {
    token: string;
    userId?: string;
    userName?: string;
  }
  export const userLookup = async ({
    token,
    userId,
    userName,
  }: UserLookupInput): Promise<Record<string, any>> => {
    try {
      const options = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = userId
        ? await fetch(`${TWITTER_V2_API_URL}/users/${userId}`, options)
        : await fetch(
            `${TWITTER_V2_API_URL}/users/by/username/${userName}`,
            options,
          );
      const json = (await response.json()) as Record<string, any>;

      return json;
    } catch (err: any) {
      console.log(err, ":::Error in usreData");
      throw new Error(err);
    }
  };

  export const follow = async ({
    token,
    profileId,
  }: {
    token: string;
    profileId: string;
  }) => {
    try {
      const options = {
        headers: {
          method: "POST",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `${TWITTER_V2_API_URL}/users/${profileId}/following`,
        options,
      );
      const json = (await response.json()) as Record<string, any>;

      return json;
    } catch (err: any) {
      console.log(err, ":::Error in follow API");
      throw new Error(err);
    }
  };

  export const like = async ({
    token,
    userTwitterId,
    tweetId,
  }: {
    token: string;
    userTwitterId: string;
    tweetId: string;
  }) => {
    try {
      const options = {
        headers: {
          method: "POST",
          body: JSON.stringify({
            tweet_id: tweetId,
          }),
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `${TWITTER_V2_API_URL}/users/${userTwitterId}/likes`,
        options,
      );
      const json = (await response.json()) as Record<string, any>;

      return json;
    } catch (err: any) {
      console.log(err, ":::Error in like API");
      throw new Error(err);
    }
  };

  export const repost = async ({
    token,
    tweetId,
    userTwitterId,
  }: {
    token: string;
    tweetId: string;
    userTwitterId: string;
  }) => {
    try {
      const options = {
        headers: {
          method: "POST",
          body: JSON.stringify({
            tweet_id: tweetId,
          }),
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `${TWITTER_V2_API_URL}/users/${userTwitterId}/retweets`,
        options,
      );
      const json = (await response.json()) as Record<string, any>;

      return json;
    } catch (err: any) {
      console.log(err, ":::Error in repost API");
      throw new Error(err);
    }
  };

  // export const comment = async ({token, userTwitterId, tweetId}: {token: string; userTwitterId: string; tweetId: string}) => {
  //   try {
  //     const options = {
  //       headers: {
  //         method: "POST",
  //         body: JSON.stringify({
  //           tweet_id: tweetId,
  //         }),
  //         "Content-type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };
  //     const response = await fetch(
  //       `${TWITTER_V2_API_URL}/users/${userTwitterId}/retweets`,
  //       options,
  //     );
  //     const json = (await response.json()) as Record<string, any>;

  //     return json;
  //   } catch (err: any) {
  //     console.log(err, ":::Error in repost API");
  //     throw new Error(err);
  //   }
  // };
}
