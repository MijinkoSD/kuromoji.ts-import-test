<script setup lang="ts">
import type { IpadicFormatterToken } from "kuromoji.ts/dist/util/IpadicFormatter";
import type { TokenizeQuery } from "~/types/tokenizeQuery";

const DIC_URL = "dict/";

const inputText = ref("すもももももももものうち");
const tokens = ref<IpadicFormatterToken[]>([]);
const svgStyle = ref("");
const messageBeforeLoaded = ref("ロード中です。");
const isLoading = ref(false);

const tokenize = async () => {
  if (inputText.value == "") {
    tokens.value = [];
    return;
  }

  try {
    const { data, pending, error, refresh } = await useFetch<{
      tokens: IpadicFormatterToken[];
    }>("/api/tokenize", {
      query: { text: inputText.value } as TokenizeQuery,
    });
    tokens.value = data.value?.tokens ?? [];
  } catch (e) {
    console.error(e);
    tokens.value = [];
  }
};

// フォームの内容が変化したらtokenizeする
const onChangeInput = async () => {
  svgStyle.value = "hidden";
  await tokenize();
};

onMounted(async () => {
  // nextTick()を挟むことで以降にあるuseFetch()を正しく機能させる
  await nextTick();
  await tokenize();
});
</script>

<template>
  <div id="app">
    <header>
      <span class="title"
        >kuromoji<span class="accent">.ts</span> demo (Node.js)</span
      >
    </header>

    <main>
      <div v-show="isLoading" data-alert="" class="alert-box radius">
        <div class="text-area">
          <p>{{ messageBeforeLoaded }}</p>
        </div>
      </div>

      <div v-show="!isLoading" class="demo">
        <div class="input">
          <label class="label">解析対象</label>
          <div class="input-area">
            <input
              type="text"
              placeholder="解析したい文字列を入力してください"
              v-model="inputText"
              @input="onChangeInput"
            />
            <div class="outline" />
          </div>
        </div>

        <ResultTable :tokens="tokens"></ResultTable>
      </div>
    </main>
  </div>
</template>

<style scoped>
#app {
  --color-1: hsl(211 84% 50% / 1);
  --color-w: hsl(80 50% 90% / 1);
  --color-2: hsl(51 84% 50% / 1);
}

header {
  margin: 0.5em 0 1em;
  padding: 0 1em;
  /* box-shadow: 0px 3px 1px -1px hsl(160 0% 80% / 1); */
}

.title {
  padding-bottom: 0.1em;
  display: inline-block;
  width: 100%;
  letter-spacing: -1px;
  font-size: 2.5em;
  font-family: "Nunito Sans", sans-serif;
  font-weight: 700;

  * {
    font-family: "Nunito Sans", sans-serif;
  }

  .accent {
    font-weight: 800;
    background: linear-gradient(
      120deg,
      var(--color-1) 48%,
      color-mix(in srgb-linear, var(--color-1), var(--color-w)) 53%,
      color-mix(in srgb-linear, var(--color-w), var(--color-2)) 62%,
      var(--color-2) 67%
    );
    background-clip: text;
    color: transparent;
  }
}

main {
  padding: 0 2em;
}

.demo {
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.input {
  display: flex;
  flex-direction: column;

  .label {
    font-size: 0.9em;
  }

  .input-area {
    /* width: 100%;
    height: fit-content; */
    padding-left: 0.5em;
  }

  input {
    border: none;
    padding: 0;
    outline: none;
    width: 100%;
    font-size: 1.2em;
    font-weight: 600;
    border-image: linear-gradient(90deg, #ccc, #ccc) 1;
  }

  .outline {
    margin-right: auto;
    border-bottom: 2px solid #ccc;
    outline: none;
    display: block;
    width: 100%;
    height: 0;
    border-radius: 3px;

    &::after {
      content: "";
      border-bottom: 2px solid hsl(211 77% 65% / 1);
      display: block;
      width: 0%;
      transition: all 0.3s 0s ease;
    }
  }

  input:focus-visible ~ .outline::after {
    width: 100%;
  }
}
</style>
