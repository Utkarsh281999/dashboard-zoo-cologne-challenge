<template>
    <div class="schedule-page">
      <h1>Feeding Schedule</h1>

      <!-- Date Picker -->
      <div class="date-picker">
        <label>
          Select Date:
          <input type="date" v-model="selectedDate" />
        </label>
      </div>

      <!-- Time Slots and Feeding Tasks -->
      <div class="time-slots">
        <div v-for="time in timeSlots" :key="time" class="timeslot">
          <h3>{{ time }}</h3>
          <!-- Render tasks for this time slot on the selected date -->
          <div v-for="(task, index) in scheduleByTime(time)" :key="index" class="task">
            <!-- Animal Dropdown: list of animals from props.animals -->
            <select v-model="task.animalName">
              <option disabled value="">Select Animal</option>
              <!-- Use the sorted animals list for display -->
              <option v-for="animal in animalsSortedByName"
                      :key="animal.name"
                      :value="animal.name">
                {{ animal.name }} ({{ animal.species }})
              </option>
            </select>
            <!-- Fruit Input -->
            <input v-model="task.fruit" placeholder="Fruit" />
            <!-- Display the calculated food for this task -->
            <span class="calc-food">
              Food: {{ calculateFood(task) }} kg
            </span>
            <!-- Remove Task Button -->
            <button @click="removeTask(time, index)" class="btn-remove">
              Remove
            </button>
          </div>
          <!-- Add Task Button for this timeslot -->
          <button @click="addTask(time)" class="btn-add">
            + Add Feeding Task
          </button>
        </div>
      </div>

      <!-- Save Schedule Button -->
      <button @click="saveSchedule" class="btn-save">
        Save Schedule
      </button>

      <!-- Overview Section: Grouped Tasks by date & time -->
      <div class="overview">
        <h2>Upcoming Feeding Tasks</h2>
        <div v-if="schedule[selectedDate]">
          <div
            v-for="(tasks, time) in schedule[selectedDate]"
            :key="time"
            class="overview-slot"
          >
            <h3>{{ selectedDate }} - {{ time }}</h3>
            <ul>
              <li v-for="(task, index) in tasks" :key="index">
                {{ getAnimalName(task.animalName) }},
                {{ task.fruit || '(default fruit)' }},
                {{ calculateFood(task) }} kg
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p>No scheduled feedings for {{ selectedDate }}.</p>
        </div>
      </div>
    </div>
  </template>

  <script lang="ts" setup>
  import { ref, computed } from 'vue'
  import type { Animal } from '~/types'

  // Expect animal data as a prop
  const props = defineProps<{ animals: Animal[] }>()

  // Reuse sorting logic from TheAnimalTable.vue but now using name as unique identifier
  const animalsSortedByName = computed(() =>
    props.animals.slice().sort((a, b) => a.weight - b.weight)
  )

  // Update Task interface to use animalName instead of animalId
  interface Task {
    animalName: string;
    fruit: string;
  }

  // Schedule object: keys are dates, then time slots, with an array of tasks per slot.
  const schedule = ref<Record<string, Record<string, Task[]>>>({})

  // The selected date for scheduling (default to today, format "YYYY-MM-DD")
  const selectedDate = ref(new Date().toISOString().split('T')[0])

  // Define hourly timeslots (customize as needed)
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ]

  // Return the list of tasks for a given time slot on the selected date
  const scheduleByTime = (time: string) => {
    if (!schedule.value[selectedDate.value]) return []
    return schedule.value[selectedDate.value][time] || []
  }

  // Add a new task to a specified time slot.
  const addTask = (time: string) => {
    if (!schedule.value[selectedDate.value]) {
      schedule.value[selectedDate.value] = {}
    }
    if (!schedule.value[selectedDate.value][time]) {
      schedule.value[selectedDate.value][time] = []
    }
    schedule.value[selectedDate.value][time].push({ animalName: '', fruit: '' })
  }

  // Remove a task from a time slot.
  const removeTask = (time: string, index: number) => {
    if (schedule.value[selectedDate.value] && schedule.value[selectedDate.value][time]) {
      schedule.value[selectedDate.value][time].splice(index, 1)
    }
  }

  // Food Calculation Logic per day (from previous requirements):
  // 1. Base daily food = (height + weight) / 250.
  // 2. If age > 20, half the food; if age < 2, double the food.
  // 3. If the fruit (scheduled or animal's default) is cherry/cherries, add 28 kg.
  // 4. If the animal is male, add 20%.
  const calculateFood = (task: Task): string => {
    // Find the animal using its name (as unique identifier)
    const animal = props.animals.find(a => a.name === task.animalName)
    if (!animal) return "0.00"

    // Calculate age in whole years
    const birthDate = new Date(animal.birthdate)
    const today = new Date()
    let ageYears = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      ageYears--
    }

    // Use safe values for height and weight
    const safeHeight = typeof animal.height === 'number' ? animal.height : 0
    const safeWeight = typeof animal.weight === 'number' ? animal.weight : 0

    let dailyFood = (safeHeight + safeWeight) / 250
    if (ageYears > 20) dailyFood /= 2
    else if (ageYears < 2) dailyFood *= 2

    // Use the fruit provided in the task, or fall back to animal's favouriteFruit if not provided
    const fruitUsed = (task.fruit && task.fruit.trim() !== "") ? task.fruit : (animal.favouriteFruit || "")
    if (fruitUsed.toLowerCase() === "cherry" || fruitUsed.toLowerCase() === "cherries") {
      dailyFood += 28
    }
    if (animal.gender.toLowerCase() === "male") dailyFood *= 1.2

    return dailyFood.toFixed(2)
  }

  // Helper: Get the animal's name (trivially returning task.animalName or looking up further details if needed).
  const getAnimalName = (animalName: string): string => {
    const animal = props.animals.find(a => a.name === animalName)
    return animal ? animal.name : "Unknown"
  }

  // Save schedule handler (for demonstration, just logs to console)
  const saveSchedule = () => {
    console.log("Saved Schedule:", schedule.value)
    alert("Schedule saved successfully!")
  }
  </script>

  <style scoped>
  .schedule-page {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .date-picker {
    margin-bottom: 1rem;
  }

  .time-slots {
    margin-bottom: 2rem;
  }

  .timeslot {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
  }

  .timeslot h3 {
    margin-bottom: 0.5rem;
  }

  .task {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .task select,
  .task input {
    padding: 0.25rem;
  }

  .btn-add,
  .btn-remove,
  .btn-save {
    background-color: #38c172;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .btn-remove {
    background-color: #e3342f;
  }

  .overview {
    margin-top: 2rem;
    border-top: 1px solid #ccc;
    padding-top: 1rem;
  }

  .overview-slot {
    margin-bottom: 1rem;
  }
  </style>
