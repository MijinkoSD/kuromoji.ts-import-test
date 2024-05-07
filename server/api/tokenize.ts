import kuromoji from "kuromoji.ts";
import Tokenizer from "kuromoji.ts/dist/Tokenizer";
import { IpadicFormatterToken } from "kuromoji.ts/dist/util/IpadicFormatter";
import { TokenizeQuery } from "~/types/tokenizeQuery";
import { isPromise } from "~/utils/isPromise";

let tokenizer: Tokenizer | undefined;

// top-level await をすると、
// サーバー起動直後にアクセスした際に`Cannot access 'renderer$1' before initialization`が発生するので
// awaitはAPIにアクセスされた際に行う
let builder: Promise<void> | void = kuromoji
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
  async (event): Promise<{ tokens: IpadicFormatterToken[] }> => {
    if (isPromise(builder)) {
      builder = await builder;
    }

    const query = getQuery<TokenizeQuery>(event);
    if (tokenizer === undefined) {
      // throw createError({
      //   statusCode: 500,
      //   statusMessage: "Tokenizer is not ready yet",
      // });
      return { tokens: [] };
    }

    const tokens = tokenizer.tokenize(query.text);
    return { tokens };
  }
);
