<script setup>
import { useRoute, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
</script>

<template>
  <Navbar v-if="route.path !== '/admin'" />
  <RouterView />
</template>