<script setup lang="ts">
defineProps<{
  user: { name: string; email: string };
}>();

const { toggle } = useMobileNav();
</script>

<template>
  <header class="flex h-20 items-center gap-3 px-6 bg-white border-b max-md:px-4">
    <!-- this button is hidden on md breakpoint and above -->
    <button type="button" aria-label="Open menu"
      class="grid place-items-center md:hidden w-9 h-9 rounded-md text-foreground cursor-pointer hover:bg-surface-muted transition-colors"
      @click="toggle">
      <i class="pi pi-bars" />
    </button>
    <UserMenu :user="user" class="ml-auto" />
  </header>
</template>
