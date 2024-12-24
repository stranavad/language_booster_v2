<template>
  <SpaceLayout v-if="space" :space="space">
    <div class="mb-4">
      <h2 class="text-lg">Settings</h2>
    </div>
    <div>
      <UForm
        class="space-y-4"
        :state="updateSpaceState"
        :schema="createSpaceSchema"
        @submit="updateSpace"
      >
        <UFormField label="Name" name="name">
          <UInput v-model="updateSpaceState.name"/>
        </UFormField>
        <UButton
          type="submit"
          label="Save"
          :disabled="updateSpaceState.name === space.name"
        />
      </UForm>
    </div>
  </SpaceLayout>
</template>

<script setup lang="ts">
import {apiGetSpaceById, apiUpdateSpace, type CreateSpaceDto, createSpaceSchema} from "~/api/spaces";
import type {FormSubmitEvent} from "#ui/types";

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const route = useRoute();
const toast = useToast()
const spaceId = Number(route.params.id)
if(isNaN(spaceId)){
  throw createError({
    statusCode: 405,
    statusMessage: "Invalid space ID",
    fatal: true
  })
}
const {data: space} = await useAsyncData(`space-${spaceId}`, () => apiGetSpaceById(spaceId))
if(!space.value){
  throw createError({
    statusCode: 404,
    statusMessage: "Space not found",
    fatal: true
  })
}

const updateSpaceState = reactive<CreateSpaceDto>({
  name: space.value.name
})

async function updateSpace(event: FormSubmitEvent<CreateSpaceDto>){
  space.value = await apiUpdateSpace(event.data, spaceId)
  toast.add({
    title: "Space successfully updated",
    color: 'success'
  })

}

</script>

