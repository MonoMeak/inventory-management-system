<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-lg font-bold mb-4">
        {{ type }} Stock
      </h2>

      <input v-model="qty" type="number" class="w-full border p-2 rounded mb-3" placeholder="Quantity" />
      <input v-model="reason" class="w-full border p-2 rounded mb-3" placeholder="Reason" />

      <div class="flex justify-end gap-2 mt-4">
        <button class="px-4 py-2 bg-gray-300 rounded" @click="$emit('close')">
          Cancel
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded" @click="saveMovement">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../api/api";

const props = defineProps({
  type: String,
  itemId: String,
});

const emit = defineEmits(["close", "saved"]);

const qty = ref(0);
const reason = ref("");

const saveMovement = async () => {
  await api.post(`/items/${props.itemId}/movements`, {
    quantity: parseInt(qty.value),
    reason: reason.value,
    movementType: props.type
  });

  emit("close");
  emit("saved");
};
</script>
