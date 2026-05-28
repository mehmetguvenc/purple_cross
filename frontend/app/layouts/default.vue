<script setup lang="ts">
// No auth token yet, so user data is hardcoded here.
const loggedInUser = ref({
  name: "Mehmet",
  email: "admin@purplecross.com",
});
</script>

<template>
  <div class="grid grid-cols-[240px_1fr] min-h-screen bg-background max-md:grid-cols-1">
    <AppSidebar />
    <div class="flex flex-col min-w-0">
      <AppHeader :user="loggedInUser" />
      <main class="p-8 max-md:p-5">
        <slot />
      </main>
    </div>
  </div>
</template>
