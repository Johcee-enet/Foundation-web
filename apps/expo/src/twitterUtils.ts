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
