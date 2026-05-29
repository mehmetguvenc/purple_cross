<script setup lang="ts">
const { open, close } = useMobileNav();
const route = useRoute();

// Close on route change and on any nav link tap inside the drawer
watch(() => route.path, close);

const onClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest("a")) close();
};
</script>

<template>
  <Drawer v-model:visible="open" position="left" :pt="{
    root: { class: 'w-60 md:hidden' },
    header: { class: 'hidden' },
    content: { class: 'p-0 bg-white' },
  }">
    <div @click="onClick">
      <SidebarContent />
    </div>
  </Drawer>
</template>
