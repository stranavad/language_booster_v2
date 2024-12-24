<template>
  <SpaceLayout v-if="space" :space="space">
    <div class="flex justify-between items-center w-full mb-4">
      <h2 class="text-lg">Users</h2>
      <UModal title="Invite user">
        <UButton label="Invite user" variant="soft"/>
        <template #body>
          <UForm
              class="space-y-4"
              :schema="inviteUserToSpaceSchema"
              :state="inviteUserState"
              @submit="inviteUserToSpace($event)"
          >
            <UFormField label="Email" name="email">
              <UInput v-model="inviteUserState.email"/>
            </UFormField>
            <UFormField label="Role" name="role">
              <USelect
                v-model="inviteUserState.role"
                class="uppercase"
                :items="[Role.ADMIN, Role.EDITOR, Role.VIEWER]"
              />
            </UFormField>
            <UButton type="submit">Submit</UButton>
          </UForm>
        </template>
      </UModal>
    </div>
    <div class="space-y-4">
      <div
        v-for="member in members"
        class="flex items-center justify-between border-2 border-slate-800 p-2"
      >
        <div class="flex items-center gap-4">
          <span>{{member.user.name}}</span>
          <span class="text-xs">{{member.user.email}}</span>
          <USelect
            v-if="member.role !== Role.OWNER"
            class="uppercase"
            :modelValue="member.role"
            :items="[Role.ADMIN, Role.EDITOR, Role.VIEWER]"
            @update:modelValue="updateSpaceMember($event, member.user.id)"
          />
          <span v-else class="uppercase">{{member.role}}</span>
        </div>
        <div>
          <UButton
            v-if="member.role !== Role.OWNER"
            label="Remove"
            size="xs"
            variant="soft"
            color="error"
            @click="removeSpaceMember(member.user.id)"
          />
        </div>
      </div>
    </div>
  </SpaceLayout>
</template>
<script setup lang="ts">
import {
  apiGetSpaceById,
  apiGetSpaceMembers, apiInviteUserToSpace, apiRemoveSpaceMember, apiUpdateSpaceMember,
  type InviteUserToSpaceDto,
  inviteUserToSpaceSchema,
  Role
} from "~/api/spaces";
import SpaceLayout from "~/components/SpaceLayout.vue";
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
const {data: members, refresh: refreshMembers} = await useAsyncData(`space-${spaceId}-members`, () => apiGetSpaceMembers(spaceId))

if(!space.value || !members.value){
  throw createError({
    statusCode: 500,
    statusMessage: "Error when fetching space and members"
  })
}

const inviteUserState = reactive<InviteUserToSpaceDto>({
  email: '',
  role: Role.VIEWER
})

async function updateSpaceMember(role: Role, userId: number){
  await apiUpdateSpaceMember({role, userId, spaceId})
  await refreshMembers()
}

async function inviteUserToSpace(event: FormSubmitEvent<InviteUserToSpaceDto>){
  await apiInviteUserToSpace(event.data, spaceId)
  await refreshMembers()

  // Refresh state
  inviteUserState.role = Role.VIEWER
  inviteUserState.email = ''
}

async function removeSpaceMember(userId: number){
  await apiRemoveSpaceMember({
    userId,
    spaceId
  })
  await refreshMembers()
}
</script>