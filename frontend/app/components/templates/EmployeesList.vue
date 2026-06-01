<script setup lang="ts">
import { format } from "date-fns";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { employees } from "@/lib/employees";
import type { Employee, EmployeeFilterValues, ListEmployeesQuery } from "@/types/employee";

// Filter, sort and page state. The filter bar drives the filters/sort; the table drives the page.
const filters = ref<EmployeeFilterValues>({
  search: "",
  occupation: "",
  department: "",
  employmentStatus: null,
  terminationStatus: null,
});
const sortField = ref("fullName");
const sortOrder = ref(1);
const page = ref(1);
const pageSize = ref(20);

// Only send the params the server cares about; skip the empty ones.
function params(): ListEmployeesQuery {
  const { search, occupation, department, employmentStatus, terminationStatus } = filters.value;
  const query: ListEmployeesQuery = {
    page: page.value,
    pageSize: pageSize.value,
    orderBy: sortField.value as ListEmployeesQuery["orderBy"],
    sortOrder: sortOrder.value === 1 ? "asc" : "desc",
  };
  if (search) query.search = search;
  if (occupation) query.occupation = occupation;
  if (department) query.department = department;
  if (employmentStatus) query.employmentStatus = employmentStatus;
  if (terminationStatus) query.terminationStatus = terminationStatus;
  return query;
}

const { data, pending, error, refresh } = useLazyAsyncData("employees-list", () => employees.list(params()));

// A new filter or sort starts back at page one.
watch([filters, sortField, sortOrder], () => { page.value = 1; }, { deep: true });

// Refetch on any change, debounced so typing doesn't fire a request per keystroke.
let timer: ReturnType<typeof setTimeout>;
watch(() => params(), () => {
  clearTimeout(timer);
  timer = setTimeout(refresh, 300);
});

function onPageChange(e: { page: number; pageSize: number }) {
  page.value = e.page;
  pageSize.value = e.pageSize;
}

const confirm = useConfirm();
const toast = useToast();

// View opens a dialog from the row we already have, no refetch.
const selected = ref<Employee | null>(null);
function onView(emp: Employee) {
  selected.value = emp;
}
function onEdit(emp: Employee) {
  navigateTo(`/employees/${emp.id}?edit=1`);
}

// Dates come back as full ISO timestamps; show only the day, with a dash when empty.
function formatDate(value: string | null) {
  return value ? format(new Date(value), "d MMM yyyy") : "—";
}

// Label/value pairs for the view dialog, rebuilt whenever the selected row changes.
const details = computed(() => {
  const employee = selected.value;
  if (!employee) return [];
  return [
    { label: "Code", value: employee.code },
    { label: "Full name", value: employee.fullName },
    { label: "Occupation", value: employee.occupation },
    { label: "Department", value: employee.department },
    { label: "Date of employment", value: formatDate(employee.dateOfEmployment) },
    { label: "Termination date", value: formatDate(employee.terminationDate) },
  ];
});

function onRemove(emp: Employee) {
  confirm.require({
    header: "Delete employee",
    message: `Delete ${emp.fullName}? This can't be undone.`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "Cancel", severity: "secondary", outlined: true },
    acceptProps: { label: "Delete", severity: "danger" },
    accept: async () => {
      try {
        await employees.remove(emp.id);
        toast.add({ severity: "success", summary: "Deleted", detail: `${emp.fullName} removed`, life: 3000 });
        await refresh();
      } catch {
        toast.add({ severity: "error", summary: "Delete failed", detail: "Please try again", life: 3000 });
      }
    },
  });
}

// Export with the current filters and sort, without pagination.
function onExport() {
  const query = params();
  delete query.page;
  delete query.pageSize;
  const link = document.createElement("a");
  link.href = employees.exportUrl(query);
  link.click();
}

// Hidden input behind the styled button.
const fileInput = ref<HTMLInputElement | null>(null);

async function onImport(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const text = await file.text();
  try {
    const result = await employees.importCsv(text);
    toast.add({
      severity: "success",
      summary: "Import complete",
      detail: `${result.created} added, ${result.updated} updated, ${result.skipped} skipped`,
      life: 4000,
    });
    await refresh();
  } catch {
    toast.add({ severity: "error", summary: "Import failed", detail: "Check the file and try again", life: 3000 });
  }
  // Reset so the same file can be picked again.
  input.value = "";
}
</script>

<template>
  <section class="p-2 md:p-4">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="heading-2">Employees</h1>

      <div class="flex gap-2">
        <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="onImport">
        <Button label="Import CSV" icon="pi pi-upload" severity="primary" size="small" @click="fileInput?.click()" />
        <Button label="Export CSV" icon="pi pi-download" severity="primary" size="small" @click="onExport" />
      </div>
    </div>

    <div v-if="error" class="body-sm rounded-lg border bg-surface-muted p-6 text-foreground-muted">
      Something went wrong while loading employees.
    </div>

    <div v-else class="flex flex-col gap-4">
      <EmployeeFilterBar
        v-model:filters="filters"
        v-model:sort-field="sortField"
        v-model:sort-order="sortOrder"
      />

      <EmployeeTable
        :employees="data?.items ?? []"
        :loading="pending"
        :total="data?.meta.total ?? 0"
        :page="page"
        :page-size="pageSize"
        @page-change="onPageChange"
        @view="onView"
        @edit="onEdit"
        @remove="onRemove"
      />
    </div>

    <!-- Create button, pinned bottom right. -->
    <Button
    size="large"
      rounded
      aria-label="New Employee"
      class="new-employee-fab fixed bottom-8 right-8 shadow-lg"
      @click="navigateTo('/employees/create')"
    >
      <span class="fab-label">New Employee</span>
      <i class="pi pi-plus" />
    </Button>

    <Dialog
      :visible="selected !== null"
      modal
      dismissable-mask
      :draggable="false"
      header="Employee details"
      class="max-w-[92vw]"
      :style="{ width: '28rem' }"
      @update:visible="selected = null"
    >
      <dl class="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 body-sm">
        <template v-for="row in details" :key="row.label">
          <dt class="caption">{{ row.label }}</dt>
          <dd class="text-foreground">{{ row.value }}</dd>
        </template>
      </dl>

      <template #footer>
        <Button label="Close" severity="secondary" outlined @click="selected = null" />
      </template>
    </Dialog>

    <Toast />
    <ConfirmDialog />
  </section>
</template>

<style scoped>
/* Round when collapsed. The label reveals on hover. */
.new-employee-fab {
  gap: 0;
  height: 3.5rem;
  min-width: 3.5rem;
  padding-inline: 1.15rem;
  border-radius: 9999px;
}

.fab-label {
  display: inline-block;
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition:
    max-width 0.35s ease,
    margin-right 0.35s ease;
}

.new-employee-fab:hover .fab-label,
.new-employee-fab:focus-visible .fab-label {
  max-width: 10rem;
  margin-right: 0.5rem;
}
</style>
