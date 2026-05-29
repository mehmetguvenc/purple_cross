<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { employees } from "@/lib/employees";
import type { Employee, ListEmployeesQuery } from "@/types/employee";

// All list state lives here, not in the page.
const query = reactive({
  page: 1,
  pageSize: 20,
  search: "",
  orderBy: "fullName" as NonNullable<ListEmployeesQuery["orderBy"]>,
  sortOrder: "asc" as NonNullable<ListEmployeesQuery["sortOrder"]>,
});

// Server rejects a blank search, so only send it when there's text.
function params(): ListEmployeesQuery {
  const p: ListEmployeesQuery = {
    page: query.page,
    pageSize: query.pageSize,
    orderBy: query.orderBy,
    sortOrder: query.sortOrder,
  };
  if (query.search) p.search = query.search;
  return p;
}

// Lazy so the page isn't blocked while loading.
const { data, pending, error, refresh } = useLazyAsyncData("employees-list", () => employees.list(params()), {
  // refetches whenever the query changes
  watch: [query],
});

function onSearch(value: string) {
  query.search = value;
  query.page = 1; // a new search starts from page one
}
function onPageChange(e: { page: number; pageSize: number }) {
  query.page = e.page;
  query.pageSize = e.pageSize;
}
function onSortChange(e: { field: string; order: "asc" | "desc" }) {
  query.orderBy = e.field as typeof query.orderBy;
  query.sortOrder = e.order;
}

const confirm = useConfirm();
const toast = useToast();

function onView(emp: Employee) {
  navigateTo(`/employees/${emp.id}`);
}
function onEdit(emp: Employee) {
  navigateTo(`/employees/${emp.id}?edit=1`);
}
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
</script>

<template>
  <section class="p-2 md:p-4">
    <h1 class="heading-2 mb-6">Employees</h1>

    <div v-if="error" class="body-sm rounded-lg border bg-surface-muted p-6 text-foreground-muted">
      Something went wrong while loading employees.
    </div>

    <EmployeeTable
      v-else
      :employees="data?.items ?? []"
      :loading="pending"
      :total="data?.meta.total ?? 0"
      :page="query.page"
      :page-size="query.pageSize"
      :sort-field="query.orderBy"
      :sort-order="query.sortOrder"
      @search="onSearch"
      @page-change="onPageChange"
      @sort-change="onSortChange"
      @view="onView"
      @edit="onEdit"
      @remove="onRemove"
    />

    <!-- Case study: create button pinned to the bottom-right corner. -->
    <Button
      icon="pi pi-plus"
      label="New Employee"
      rounded
      class="fixed bottom-8 right-8 shadow-lg"
      @click="navigateTo('/employees/create')"
    />

    <Toast />
    <ConfirmDialog />
  </section>
</template>
