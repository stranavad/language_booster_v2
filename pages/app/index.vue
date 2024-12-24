<template>
  <div class="flex items-center justify-between">
    <h2 class="text-lg font-bold">Spaces</h2>
    <UModal title="Create new space">
      <UButton label="Create space" variant="soft"/>
      <template #body>
        <UForm
            class="space-y-4"
            :schema="createSpaceSchema"
            :state="createSpaceState"
            @submit="createSpace"
        >
          <UFormField label="Name" name="name">
            <UInput v-model="createSpaceState.name"/>
          </UFormField>
          <UButton type="submit">
            Create
          </UButton>
        </UForm>
      </template>
    </UModal>
  </div>
  <div class="space-y-4 mt-4">
    <NuxtLink
      v-for="space in spaces"
      :to="`/app/spaces/${space.id}`"
      class="border-2 border-slate-800 p-2 block"
    >
      <span class="text-xs text-slate-500 mr-2">#{{space.id}}</span>
      <span>{{space.name}}</span>
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import {apiCreateSpace, apiGetSpaces, type CreateSpaceDto, createSpaceSchema} from "~/api/spaces";
import type {FormSubmitEvent} from "#ui/types";

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const toast = useToast()
const {data: spaces, refresh: refreshSpaces} = await useAsyncData(() => apiGetSpaces())
if(!spaces.value){
  throw createError({
    statusCode: 404,
    statusMessage: "Space not found",
    fatal: true
  })
}

const createSpaceState = reactive<CreateSpaceDto>({
  name: ''
})

async function createSpace(event: FormSubmitEvent<CreateSpaceDto>){
  await apiCreateSpace(event.data)
  await refreshSpaces()

  // Refresh state
  createSpaceState.name = ''

  toast.add({
    title: "Space successfully created",
    color: 'success'
  })
}
</script>