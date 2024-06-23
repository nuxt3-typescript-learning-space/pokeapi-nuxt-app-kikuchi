<script setup lang="ts">
import { usePokemonStore } from '@/store/pokemon';
import type { Pokemon } from '@/store/pokemon';

// ポケモンストアを使用する
const pokemonStore = usePokemonStore();
const {
  pokemon: pokemonList,
  loading,
  error,
} = pokemonStore as { pokemon: Pokemon[]; loading: boolean; error: Error | null };

// ページメタ情報にミドルウェアを定義
definePageMeta({
  middleware: 'fetch-pokemon',
});
</script>

<template>
  <div>
    <h1>Pokémon List</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Error: {{ error.message }}</div>
    <ul v-if="!loading && !error">
      <li v-for="pokemon in pokemonList" :key="pokemon.name">
        {{ pokemon.name }}
      </li>
    </ul>
  </div>
</template>
