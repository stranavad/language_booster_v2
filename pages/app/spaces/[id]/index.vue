<template>
  <SpaceLayout v-if="space" :space="space">
    <div class="flex justify-between items-center w-full mb-4">
      <h2 class="text-lg">Projects</h2>
      <UModal title="Create new project">
        <UButton label="Create project" variant="soft"/>
        <template #body>
          <UForm
            class="space-y-4"
            :schema="createProjectSchema"
            :state="createProjectState"
            @submit="createProject"
          >
            <UFormField label="Name" name="name">
              <UInput v-model="createProjectState.name"/>
            </UFormField>
            <UFormField labe="Primary language" name="primaryLanguage">
              <UInput v-model="createProjectState.primaryLanguage" placeholder="en"/>
            </UFormField>
            <UButton label="Create project" type="submit"/>
          </UForm>
        </template>
      </UModal>
    </div>
    <div class="space-y-4">
      <NuxtLink
          v-for="project in projects"
          class="block border-2 border-slate-800 p-2"
          :to="`/app/spaces/${spaceId}/projects/${project.id}`"
      >
        <span class="text-sm text-slate-500 mr-2">#{{project.id}}</span>
        <span>{{project.name}}</span>
      </NuxtLink>
    </div>
  </SpaceLayout>
</template>
<script setup lang="ts">
import SpaceLayout from "~/components/SpaceLayout.vue";
import {apiGetSpaceById} from "~/api/spaces";
import {apiCreateProject, apiGetProjects, type CreateProjectDto, createProjectSchema} from "~/api/projects";
import type {FormSubmitEvent} from "#ui/types";

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const route = useRoute();
const spaceId = Number(route.params.id)
if(isNaN(spaceId)){
  throw createError({
    statusCode: 405,
    statusMessage: "Invalid space ID"
  })
}

const {data: space} = await useAsyncData(`space-${spaceId}`, () => apiGetSpaceById(spaceId))
const {data: projects, refresh: refreshProjects} = await useAsyncData(`projects-${spaceId}`, () => apiGetProjects(spaceId))

const createProjectState = reactive<CreateProjectDto>({
  name: '',
  primaryLanguage: '',
})

async function createProject(event: FormSubmitEvent<CreateProjectDto>) {
  await apiCreateProject(event.data, spaceId)
  await refreshProjects()

  createProjectState.name = ''
}

</script>
