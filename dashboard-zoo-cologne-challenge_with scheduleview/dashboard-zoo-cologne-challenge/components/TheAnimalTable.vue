<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Animal } from '~/types'
import useCalculateAgeInYears from '~/utils/useCalculateAgeInYears'
import FoodPopup from '~/components/FoodPopup.vue'

const props = defineProps<{
  animals: Animal[]
}>()

// Sort animals by weight (or adjust as needed)
const animalsSortedByName = computed(() =>
  props.animals.slice().sort((a, b) => a.weight - b.weight)
)

// Reactive variable for the selected animal (for the FoodPopup)
const selectedAnimal = ref<Animal | null>(null)

// Function to open/close the popup
const openPopup = (animal: Animal) => {
  selectedAnimal.value = animal
}
const closePopup = () => {
  selectedAnimal.value = null
}

// Emit openSchedule event so that App.vue toggles the view
const emit = defineEmits<{ (e: 'openSchedule'): void }>()
const goToFeedingSchedule = () => {
  emit('openSchedule')
}
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Index</th>
          <th>Species</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Age (yrs)</th>
          <th>Weight (kg)</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(animal, animalIndex) in animalsSortedByName"
          :key="animal.name"
          @click="openPopup(animal)"
          style="cursor: pointer;"
        >
          <td>{{ animalIndex + 1 }}</td>
          <td>{{ animal.species }}</td>
          <td>{{ animal.name }}</td>
          <td>{{ animal.gender }}</td>
          <td>{{ useCalculateAgeInYears(new Date(animal.birthdate)) }}</td>
          <td>{{ animal.weight }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Render FoodPopup if an animal is selected -->
    <FoodPopup
      v-if="selectedAnimal"
      :animal="selectedAnimal"
      @close="closePopup"
    />

    <!-- Button to open Feeding Schedule -->
    <div style="text-align: center; margin-top: 2rem;">
      <button @click="goToFeedingSchedule" class="btn-schedule">
        Go to Feeding Schedule
      </button>
    </div>
  </div>
</template>

<style scoped>
table {
  @apply table-auto w-full text-left;
}
td {
  @apply w-40;
}
tr {
  @apply border-b-2;
}
tbody tr {
  @apply hover:bg-gray-200;
}
.btn-schedule {
  background-color: #3490dc;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.btn-schedule:hover {
  background-color: #2779bd;
}
</style>
