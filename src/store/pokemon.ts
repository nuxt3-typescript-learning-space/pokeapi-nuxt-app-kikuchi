// store/pokemon.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * ポケモンのデータの型定義
 */
export interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string; // 画像URLを追加
}

/**
 * ポケモンのデータを管理するストア
 */
export const usePokemonStore = defineStore('pokemon', () => {
  const pokemon = ref<Pokemon[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * PokeAPIからポケモンのデータを取得する非同期関数
   */
  const fetchPokemon = async () => {
    loading.value = true; // データ取得中はローディング状態にする
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      const results = data.results;

      // 各ポケモンの詳細データを取得
      const detailedPokemon = await Promise.all(
        results.map(async (pokemon: Pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            ...pokemon,
            imageUrl: details.sprites.front_default, // 画像URLを追加
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
