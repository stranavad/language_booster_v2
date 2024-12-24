<template>
  <ProjectLayout
    v-if="space && project && languages"
    :space="space"
    :project="project"
  >
    <div class="flex justify-between items-center w-full mb-4">
      <h2 class="text-lg">Mutations</h2>
      <UModal title="Create new language">
        <UButton label="Create mutation" variant="soft"/>
        <template #body>
          <UForm
            class="space-y-4"
            :schema="createMutationSchema"
            :state="createMutationState"
            @submit="createMutation"
          >
            <UFormField label="Key" name="key">
              <UInput
                  v-model="createMutationState.key"
              />
            </UFormField>
            <UFormField v-for="language in createMutationState.values" :label="languages.find(l => l.id === language.languageId)?.name || ''">
              <UInput v-model="language.value"/>
            </UFormField>
            <UButton label="Submit" type="submit"/>
          </UForm>
        </template>
      </UModal>
    </div>
  </ProjectLayout>
</template>
<script setup lang="ts">
import {apiGetSpaceById} from "~/api/spaces";
import {apiGetProjectById} from "~/api/projects";
import ProjectLayout from "~/components/ProjectLayout.vue";
import type {Language} from "~/types/language";
import {apiGetLanguages, createLanguageSchema} from "~/api/language";
import {apiCreateMutation, type CreateMutationDto, createMutationSchema} from "~/api/mutation";

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const route = useRoute();
const spaceId = Number(route.params.id);
const projectId = Number(route.params.projectId);

if(isNaN(spaceId) || isNaN(projectId)) {
  throw createError({
    statusCode: 500,
    statusMessage: "Invalid space ID or project ID"
  })
}

const {data: project} = await useAsyncData(`project-${projectId}`,() => apiGetProjectById(projectId))
const {data: space} = await useAsyncData(`space-${spaceId}`, () => apiGetSpaceById(spaceId))
const {data: languages} = await useAsyncData(`languages-${projectId}`, () => apiGetLanguages(projectId))
if(!space.value){
  throw createError({
    statusCode: 404,
    statusMessage: 'Space not found'
  })
}

if(!project.value || project.value.spaceId !== space.value.id || !languages.value){
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found'
  })
}


const createMutationState = reactive<CreateMutationDto>({
  key: '',
  projectId,
  values: languages.value.map((language) => ({
    value: '',
    languageId: language.id
  }))
})

async function createMutation(event: FormSubmitEvent<CreateMutationDto>){
  await apiCreateMutation(event.data)
}
</script>