<script setup lang="ts">
import { employees } from "@/lib/employees";

// useLazyAsyncData is used instead of useAsyncData to prevent SSR blocking on this page
const { data, pending, error } = await useLazyAsyncData("emp", () => employees.list({ page: 1, pageSize: 10 }));
</script>

<template>
  <div class="p-10">
    <h1 class="mb-4 text-xl font-semibold border-b pb-4">Employees</h1>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error while fetching employees...</div>
    <table v-else-if="data" class="w-full border-collapse text-left">
      <thead>
        <tr>
          <th class="border-b p-2">ID</th>
          <th class="border-b p-2">Name</th>
          <th class="border-b p-2">Code</th>
          <th class="border-b p-2">Department</th>
          <th class="border-b p-2">Occupation</th>
          <th class="border-b p-2">Date of Employment</th>
          <th class="border-b p-2">Termination Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in data.items" :key="employee.id">
          <td class="border-b p-2">{{ employee.id }}</td>
          <td class="border-b p-2">{{ employee.fullName }}</td>
          <td class="border-b p-2">{{ employee.code }}</td>
          <td class="border-b p-2">{{ employee.department }}</td>
          <td class="border-b p-2">{{ employee.occupation }}</td>
          <td class="border-b p-2">{{ employee.dateOfEmployment }}</td>
          <td class="border-b p-2">{{ employee.terminationDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
