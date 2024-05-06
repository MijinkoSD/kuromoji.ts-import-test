import kuromoji from "kuromoji.ts";
import Tokenizer from "kuromoji.ts/dist/Tokenizer";
import { IpadicFormatterToken } from "kuromoji.ts/dist/util/IpadicFormatter";
import { TokenizeQuery } from "~/types/tokenizeQuery";

let tokenizer: Tokenizer | undefined;
await kuromoji
  .builder({ dicPath: "./public/dict/" })
  .build((errors, _tokenizer) => {
    if (errors.find((e) => e !== null)) {
      for (const error of errors) {
        if (error === null) continue;
        console.error(error);
      }
    }
    tokenizer = _tokenizer;
  });

export default defineEventHandler(
  (event): { tokens: IpadicFormatterToken[] } => {
    const query = getQuery<TokenizeQuery>(event);
    if (tokenizer === undefined) {
      throw createError({
        statusCode: 500,
        statusMessage: "Tokenizer is not ready yet",
      });
    }

    const tokens = tokenizer.tokenize(query.text);
    return { tokens };
  }
);
