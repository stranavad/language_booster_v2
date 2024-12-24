<template>
  <div class="flex gap-2">
    <div
        class="border border-slate-800 w-48 p-2"
    >
      <h2 class="text-lg mb-2">{{ project.name }}</h2>
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
import type {Project} from "~/types/project";
import type {Space} from "~/types/space";

const props = defineProps<{
  space: Space
  project: Project
}>();

const urlBase = `/app/spaces/${props.space.id}/projects/${props.project.id}`
const navigationMenuTabs = ref([
  {
    label: 'Mutations',
    to: urlBase
  },
  {
    label: 'Branches',
    to: `${urlBase}/branches`
  },
  {
    label: 'Requests',
    to: `${urlBase}/requests`
  },
  {
    label: 'Languages',
    to: `${urlBase}/languages`
  },
  {
    label: 'Settings',
    to: `${urlBase}/settings`
  }
])
</script>