<script setup lang="ts">
const props = defineProps<{
  to: string;
  icon: string;
  label: string;
}>();

const route = useRoute();
// "/" needs exact match so Dashboard doesn't light up for every route.
const isActive = computed(() => (props.to === "/" ? route.path === "/" : route.path.startsWith(props.to)));
</script>

<template>
  <NuxtLink :to="to" :class="[
    'body-sm flex items-center gap-2.5 px-3 py-2 rounded-md no-underline transition-colors',
    isActive ? 'bg-primary-muted text-primary' : 'text-foreground-muted hover:bg-surface-muted',
  ]">
    <i :class="['pi', icon, 'text-sm']" />
    {{ label }}
  </NuxtLink>
</template>
