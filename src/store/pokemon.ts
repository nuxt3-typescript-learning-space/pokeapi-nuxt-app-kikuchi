import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * ポケモンのデータの型定義
 */
export interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string; // 画像URL
  japaneseName?: string; // 日本語名
  types?: string[]; // タイプ情報
  cryUrl?: string; // 鳴き声URL
  description?: string; // 説明文
}

/**
 * PokeAPIからポケモンの日本語名を取得するヘルパー関数
 * @param englishName - 英語名
 * @returns 日本語名
 */
const fetchJapaneseName = async (englishName: string): Promise<string> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${englishName}`);
    const data = await response.json();
    const japaneseEntry = data.names.find((name: { language: { name: string } }) => name.language.name === 'ja');
    return japaneseEntry ? japaneseEntry.name : englishName; // 日本語名が見つからない場合は英語名を返す
  } catch (err) {
    console.error(`Error fetching Japanese name for ${englishName}:`, err);
    return englishName; // エラー時は英語名を返す
  }
};

/**
 * PokeAPIからポケモンの説明文を日本語で取得するヘルパー関数
 * @param englishName - 英語名
 * @returns 日本語の説明文
 */
const fetchJapaneseDescription = async (englishName: string): Promise<string> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${englishName}`);
    const data = await response.json();
    const japaneseEntry = data.flavor_text_entries.find(
      (entry: { language: { name: string } }) => entry.language.name === 'ja',
    );
    return japaneseEntry ? japaneseEntry.flavor_text : ''; // 日本語の説明文が見つからない場合は空文字を返す
  } catch (err) {
    console.error(`Error fetching Japanese description for ${englishName}:`, err);
    return ''; // エラー時は空文字を返す
  }
};

/**
 * PokeAPIからポケモンの詳細データを取得するヘルパー関数
 * @param url - ポケモンの詳細データURL
 * @param name - ポケモンの英語名
 * @returns ポケモンの詳細データ
 */
const fetchPokemonDetails = async (url: string, name: string): Promise<Pokemon> => {
  const res = await fetch(url);
  const details = await res.json();
  const japaneseName = await fetchJapaneseName(name);
  const description = await fetchJapaneseDescription(name);
  const types = details.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name);
  const cryUrl = details.cries ? details.cries.latest : '';
  return {
    name,
    url,
    imageUrl: details.sprites.front_default,
    japaneseName,
    types,
    cryUrl,
    description,
  };
};

/**
 * ポケモンのデータを管理するPiniaストア
 */
export const usePokemonStore = defineStore('pokemon', () => {
  const pokemon = ref<Pokemon[]>([]); // ポケモンのデータを保持するリアクティブ変数
  const loading = ref(false); // データ取得中の状態を保持するリアクティブ変数
  const error = ref<Error | null>(null); // エラー情報を保持するリアクティブ変数

  /**
   * PokeAPIからポケモンのデータを取得する非同期関数
   */
  const fetchPokemon = async () => {
    loading.value = true; // データ取得中はローディング状態にする
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      const results = data.results;

      // 各ポケモンの詳細データを取得し、まとめて保存
      const detailedPokemon = await Promise.all(
        results.map((pokemon: Pokemon) => fetchPokemonDetails(pokemon.url, pokemon.name)),
      );

      pokemon.value = detailedPokemon; // 取得したポケモンデータをストアに保存
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err)); // エラーが発生した場合はエラー情報を保存
    } finally {
      loading.value = false; // データ取得が完了したらローディング状態を解除
    }
  };

  return { pokemon, loading, error, fetchPokemon }; // ストアの状態とメソッドを返す
});
