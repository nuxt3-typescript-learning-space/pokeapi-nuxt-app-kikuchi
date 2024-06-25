import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * ポケモンのデータの型定義
 */
export interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string; // 画像URLを追加
  japaneseName?: string; // 日本語名を追加
  types?: string[]; // タイプ情報を追加
  cryUrl?: string; // 鳴き声URLを追加
}

/**
 * ポケモンのデータを管理するストア
 */
export const usePokemonStore = defineStore('pokemon', () => {
  const pokemon = ref<Pokemon[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * ポケモンの日本語名を取得する関数
   */
  const fetchJapaneseName = async (englishName: string): Promise<string> => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${englishName}`);
      const data = await response.json();
      const japaneseEntry = data.names.find((name: { language: { name: string } }) => name.language.name === 'ja');
      return japaneseEntry ? japaneseEntry.name : englishName; // 日本語名が見つからない場合は英語名を返す
    } catch (err) {
      console.error(`Error fetching Japanese name for ${englishName}:`, err);
      return englishName;
    }
  };

  /**
   * PokeAPIからポケモンのデータを取得する非同期関数
   */
  const fetchPokemon = async () => {
    loading.value = true; // データ取得中はローディング状態にする
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      const results = data.results;

      // 各ポケモンの詳細データと日本語名、鳴き声URLを取得
      const detailedPokemon = await Promise.all(
        results.map(async (pokemon: Pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          const japaneseName = await fetchJapaneseName(pokemon.name);
          const types = details.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name); // タイプ情報を取得
          const cryUrl = details.cries ? details.cries.latest : ''; // 鳴き声URLを取得
          return {
            ...pokemon,
            imageUrl: details.sprites.front_default, // 画像URLを追加
            japaneseName: japaneseName, // 日本語名を追加
            types: types, // タイプ情報を追加
            cryUrl: cryUrl, // 鳴き声URLを追加
          };
        }),
      );

      pokemon.value = detailedPokemon; // 取得したポケモンデータをストアに保存
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err)); // エラーが発生した場合はエラー情報を保存
    } finally {
      loading.value = false; // データ取得が完了したらローディング状態を解除
    }
  };

  return { pokemon, loading, error, fetchPokemon };
});
