<script setup lang="ts">
const groups = [
  {
    label: "Menu",
    items: [
      { label: "Dashboard", to: "/", icon: "pi-objects-column" }
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Employees", to: "/employees", icon: "pi-users" }
    ],
  }
];
</script>

<template>
  <aside class="flex flex-col border-r bg-white max-md:hidden">
    <div class="h-20 flex items-center border-b px-4 py-4">
      <AppLogo />
    </div>

    <nav class="flex-1 flex flex-col gap-10 px-4 py-6">
      <div v-for="group in groups" :key="group.label" class="flex flex-col gap-1">
        <div class="caption pl-2 mb-1">{{ group.label }}</div>
        <NavItem v-for="item in group.items" :key="item.to" :to="item.to" :icon="item.icon" :label="item.label" />
      </div>
    </nav>
  </aside>
</template>
