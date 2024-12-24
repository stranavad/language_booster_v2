<template>
  <ProjectLayout
      v-if="space && project"
      :space="space"
      :project="project"
  >
    <div class="flex justify-between items-center w-full mb-4">
      <h2 class="text-lg">Settings</h2>
    </div>
    <div>
      <UForm
        class="space-y-4"
        :schema="updateProjectSchema"
        :state="updateProjectState"
        @submit="updateProject($event)"
      >
        <UFormField label="Name" name="name">
          <UInput v-model="updateProjectState.name"/>
        </UFormField>
        <UButton label="Save" type="submit"/>
      </UForm>
      <div class="mt-8 flex flex-col items-start gap-4">
        <span>Danger zone</span>
        <UModal
          title="Are you sure you want to delete this project?"
          :close="{
              color: 'neutral',
              variant: 'outline',
              class: 'rounded-full'
            }"
        >
          <UButton
            label="Delete project"
            color="error"
            variant="outline"
          />
          <template #body>
            <span>Deleting this project is irreversible</span>
            <div class="flex justify-between mt-4">
              <UButton
                label="Delete"
                color="error"
                variant="outline"
                @click="deleteProject"
              />
            </div>
          </template>
        </UModal>
      </div>
    </div>
  </ProjectLayout>
</template>
<script setup lang="ts">
import {apiGetSpaceById} from "~/api/spaces";
import {
  apiDeleteProject,
  apiGetProjectById,
  apiUpdateProject,
  type UpdateProjectDto,
  updateProjectSchema
} from "~/api/projects";
import ProjectLayout from "~/components/ProjectLayout.vue";
import type {FormSubmitEvent} from "#ui/types";

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

const {data: project, refresh: refreshProject} = await useAsyncData(`project-${projectId}`,() => apiGetProjectById(projectId))
const {data: space} = await useAsyncData(`space-${spaceId}`, () => apiGetSpaceById(spaceId))
if(!space.value){
  throw createError({
    statusCode: 404,
    statusMessage: 'Space not found'
  })
}
f
if(!project.value || project.value.spaceId !== space.value.id){
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found'
  })
}

const updateProjectState = reactive<UpdateProjectDto>({
  name: project.value.name
})

async function updateProject(event: FormSubmitEvent<UpdateProjectDto>){
  await apiUpdateProject(event.data, projectId)
  await refreshProject()
  updateProjectState.name = project.value!.name
}


async function deleteProject(){
  await apiDeleteProject(projectId)
  await navigateTo(`/app/spaces/${spaceId}`)
}

</script>