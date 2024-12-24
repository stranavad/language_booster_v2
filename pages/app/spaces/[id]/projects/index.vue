<template></template>
<script setup lang="ts">
const route = useRoute()
const spaceId = route.params.id
await navigateTo(`/spaces/${spaceId}`)
</script>