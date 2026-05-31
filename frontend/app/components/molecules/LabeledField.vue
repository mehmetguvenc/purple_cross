<script setup lang="ts">
// Wraps a single control with a floating label and an optional error line.
// The control comes through the slot and gets the generated id, so the label points at it.
defineProps<{
  label: string;
  required?: boolean;
  error?: string;
}>();

const id = useId();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <FloatLabel variant="on">
      <slot :id="id" />
      <label :for="id">
        {{ label }}<span v-if="required" class="text-red-500"> *</span>
      </label>
    </FloatLabel>

    <Message v-if="error" severity="error" size="small" variant="simple">
      {{ error }}
    </Message>
  </div>
</template>
