import { usePokemonStore } from '@/store/pokemon';

/**
 * ページナビゲーション時にポケモンデータを取得するミドルウェア
 */
export default defineNuxtRouteMiddleware(async () => {
  const pokemonStore = usePokemonStore();
  // 既にポケモンデータが取得されているかどうかを確認
  if (!pokemonStore.pokemon.length) {
    await pokemonStore.fetchPokemon(); // データがなければ新たに取得
  }
});
