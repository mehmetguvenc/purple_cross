<script setup lang="ts">
import { isFuture } from "date-fns";
import type { Employee } from "@/types/employee";

defineProps<{
  employees: Employee[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  pageChange: [payload: { page: number; pageSize: number }];
  view: [employee: Employee];
  edit: [employee: Employee];
  remove: [employee: Employee];
}>();

// Date shown as a status label (current vs upcoming), not the raw date.
function employmentStatus(date: string | null) {
  if (!date) return null;
  return isFuture(new Date(date))
    ? { label: "Employed soon", tone: "info" as const }
    : { label: "Currently employed", tone: "success" as const };
}
function terminationStatus(date: string | null) {
  if (!date) return null;
  return isFuture(new Date(date))
    ? { label: "To be terminated", tone: "warn" as const }
    : { label: "Terminated", tone: "danger" as const };
}

// Lazy: the server already did the filtering, sorting and paging, so we just show the page.
function onPage(event: { page: number; rows: number }) {
  emit("pageChange", { page: event.page + 1, pageSize: event.rows });
}
</script>

<template>
  <DataTable
    :value="employees"
    :loading="loading"
    lazy
    paginator
    data-key="id"
    :rows="pageSize"
    :first="(page - 1) * pageSize"
    :total-records="total"
    :rows-per-page-options="[10, 20, 50]"
    :pt="{
      column: {
        columnTitle: { class: 'caption' },
        bodyCell: { class: 'body-sm' },
      },
    }"
    @page="onPage"
  >
    <Column field="fullName" header="Full Name" />
    <Column field="occupation" header="Occupation" />
    <Column field="department" header="Department" />

    <Column field="dateOfEmployment" header="Date of Employment">
      <template #body="{ data }">
        <StatusTag
          v-if="employmentStatus(data.dateOfEmployment)"
          v-bind="employmentStatus(data.dateOfEmployment)!"
        />
        <span v-else class="text-foreground-subtle">—</span>
      </template>
    </Column>

    <Column field="terminationDate" header="Termination Date">
      <template #body="{ data }">
        <StatusTag
          v-if="terminationStatus(data.terminationDate)"
          v-bind="terminationStatus(data.terminationDate)!"
        />
        <span v-else class="text-foreground-subtle">—</span>
      </template>
    </Column>

    <Column header="" class="w-1">
      <template #body="{ data }">
        <div class="flex justify-end gap-1">
          <Button icon="pi pi-eye" text rounded severity="secondary" aria-label="View" @click="emit('view', data)" />
          <Button icon="pi pi-pencil" text rounded severity="secondary" aria-label="Edit" @click="emit('edit', data)" />
          <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Delete" @click="emit('remove', data)" />
        </div>
      </template>
    </Column>

    <template #empty>
      <div class="body-sm py-12 text-center text-foreground-muted">No employees found</div>
    </template>
  </DataTable>
</template>

<style scoped>
/* Airy, clean table: white card, hairline row dividers, generous spacing.
   Header and cell typography come from the caption/body-sm classes (applied via :pt). */
.p-datatable {
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: #fff;
  overflow: hidden;
}

/* Keep every header and cell on a single line. Names like "Software Engineer"
   stay scannable instead of wrapping; when that makes the table wider than a
   phone, the container scrolls sideways rather than stacking the text. */
:deep(.p-datatable-thead > tr > th) {
  background: #fff;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--color-surface-muted);
  white-space: nowrap;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: var(--color-surface-strong);
}
</style>
