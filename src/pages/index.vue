<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/Modal.vue';
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
definePageMeta({ middleware: 'fetch-pokemon' });

const showModal = ref(false); // モーダル表示状態を管理するリアクティブ変数
const showBreakAnimation = ref(false); // ボールが割れるアニメーションを表示するリアクティブ変数
const animationPosition = ref<{ top: number; left: number }>({ top: 0, left: 0 }); // アニメーションの位置を保持するリアクティブ変数
const pokemonDetail = ref<Pokemon | null>(null); // 詳細情報を表示するポケモンのデータを保持するリアクティブ変数

/**
 * ポケモンの詳細情報を更新する関数
 * @param pokemon - ポケモンの詳細データ
 * @param event - クリックイベント
 */
const updatePokemonDetail = async (pokemon: Pokemon, event: MouseEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const MAGIC_NUBER = 50;
  animationPosition.value = {
    top: rect.top - MAGIC_NUBER + window.scrollY,
    left: rect.left - MAGIC_NUBER + window.scrollX,
  };
  showBreakAnimation.value = true; // ボールが割れるアニメーションを表示
  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5秒待つ
  pokemonDetail.value = pokemon; // ポケモンの詳細データを更新
  showBreakAnimation.value = false; // ボールが割れるアニメーションを非表示
  showModal.value = true; // モーダルを表示
};

/**
 * ポケモンの鳴き声を再生する関数
 * @param url - 鳴き声のURL
 */
const playCry = (url: string) => {
  const audio = new Audio(url);
  audio.play();
};
</script>

<template>
  <div id="pokemon-list">
    <h1>Pokémon List</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Error: {{ error.message }}</div>
    <ul v-if="!loading && !error" class="pokemon-list">
      <!-- ポケモンのリストを表示 -->
      <li
        v-for="(pokemon, index) in pokemonList"
        :key="pokemon.name"
        :style="{ animationDelay: `${index * 0.025}s` }"
        class="pokemon-item fade-up"
        @click="updatePokemonDetail(pokemon, $event)"
      >
        <!-- ポケモンの画像 -->
        <img :src="pokemon.imageUrl" :alt="pokemon.name" class="pokemon-image" />
        <div>
          <!-- ポケモンの日本語名 -->
          <span>{{ pokemon.japaneseName }}</span>
          <!-- ポケモンのタイプ -->
          <ul class="pokemon-types">
            <li v-for="type in pokemon.types" :key="type" class="pokemon-type">
              <div :class="type" class="type-image" />
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <!-- ボールが割れるアニメーション -->
    <div
      v-if="showBreakAnimation"
      class="break-animation"
      :style="{ top: `${animationPosition?.top}px`, left: `${animationPosition?.left}px` }"
    >
      <img src="@/assets/images/ball_break.png" alt="Ball Break Animation" />
    </div>
    <!-- モーダル表示 -->
    <Modal :show="showModal" @update:show="showModal = $event">
      <div class="modal-content">
        <p class="modal-pokemon-name">{{ pokemonDetail?.japaneseName }}</p>
        <div class="modal-pokemon-image">
          <img
            class="modal-pokemon-image__item"
            :src="pokemonDetail?.officialArtworkUrl"
            :alt="pokemonDetail?.japaneseName"
          />
        </div>
        <p class="modal-pokemon-description">{{ pokemonDetail?.description }}</p>
        <ul class="pokemon-stats">
          <li v-for="stat in pokemonDetail?.stats" :key="stat.name" class="pokemon-stat">
            <span class="stat-name">{{ stat.name }}</span>
            <div class="stat-bar-container">
              <div class="stat-bar" :style="{ width: `${(stat.base_stat / 255) * 100}%` }" />
              <span class="stat-value">{{ stat.base_stat }}</span>
            </div>
          </li>
        </ul>
        <div class="pokemon-cry">
          <button @click="pokemonDetail?.cryUrl && playCry(pokemonDetail.cryUrl)">鳴き声を再生</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss" scoped>
#pokemon-list {
  width: 1200px;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.8);
}

h1 {
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  padding: 40px;
  border-bottom: 3px dashed #000;
}
.pokemon-list {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: auto;
  width: 100%;
  padding: 40px;
}

.pokemon-item {
  margin: 10px;
  padding: 10px;
  text-align: center;
  border: 2px solid #222;
  border-radius: 50%;
  background: #fff;
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.1s ease-out forwards;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 100%;
    padding-top: 100%;
    display: block;
    border-radius: 50%;
    background-image: url('@/assets/images/monsterball.png');
    background-size: cover;
    opacity: 0.3;
  }

  &:hover {
    &::after {
      opacity: 0;
    }
  }
}

.pokemon-image {
  width: 96px;
  height: 96px;
  border-radius: 50%;
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

.modal-content {
  background-color: #f5f5dc; /* ベージュ背景 */
  padding: 40px;
  font-family: 'Courier New', Courier, monospace;
  width: 100%;
  height: 100%;
  margin: auto;
  text-align: left;
}

.pokemon-cry {
  margin-top: 10px;
  text-align: center;
}

.modal-pokemon-name {
  font-size: 18px;
  font-weight: bold;
}

.modal-pokemon-image {
  text-align: center;
  margin-top: 10px;
  background: #fff;
  padding: 20px;
  border: 2px dotted #000;

  &__item {
    width: 200px;
    height: 200px;
    margin: auto;
  }
}

.modal-pokemon-description {
  margin-top: 10px;
  font-size: 14px;
}

.pokemon-stats {
  list-style: none;
  padding: 0;
  margin-top: 10px;
  font-size: 14px;

  .pokemon-stat {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .stat-name {
      width: 100px;
    }

    .stat-bar-container {
      flex-grow: 1;
      display: flex;
      align-items: center;
      margin-left: 10px;
      position: relative;

      .stat-bar {
        height: 10px;
        background-color: #ffcc00;
        border: 1px solid #000;
      }

      .stat-value {
        position: absolute;
        right: -30px;
      }
    }
  }
}

/* フェードアップアニメーションの定義 */
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ボールが割れるアニメーション */
.break-animation {
  position: absolute;
  width: 300px;
  z-index: 1000;
  pointer-events: none;

  img {
    width: 100%;
    height: auto;
  }
}
</style>
