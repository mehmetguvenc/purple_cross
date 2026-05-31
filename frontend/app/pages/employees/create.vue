<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { employees } from "@/lib/employees";
import type { CreateEmployeeDto } from "@/types/employee";

const toast = useToast();
const submitting = ref(false);

async function onSubmit(values: CreateEmployeeDto) {
  submitting.value = true;
  try {
    await employees.create(values);
    toast.add({ severity: "success", summary: "Employee created", detail: `${values.fullName} was added`, life: 3000 });
    navigateTo("/employees");
  } catch {
    toast.add({ severity: "error", summary: "Could not create employee", detail: "Please try again", life: 4000 });
    submitting.value = false;
  }
}

function onCancel() {
  navigateTo("/employees");
}
</script>

<template>
  <section class="p-2 md:p-4">
    <h1 class="heading-2 mb-6">New Employee</h1>
    <EmployeeForm :submitting="submitting" @submit="onSubmit" @cancel="onCancel" />
    <Toast />
  </section>
</template>
