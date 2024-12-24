<template>
  <ProjectLayout
      v-if="space && project"
      :space="space"
      :project="project"
  >
    <div class="flex justify-between items-center w-full mb-4">
      <h2 class="text-lg">Languages</h2>
      <UModal title="Create new language">
        <UButton label="Create language" variant="soft"/>
        <template #body>
          <UForm
            class="space-y-4"
            :schema="createLanguageSchema"
            :state="createLanguageState"
            @submit="createLanguage"
          >
            <UFormField label="Name" name="name">
              <UInput
                v-model="createLanguageState.name"
              />
            </UFormField>
            <UButton label="Submit" type="submit"/>
          </UForm>
        </template>
      </UModal>
    </div>
    <div class="space-y-4">
      <div
        v-for="language in languages"
        class="border-2 border-slate-800 p-2 flex justify-between items-center"
      >
        <span>{{language.name}}</span>
        <UBadge v-if="language.primary" variant="outline" color="neutral">Primary</UBadge>
        <div>
          <UModal
            title="Are you sure you want to delete this language"
            :close="{
              color: 'neutral',
              variant: 'outline',
              class: 'rounded-full'
            }"
          >
            <UButton
              label="Delete"
              variant="soft"
              size="xs"
              color="error"
            />
            <template #body>
              <span>Deleting this language will also delete all values under this languages!</span>
              <div class="flex justify-between mt-4">
                <UButton
                  label="Delete"
                  color="error"
                  @click="deleteLanguage(language.id)"
                />
              </div>
            </template>
          </UModal>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>
<script setup lang="ts">
import {apiGetSpaceById} from "~/api/spaces";
import {apiGetProjectById} from "~/api/projects";
import ProjectLayout from "~/components/ProjectLayout.vue";
import {
  apiCreateLanguage,
  apiDeleteLanguage,
  apiGetLanguages,
  type CreateLanguageDto,
  createLanguageSchema
} from "~/api/language";
import type {FormSubmitEvent} from "#ui/types";

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const toast = useToast()
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
const {data: languages, refresh: refreshLanguages} = await useAsyncData(`languages-${projectId}`, () => apiGetLanguages(projectId))
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

const createLanguageState = reactive<CreateLanguageDto>({
  name: ''
})


async function createLanguage(event: FormSubmitEvent<CreateLanguageDto>) {
  await apiCreateLanguage(event.data, projectId)
  await refreshLanguages()
  toast.add({
    title: 'Language successfully created',
    color: 'success'
  })
}

async function deleteLanguage(languageId: number): Promise<void>{
  await apiDeleteLanguage(languageId)
  await refreshLanguages()
  toast.add({
    title: 'Language successfully deleted',
    color: 'success'
  })
}
</script>