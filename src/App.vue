<script setup lang="ts">
import type { MainMenu } from './game/scenes/menuGroup/MainMenu';
import PhaserGame from './game/PhaserGame.vue';
import { ref } from 'vue';

const canMoveSprite = ref();

const phaserRef = ref();

const currentScene = (scene: MainMenu) => {
    canMoveSprite.value = (scene.scene.key !== "MainMenu");
}

</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
</template>
