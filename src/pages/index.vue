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

// 共通部分のパスを変数に格納
const basePath = '../assets/images/icon/types/';

// タイプ画像のパスを定義
const typeImagePaths: { [key: string]: string } = {
  bug: `${basePath}bug.png`,
  dark: `${basePath}dark.png`,
  dragon: `${basePath}dragon.png`,
  electric: `${basePath}electric.png`,
  fairy: `${basePath}fairy.png`,
  fighting: `${basePath}fighting.png`,
  fire: `${basePath}fire.png`,
  flying: `${basePath}flying.png`,
  ghost: `${basePath}ghost.png`,
  grass: `${basePath}grass.png`,
  ground: `${basePath}ground.png`,
  ice: `${basePath}ice.png`,
  normal: `${basePath}normal.png`,
  poison: `${basePath}poison.png`,
  psychic: `${basePath}psychic.png`,
  rock: `${basePath}rock.png`,
  steel: `${basePath}steel.png`,
  water: `${basePath}water.png`,
};

const convertImgSrc = (src: string): string => {
  return new URL(src, import.meta.url).href;
};
</script>

<template>
  <div>
    <h1>Pokémon List</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Error: {{ error.message }}</div>
    <ul v-if="!loading && !error" class="pokemon-list">
      <li v-for="pokemon in pokemonList" :key="pokemon.name" class="pokemon-item">
        <img :src="pokemon.imageUrl" :alt="pokemon.name" class="pokemon-image" />
        <div>
          <span>{{ pokemon.japaneseName }}</span>
          <ul class="pokemon-types">
            <li v-for="type in pokemon.types" :key="type" class="pokemon-type">
              <img :src="convertImgSrc(typeImagePaths[type])" :alt="type" class="type-image" />
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pokemon-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
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

.type-image {
  width: 24px;
  height: 24px;
}
</style>
