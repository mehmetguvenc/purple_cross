<script setup lang="ts">
import { isFuture } from "date-fns";
import type { Employee } from "@/types/employee";

// Dumb table: props in, events out. The template owns the query.
const props = defineProps<{
  employees: Employee[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: "asc" | "desc";
}>();

const emit = defineEmits<{
  search: [value: string];
  pageChange: [payload: { page: number; pageSize: number }];
  sortChange: [payload: { field: string; order: "asc" | "desc" }];
  view: [employee: Employee];
  edit: [employee: Employee];
  remove: [employee: Employee];
}>();

// DataTable is 0-based and uses 1/-1 for sort; our query is 1-based and asc/desc.
const first = computed(() => (props.page - 1) * props.pageSize);

// sort order, by default ascending
const primeSortOrder = computed(() => (props.sortOrder === "asc" ? 1 : -1));

// Debounced so query doesn't trigger on every keystroke
const searchText = ref("");
let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchText, (value) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => emit("search", value.trim()), 300);
});

function onPage(event: { page: number; rows: number }) {
  emit("pageChange", { page: event.page + 1, pageSize: event.rows });
}
function onSort(event: { sortField: string; sortOrder: number }) {
  emit("sortChange", { field: event.sortField, order: event.sortOrder === 1 ? "asc" : "desc" });
}

// Date shown as a status label, not the raw date. null = no date (cell shows a dash).
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
</script>

<template>
  <DataTable
    :value="employees"
    :loading="loading"
    lazy
    paginator
    data-key="id"
    :rows="pageSize"
    :first="first"
    :total-records="total"
    :rows-per-page-options="[10, 20, 50]"
    :sort-field="sortField"
    :sort-order="primeSortOrder"
    @page="onPage"
    @sort="onSort"
  >
    <template #header>
      <div class="flex justify-end">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchText"
            placeholder="Search name, department or occupation…"
            class="w-72"
          />
        </IconField>
      </div>
    </template>

    <Column field="fullName" header="Full Name" sortable />
    <Column field="occupation" header="Occupation" sortable />
    <Column field="department" header="Department" sortable />

    <Column field="dateOfEmployment" header="Date of Employment" sortable>
      <template #body="{ data }">
        <StatusTag
          v-if="employmentStatus(data.dateOfEmployment)"
          v-bind="employmentStatus(data.dateOfEmployment)!"
        />
        <span v-else class="text-foreground-subtle">—</span>
      </template>
    </Column>

    <Column field="terminationDate" header="Termination Date" sortable>
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
/* Airy, clean table: white card, bold dark headers, hairline row dividers, generous spacing. */
.p-datatable {
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: #fff;
  overflow: hidden;
}

:deep(.p-datatable-header) {
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 1.25rem;
}

:deep(.p-datatable-thead > tr > th) {
  background: #fff;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

:deep(.p-datatable-column-title) {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-foreground);
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
  color: var(--color-foreground-soft);
}

/* Keep the name on one line; it's the row's anchor. */
:deep(.p-datatable-tbody > tr > td:first-child) {
  white-space: nowrap;
  color: var(--color-foreground);
  font-weight: 500;
}

:deep(.p-datatable-tbody > tr) {
  transition: background-color 0.15s ease;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: var(--color-surface-muted);
}

/* Centered footer with circular page controls, like the reference. */
:deep(.p-datatable-paginator-bottom) {
  background: #fff;
  border-top: 1px solid var(--color-border);
  padding: 0.85rem;
}

:deep(.p-paginator-page),
:deep(.p-paginator-first),
:deep(.p-paginator-prev),
:deep(.p-paginator-next),
:deep(.p-paginator-last) {
  border-radius: 9999px;
}

:deep(.p-paginator-page-selected) {
  background: var(--color-primary);
  color: #fff;
}

:deep(.p-datatable-mask) {
  background: color-mix(in srgb, #fff 65%, transparent);
  backdrop-filter: blur(1px);
}
</style>
