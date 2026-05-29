<script setup lang="ts">
// A small, reusable status pill. Kept dumb: the caller decides the label and tone.
defineProps<{
  label: string;
  tone: "success" | "info" | "warn" | "danger" | "secondary";
}>();
</script>

<template>
  <!-- Custom rounded pill instead of default tag -->
  <Tag
    :value="label"
    :severity="tone"
    :pt="{ root: { class: 'rounded-full px-2.5 py-0.5 text-xs font-medium' } }"
  />
</template>
