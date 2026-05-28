<script setup lang="ts">
import type Menu from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";

const props = defineProps<{
  user: { name: string; email: string };
}>();

const menu = ref<InstanceType<typeof Menu> | null>(null);
const initial = computed(() => props.user?.name[0]?.toUpperCase() || "U");

const items: MenuItem[] = [
  {
    label: "Settings", icon: "pi pi-cog",
    command: () => navigateTo("/settings")
  },
  { separator: true },
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    // No auth state yet, so this just navigates. Will clear session cookie when auth lands.
    command: () => navigateTo("/login"),
  },
];

const onToggle = (e: MouseEvent) => menu.value?.toggle(e);
</script>

<template>
  <button type="button"
    class="inline-flex items-center gap-2 px-2.5 py-2 rounded-full bg-surface-muted hover:bg-surface-strong transition-colors cursor-pointer"
    aria-haspopup="true" @click="onToggle">
    <Avatar :label="initial" shape="circle" class="bg-primary text-white" />
    <span class="body-sm text-foreground">{{ user.name }}</span>
    <i class="pi pi-chevron-down text-xs text-foreground-muted" />
  </button>
  <Menu ref="menu" :model="items" popup :pt="{
    root: { class: 'min-w-52 rounded-xl border shadow-sm overflow-hidden text-sm' },
    list: { class: 'p-1.5 flex flex-col gap-0.5' },
    itemLink: { class: 'gap-2.5 px-3 py-2 rounded-md text-foreground-soft hover:bg-surface-muted' },
    itemIcon: { class: 'text-foreground-muted text-sm' },
    separator: { class: 'my-1' },
  }" />
</template>
