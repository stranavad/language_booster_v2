<template>
  <div class="flex gap-2">
    <div
        class="border border-slate-800 rounded-md w-48 p-2"
    >
      <h2 class="text-lg mb-2">{{ space.name }}</h2>
      <UNavigationMenu
          orientation="vertical"
          :items="navigationMenuTabs"
      />
    </div>
    <div class="w-full">
      <slot name="default"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {Space} from "~/types/space";

const props = defineProps<{
  space: Space
}>();

const navigationMenuTabs = ref([
  {
    label: 'Projects',
    to: `/app/spaces/${props.space.id}`
  },
  {
    label: 'Users',
    to: `/app/spaces/${props.space.id}/users`
  },
  {
    label: 'Settings',
    to: `/app/spaces/${props.space.id}/settings`
  }
])
</script>
