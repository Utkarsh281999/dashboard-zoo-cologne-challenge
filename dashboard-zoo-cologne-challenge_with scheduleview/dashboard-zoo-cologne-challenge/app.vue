<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TheAnimalTable from '~/components/TheAnimalTable.vue'
import SchedulePage from '@/components/SchedulePage.vue'
import useAnimals from '~/composables/useAnimals'

const { animals } = useAnimals()

// View state to toggle between animal table and feeding schedule
const currentView = ref<'table' | 'schedule'>('table')

onMounted(() => {
  alert('get wrecked cologne zoo!')
})
</script>

<template>
  <div class="my-10 container mx-auto">
    <h1 class="text-4xl">
      Cologne Zoo
    </h1>
    <div class="my-2">
      <p>
        This is the overview board of the Cologne Zoo. It can be used by zookeepers to get an overview of the animals and their relevant health data.
      </p>
      <p>
        Please contact the zoo admin at "admin [at] zoo-cologne [dot] de" for support with the dashboard. Cyber-Attacks from the Duisburg Zoo have become more frequent on the past, so be on the lookout.
      </p>
    </div>
    <div class="mt-6 py-4 border-t border-gray-300">
      <h2 class="text-2xl">
        Our (lovely) Animals:
      </h2>
    </div>

    <!-- Toggle view button -->
    <div class="my-4">
      <button
        @click="currentView = currentView === 'table' ? 'schedule' : 'table'"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {{ currentView === 'table' ? 'Go to Feeding Schedule' : 'Back to Animal Overview' }}
      </button>
    </div>

    <!-- Conditionally render based on view -->
    <TheAnimalTable v-if="currentView === 'table' && animals" :animals="animals" />
    <SchedulePage v-else-if="currentView === 'schedule' && animals" :animals="animals" />
  </div>
</template>
