<script setup lang="ts">
import { format } from "date-fns";
import { createEmployeeSchema, type CreateEmployeeDto, type Employee } from "@/types/employee";

const props = defineProps<{
  submitting: boolean;
  // When set, the form opens pre-filled for editing; left out, it's a blank create form.
  initial?: Employee | null;
}>();

const emit = defineEmits<{
  submit: [values: CreateEmployeeDto];
  cancel: [];
}>();

// Text fields are plain strings; the two dates are Date objects for the DatePicker.
// Seed from `initial` when editing, otherwise start blank.
const form = reactive({
  code: props.initial?.code ?? "",
  fullName: props.initial?.fullName ?? "",
  occupation: props.initial?.occupation ?? "",
  department: props.initial?.department ?? "",
  dateOfEmployment: props.initial?.dateOfEmployment ? new Date(props.initial.dateOfEmployment) : null,
  terminationDate: props.initial?.terminationDate ? new Date(props.initial.terminationDate) : null,
});

const errors = ref<Record<string, string>>({});

// Don't nag before the first Save. Once they've tried, keep errors in sync as they type/fix.
const submitted = ref(false);
watch(form, () => {
  if (submitted.value) validate();
});

// Shape the form into the API payload: dates become yyyy-MM-dd strings the server can coerce.
function toPayload() {
  return {
    code: form.code,
    fullName: form.fullName,
    occupation: form.occupation,
    department: form.department,
    dateOfEmployment: form.dateOfEmployment ? format(form.dateOfEmployment, "yyyy-MM-dd") : "",
    terminationDate: form.terminationDate ? format(form.terminationDate, "yyyy-MM-dd") : undefined,
  };
}

// Run the shared schema and flatten any issues into a fresh field -> message map.
function validate(): CreateEmployeeDto | null {
  const result = createEmployeeSchema.safeParse(toPayload());

  const next: Record<string, string> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (!next[field]) next[field] = issue.message;
    }
  }
  errors.value = next;

  return result.success ? result.data : null;
}

function onSubmit() {
  submitted.value = true;
  const values = validate();
  if (values) emit("submit", values);
}
</script>

<template>
  <form class="rounded-2xl border body-sm bg-white p-6 md:p-8" @submit.prevent="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <LabeledField v-slot="{ id }" label="Code" required :error="errors.code">
        <InputText :id="id" v-model="form.code" :invalid="!!errors.code" fluid />
      </LabeledField>

      <LabeledField v-slot="{ id }" label="Full Name" required :error="errors.fullName">
        <InputText :id="id" v-model="form.fullName" :invalid="!!errors.fullName" fluid />
      </LabeledField>

      <LabeledField v-slot="{ id }" label="Occupation" required :error="errors.occupation">
        <InputText :id="id" v-model="form.occupation" :invalid="!!errors.occupation" fluid />
      </LabeledField>

      <LabeledField v-slot="{ id }" label="Department" required :error="errors.department">
        <InputText :id="id" v-model="form.department" :invalid="!!errors.department" fluid />
      </LabeledField>

      <LabeledField v-slot="{ id }" label="Date of Employment" required :error="errors.dateOfEmployment">
        <DatePicker v-model="form.dateOfEmployment" :input-id="id" date-format="yy-mm-dd" show-icon fluid :invalid="!!errors.dateOfEmployment" />
      </LabeledField>

      <LabeledField v-slot="{ id }" label="Termination Date" :error="errors.terminationDate">
        <DatePicker v-model="form.terminationDate" :input-id="id" date-format="yy-mm-dd" show-icon fluid />
      </LabeledField>
    </div>

    <div class="mt-8 flex justify-end gap-3 border-t pt-6">
      <Button label="Cancel" severity="secondary" outlined :disabled="submitting" @click="emit('cancel')" />
      <Button type="submit" label="Save" :loading="submitting" />
    </div>
  </form>
</template>
