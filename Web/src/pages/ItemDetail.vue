<template>
  <div class="p-6" style="background-color: #fff9e5; min-height: 100vh">
    <h1 class="text-xl font-semibold" style="color: #004030">
      {{ item.name }}
    </h1>

    <div class="mt-4 flex gap-4">
      <button
        class="text-white px-4 py-2 rounded hover:opacity-90"
        style="background-color: #4a9782"
        @click="openModal('IN')"
      >
        Stock In
      </button>
      <button
        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        @click="openModal('OUT')"
      >
        Stock Out
      </button>
    </div>

    <h2 class="mt-6 font-semibold">Movements</h2>

    <table class="w-full bg-white shadow mt-2">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 text-left">Type</th>
          <th class="p-2 text-left">Qty</th>
          <th class="p-2 text-left">Reason</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="m in movements" :key="m.id" class="border-b">
          <td class="p-2">{{ m.movementType }}</td>
          <td class="p-2">{{ m.quantity }}</td>
          <td class="p-2">{{ m.reason }}</td>
        </tr>
      </tbody>
    </table>

    <StockMovementModal
      v-if="showModal"
      :type="modalType"
      :itemId="itemId"
      @close="showModal = false"
      @saved="fetchMovements"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/api";
import { useRoute } from "vue-router";
import StockMovementModal from "./StockMovementModal.vue";

const route = useRoute();
const itemId = route.params.id;

const item = ref({});
const movements = ref([]);

const showModal = ref(false);
const modalType = ref("IN");

const openModal = (type) => {
  modalType.value = type;
  showModal.value = true;
};

const fetchItem = async () => {
  const res = await api.get(`/items/${itemId}`);
  item.value = res.data;
};

const fetchMovements = async () => {
  const res = await api.get(`/items/${itemId}/movements`);
  movements.value = res.data;
};

onMounted(() => {
  fetchItem();
  fetchMovements();
});
</script>
