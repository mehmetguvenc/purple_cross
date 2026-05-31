<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { employees } from "@/lib/employees";
import type { CreateEmployeeDto } from "@/types/employee";

const route = useRoute();
const id = Number(route.params.id);

// Load the employee this page edits; the form fills from it.
const { data: employee, pending } = useLazyAsyncData(`employee-${id}`, () => employees.get(id));

const toast = useToast();
const submitting = ref(false);

async function onSubmit(values: CreateEmployeeDto) {
  submitting.value = true;
  try {
    await employees.update(id, values);
    toast.add({ severity: "success", summary: "Employee updated", detail: `${values.fullName} was saved`, life: 3000 });
    navigateTo("/employees");
  } catch {
    toast.add({ severity: "error", summary: "Could not update employee", detail: "Please try again", life: 4000 });
    submitting.value = false;
  }
}

function onCancel() {
  navigateTo("/employees");
}
</script>

<template>
  <section class="p-2 md:p-4">
    <h1 class="heading-2 mb-6">Edit Employee</h1>

    <div v-if="pending" class="body-sm rounded-lg border bg-surface-muted p-6 text-foreground-muted">
      Loading employee…
    </div>
    <EmployeeForm
      v-else-if="employee"
      :initial="employee"
      :submitting="submitting"
      @submit="onSubmit"
      @cancel="onCancel"
    />

    <Toast />
  </section>
</template>
