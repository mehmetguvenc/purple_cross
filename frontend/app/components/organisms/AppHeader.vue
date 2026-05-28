<script setup lang="ts">
defineProps<{
  user: { name: string; email: string };
}>();
</script>

<template>
  <header class="flex items-center justify-end gap-3 h-20 px-6 border-b bg-white max-md:px-4">
    <UserMenu :user="user" />
  </header>
</template>
