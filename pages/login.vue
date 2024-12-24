<template>
  <div class="flex justify-center w-full items-center min-h-screen">
    <div class="max-w-sm w-full border-2 border-slate-800 rounded-md p-4">
      <h1 class="text-lg mb-4">Welcome to Language Booster</h1>
      <UTabs
        :items="tabItems"
      >
        <template #login>
          <UForm
            class="space-y-4"
            :schema="loginSchema"
            :state="loginState"
            @submit="login"
          >
            <UFormField label="Email" name="email">
              <UInput v-model="loginState.email" class="w-full"/>
            </UFormField>
            <UFormField label="Password" name="password">
              <UInput v-model="loginState.password" type="password" class="w-full"/>
            </UFormField>
            <UButton type="submit">
              Login
            </UButton>
          </UForm>
        </template>
        <template #register>
          <UForm
              class="space-y-4"
              :schema="registerSchema"
              :state="registerState"
              @submit="register"
          >
            <UFormField label="Name" name="name">
              <UInput v-model="registerState.name" class="w-full"/>
            </UFormField>
            <UFormField label="Email" name="email">
              <UInput v-model="registerState.email" class="w-full"/>
            </UFormField>
            <UFormField label="Password" name="password">
              <UInput v-model="registerState.password" type="password" class="w-full"/>
            </UFormField>
            <UButton type="submit">
              Register
            </UButton>
          </UForm>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {FormSubmitEvent} from "#ui/types";
import {loginSchema, type LoginSchema, registerSchema, type RegisterSchema} from "~/types/auth";

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()
const {fetch} = useUserSession()

const tabItems = [
  {
    label: 'Login',
    slot: 'login'
  },
  {
    label: 'Register',
    slot: 'register'
  }
]


const loginState = reactive<LoginSchema>({
  email: '',
  password: ''
})

const registerState = reactive<RegisterSchema>({
  name: '',
  email: '',
  password: ''
})

async function login(event: FormSubmitEvent<LoginSchema>){
  await $fetch('/api/auth/login', {
    method: 'POST',
    body: event.data
  }).catch(error => {
    toast.add({
      title: error.data.message,
      color: 'error'
    })
  })
  await fetch()

  await navigateTo('/app')
}

async function register(event: FormSubmitEvent<RegisterSchema>){
  await $fetch('/api/auth/register', {
    method: 'POST',
    body: event.data
  }).catch(error => {
    toast.add({
      title: error.data.message,
      color: 'error'
    })
  })
  await fetch()

  await navigateTo('/app')
}
</script>