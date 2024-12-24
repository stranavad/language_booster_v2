<script setup lang="ts">
import {apiGetUserSpaces} from "~/api/user";

const {data: spaces} = await useAsyncData(`user-spaces`, () => apiGetUserSpaces())
if(!spaces.value){
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed getting user spaces'
  })
}

const {user, clear, fetch} = useUserSession()

const userMenuItems = ref([
    ...spaces.value.map((space) => ({label: space.name, to: `/app/spaces/${space.id}`})),
  {
    label: 'Log out',
    color: 'error',
    onSelect: async() => {
      await clear();
      await fetch();
      await navigateTo('/login')
    }
  }
])
</script>

<template>
<div class="flex justify-between items-center px-4 h-12 border-b-2 border-b-slate-800 mb-4">
  <div class="">
    <NuxtLink to="/app">Language Booster</NuxtLink>
  </div>
  <UDropdownMenu v-if="user" :items="userMenuItems">
    <UButton variant="link">
      {{user.email}}
    </UButton>
  </UDropdownMenu>
</div>
</template>