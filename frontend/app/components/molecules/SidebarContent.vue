<script setup lang="ts">
// Since it's in use in both Desktop Sidebar and Mobile Drawer, I extracted it into a separate component
const navGroups = [
  {
    label: "Menu",
    items: [{ label: "Dashboard", to: "/", icon: "pi-objects-column" }],
  },
  {
    label: "Management",
    items: [{ label: "Employees", to: "/employees", icon: "pi-users" }],
  },
];
</script>

<template>
  <div class="h-full bg-white flex flex-col">
    <div class="h-20 px-4 flex items-center border-b">
      <AppLogo />
    </div>
    <nav class="flex-1 flex flex-col gap-10 py-6 px-4">
      <div v-for="group in navGroups" :key="group.label" class="flex flex-col gap-1">
        <div class="mb-1 pl-2 caption">{{ group.label }}</div>
        <NavItem v-for="item in group.items" :key="item.to" :to="item.to" :icon="item.icon" :label="item.label" />
      </div>
    </nav>
  </div>
</template>
