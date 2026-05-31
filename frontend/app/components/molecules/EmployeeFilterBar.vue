<script setup lang="ts">
import type { EmployeeFilterValues } from "@/types/employee";

// The bar mutates these values in place; the page owns the models and refetches from them.
const filters = defineModel<EmployeeFilterValues>("filters", { required: true });
const sortField = defineModel<string>("sortField", { required: true });
const sortOrder = defineModel<number>("sortOrder", { required: true });

// label is what the user sees; value is what the server filters on.
const employmentOptions = [
  { label: "Currently employed", value: "current" },
  { label: "Employed soon", value: "soon" },
];
const terminationOptions = [
  { label: "Terminated", value: "terminated" },
  { label: "To be terminated", value: "scheduled" },
];

const sortOptions = [
  { label: "Full name", value: "fullName" },
  { label: "Occupation", value: "occupation" },
  { label: "Department", value: "department" },
  { label: "Date of employment", value: "dateOfEmployment" },
  { label: "Termination date", value: "terminationDate" },
];
function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 1 ? -1 : 1;
}

const hasActiveFilters = computed(() => {
  const f = filters.value;
  return Boolean(f.search || f.occupation || f.department || f.employmentStatus || f.terminationStatus);
});
function clearFilters() {
  const f = filters.value;
  f.search = "";
  f.occupation = "";
  f.department = "";
  f.employmentStatus = null;
  f.terminationStatus = null;
}

// FloatLabel ties each control to its label by id.
const searchId = useId();
const occupationId = useId();
const departmentId = useId();
const employmentId = useId();
const terminationId = useId();
</script>

<template>
  <div class="rounded-2xl border bg-white px-4 py-3">
    <!-- One row on desktop; controls stack on narrow screens. Floating labels stand in for placeholders. -->
    <div class="flex flex-wrap items-center gap-3 body-sm">
      <FloatLabel variant="on" class="w-full sm:w-44">
        <InputText :id="searchId" v-model="filters.search" size="small" fluid />
        <label :for="searchId">Search</label>
      </FloatLabel>

      <FloatLabel variant="on" class="w-full sm:w-36">
        <InputText :id="occupationId" v-model="filters.occupation" size="small" fluid />
        <label :for="occupationId">Occupation</label>
      </FloatLabel>

      <FloatLabel variant="on" class="w-full sm:w-36">
        <InputText :id="departmentId" v-model="filters.department" size="small" fluid />
        <label :for="departmentId">Department</label>
      </FloatLabel>

      <FloatLabel variant="on" class="w-full sm:w-44">
        <Select
          :input-id="employmentId"
          v-model="filters.employmentStatus"
          :options="employmentOptions"
          option-label="label"
          option-value="value"
          show-clear
          size="small"
          fluid
        />
        <label :for="employmentId">Employment</label>
      </FloatLabel>

      <FloatLabel variant="on" class="w-full sm:w-44">
        <Select
          :input-id="terminationId"
          v-model="filters.terminationStatus"
          :options="terminationOptions"
          option-label="label"
          option-value="value"
          show-clear
          size="small"
          fluid
        />
        <label :for="terminationId">Termination</label>
      </FloatLabel>

      <div class="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto sm:flex-nowrap">
        <label class="label shrink-0">Order by:</label>
        <Select
          v-model="sortField"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          size="small"
          class="grow min-w-32 sm:w-40 sm:grow-0"
        />
        <Button
          :icon="sortOrder === 1 ? 'pi pi-sort-amount-up-alt' : 'pi pi-sort-amount-down-alt'"
          :aria-label="sortOrder === 1 ? 'Sort ascending' : 'Sort descending'"
          outlined
          size="small"
          severity="secondary"
          class="shrink-0"
          @click="toggleSortOrder"
        />
        <Button
          label="Clear"
          icon="pi pi-times"
          size="small"
          severity="danger"
          class="shrink-0"
          :disabled="!hasActiveFilters"
          @click="clearFilters"
        />
      </div>
    </div>
  </div>
</template>
