<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal">
        <button class="close-btn" @click="close">X</button>
        <h2>{{ animal.name }} ({{ animal.species }})</h2>
        <p>
          Monthly Food Requirement:
          <strong>{{ monthlyFood }} kg</strong>
        </p>

        <h3 class="mt-4 font-bold">Feeding Schedule (Next 30 Days)</h3>
        <ul>
          <li v-for="(entry, index) in feedingSchedule" :key="index">
            <strong>{{ entry.date }}</strong>: {{ entry.name }}, {{ entry.fruit }}, {{ entry.amount }} kg
          </li>
        </ul>
      </div>
    </div>
  </template>

  <script lang="ts" setup>
  import { computed, defineProps, defineEmits } from "vue"
  import type { Animal } from "~/types"
  import useCalculateAgeInYears from "~/utils/useCalculateAgeInYears"

  const props = defineProps<{ animal: Animal }>()
  const emit = defineEmits<{ (e: 'close'): void }>()

  const age = computed(() => {
    if (props.animal.birthdate) {
      return useCalculateAgeInYears(new Date(props.animal.birthdate))
    }
    return 0
  })

  // Core food logic used for both daily and monthly
  const dailyFood = computed(() => {
    const { species, height, weight, favouriteFruit, gender } = props.animal

    if (species.toLowerCase() === "fish") return 0

    const safeHeight = typeof height === "number" ? height : 0
    const safeWeight = typeof weight === "number" ? weight : 0
    let food = (safeHeight + safeWeight) / 250

    const calculatedAge = age.value
    if (calculatedAge > 20) food /= 2
    else if (calculatedAge < 2) food *= 2

    if (
      favouriteFruit &&
      (favouriteFruit.toLowerCase() === "cherry" || favouriteFruit.toLowerCase() === "cherries")
    ) {
      food += 28
    }

    if (gender.toLowerCase() === "male") food *= 1.2

    return parseFloat(food.toFixed(2))
  })

  const monthlyFood = computed(() => (dailyFood.value * 30).toFixed(2))

  // Generate feeding schedule for the next 30 days
  const feedingSchedule = computed(() => {
    const today = new Date()
    const schedule = []

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const formatted = date.toLocaleDateString("de-DE") // Format as dd.mm.yyyy
      schedule.push({
        date: formatted,
        name: props.animal.name,
        fruit: props.animal.favouriteFruit || "Unknown",
        amount: dailyFood.value.toFixed(2),
      })
    }

    return schedule
  })

  const close = () => {
    emit("close")
  }
  </script>

  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
  }

  .close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    background: none;
    border: none;
    font-size: 16px;
  }
  </style>
