<script setup lang="ts">
import NavigationMenu from "~/components/NavigationMenu.vue";
</script>

<template>
  <div>
    <NavigationMenu/>
    <div class="px-2">
      <slot/>
    </div>
  </div>
</template>