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

// ポケモンの名前をコンソールに出力する関数
const logPokemonName = (name: string) => {
  console.log(name);
};
</script>

<template>
  <div>
    <h1>Pokémon List</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Error: {{ error.message }}</div>
    <ul v-if="!loading && !error" class="pokemon-list">
      <li
        v-for="pokemon in pokemonList"
        :key="pokemon.name"
        class="pokemon-item"
        @click="pokemon.name && logPokemonName(pokemon.name)"
      >
        <img :src="pokemon.imageUrl" :alt="pokemon.name" class="pokemon-image" />
        <div>
          <span>{{ pokemon.japaneseName }}</span>
          <ul class="pokemon-types">
            <li v-for="type in pokemon.types" :key="type" class="pokemon-type">
              <div :class="type" class="type-image" />
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.pokemon-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: auto;
  width: 900px;
}

.pokemon-item {
  margin: 10px;
  padding: 10px;
  text-align: center;
  border: 1px solid #222;
  border-radius: 10px;
  cursor: pointer;
}

.pokemon-image {
  width: 96px;
  height: 96px;
}

.pokemon-types {
  list-style: none;
  margin-top: 5px;
  padding: 0;
  display: flex;
  justify-content: center;
}

.pokemon-type {
  margin-right: 5px;
}

$types: 'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice',
  'normal', 'poison', 'psychic', 'rock', 'steel', 'water';

.type-image {
  width: 24px;
  height: 24px;
  background-size: cover;
  background-repeat: no-repeat;

  @each $type in $types {
    &.#{$type} {
      background-image: url('@/assets/images/icon/types/#{$type}.png');
    }
  }
}
</style>
