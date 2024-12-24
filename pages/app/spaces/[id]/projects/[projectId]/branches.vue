<template>
  <ProjectLayout
    v-if="space && project && branches"
    :space="space"
    :project="project"

  >
    <div class="flex justify-between items-center w-full mb-4">
      <h2 class="text-lg">Branches</h2>
      <UModal title="Create new branch">
        <UButton label="Create branch" variant="soft"/>
        <template #body>
          <UForm
              class="space-y-4"
              :schema="createBranchSchema"
              :state="createBranchState"
              @submit="createBranch"
          >
            <UFormField label="Name" name="name">
              <UInput v-model="createBranchState.name"/>
            </UFormField>
            <UButton label="Create" type="submit"/>
          </UForm>
        </template>
      </UModal>
    </div>
    <div class="space-y-4">
      <div
        v-for="branch in branches"
        class="flex justify-between items-center border-2 border-slate-800 p-2"
      >
        <div>
          <span class="mr-4">{{branch.name}}</span>
          <span class="text-xs text-slate-500">
            {{branch.user.name}}
            ({{branch.user.email}})
          </span>
        </div>
        <div>
          <UModal
              title="Are you sure you want to delete this branch"
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
              <span>Deleting this branch will also delete any changes made!</span>
              <div class="flex justify-between mt-4">
                <UButton
                  label="Delete"
                  color="error"
                  @click="deleteBranch(branch.id)"
                />
              </div>
            </template>
          </UModal>
        </div>
      </div>
      <div v-if="!branches.length">
        <span class="text-xs">
          No branches found
        </span>
      </div>
    </div>
  </ProjectLayout>
</template>
<script setup lang="ts">
import {apiGetSpaceById} from "~/api/spaces";
import {apiGetProjectById} from "~/api/projects";
import ProjectLayout from "~/components/ProjectLayout.vue";
import {
  apiCreateBranch,
  apiDeleteBranch,
  apiGetBranches,
  type CreateBranchDto,
  createBranchSchema
} from "~/api/branches";
import type {FormSubmitEvent} from "#ui/types";

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const toast = useToast();
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
const {data: branches, refresh: refreshBranches} = await useAsyncData(`branches-${projectId}`, () => apiGetBranches(projectId))
if(!space.value){
  throw createError({
    statusCode: 404,
    statusMessage: 'Space not found'
  })
}

if(!project.value || project.value.spaceId !== space.value.id){
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found'
  })
}

const createBranchState = reactive<CreateBranchDto>({
  name: ''
})

async function createBranch(event: FormSubmitEvent<CreateBranchDto>){
  await apiCreateBranch(event.data, projectId)
  await refreshBranches()
  toast.add({
    title: "Branch successfully created",
    color: 'success'
  })
}

async function deleteBranch(branchId: number){
  await apiDeleteBranch(branchId)
  await refreshBranches()
}
</script>