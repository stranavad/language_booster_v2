<template>
  <ProjectLayout
      v-if="space && project"
      :space="space"
      :project="project"
  >
    <div class="flex justify-between items-center w-full mb-4">
      <h2 class="text-lg">Requests</h2>
      <UModal
          title="Create new request"
          @update:open="$event ? loadBranches() : undefined"
      >
        <UButton label="Create request" variant="soft"/>
        <template #body>
          <UForm
              class="space-y-4"
              :schema="createBranchRequestSchema"
              :state="createRequestState"
              @submit="createRequest"
          >
            <UFormField label="Name" name="name">
              <UInput
                  v-model="createRequestState.name"
                  class="w-full"
              />
            </UFormField>
            <UFormField labe="Branch" name="branchId">
              <USelect
                value-key="id"
                label-key="name"
                class="w-full"
                placeholder="Select a branch"
                :model-value="createRequestState.branchId"
                :items="branches"
                @update:modelValue="createRequestState.branchId = Number($event)"
              />
            </UFormField>
            <UButton label="Submit" type="submit"/>
          </UForm>
        </template>
      </UModal>
    </div>
    <div class="space-y-4">
      <div
          v-for="request in requests"
          class="border-2 border-slate-800 p-2 flex items-start justify-between"
      >
        <div class="flex flex-col items-start gap-2">
          <span>{{request.name}}</span>
          <span class="text-xs">Branch: {{request.branch.name}}</span>
          <span class="text-xs">Branch author: {{request.branch.user.name}} ({{request.branch.user.email}})</span>
          <span class="text-xs">Author: {{request.user.name}} ({{request.user.email}})</span>
        </div>
        <div class="flex flex-col items-start gap-2">
          <UButton
            size="xs"
            variant="soft"
            color="neutral"
            label="View"
          />
          <UButton
            size="xs"
            variant="soft"
            label="Approve"
          />
          <UButton
            size="xs"
            color="error"
            variant="soft"
            label="Close"
            @click="deleteRequest(request.id)"
          />
        </div>
      </div>
      <div v-if="!requests.length">
        <span class="text-xs">There are not requests yet</span>
      </div>
    </div>
  </ProjectLayout>
</template>
<script setup lang="ts">
import {apiGetSpaceById} from "~/api/spaces";
import {apiGetProjectById} from "~/api/projects";
import ProjectLayout from "~/components/ProjectLayout.vue";
import {apiGetBranches} from "~/api/branches";
import {
  apiCreateBranchRequest, apiDeleteBranchRequest,
  apiGetBranchRequests,
  type CreateBranchRequestDto,
  createBranchRequestSchema
} from "~/api/branchRequest";
import type {Branch} from "~/types/branch";
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

const {data: project} = await useAsyncData(`project-${projectId}`,() => apiGetProjectById(projectId))
const {data: space} = await useAsyncData(`space-${spaceId}`, () => apiGetSpaceById(spaceId))
const {data: requests, refresh: refreshRequests} = await useAsyncData(`requests-${projectId}`, () => apiGetBranchRequests(projectId))
if(!space.value){
  throw createError({
    statusCode: 404,
    statusMessage: 'Space not found'
  })
}

if(!project.value || project.value.spaceId !== space.value.id || !requests.value){
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found'
  })
}

const branches = ref<Branch[]>([])

function loadBranches(){
  apiGetBranches(projectId).then((res) => branches.value = res)
}

const createRequestState = reactive<CreateBranchRequestDto>({
  name: '',
  branchId: 0
})

async function createRequest(event: FormSubmitEvent<CreateBranchRequestDto>){
  await apiCreateBranchRequest(event.data)
  await refreshRequests();
  createRequestState.name = '';
  createRequestState.branchId = 0;
}

async function deleteRequest(requestId: number){
  await apiDeleteBranchRequest(requestId)
  await refreshRequests()
}
</script>