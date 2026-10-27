<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLoggedIn = ref(
  Boolean(localStorage.getItem('token'))
)

watch(
  () => route.fullPath,
  () => {
    isLoggedIn.value = Boolean(
      localStorage.getItem('token')
    )
  }
)

const logoutUser = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  router.push('/login')
}
</script>
<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
    <div class="container">

      <!-- Logo -->
      <RouterLink class="navbar-brand fw-bold fs-4" to="/">
        <i class="bi bi-journal-richtext text-primary me-2"></i>
        Postly
      </RouterLink>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#userNavbar"
        aria-controls="userNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Links -->
      <div class="collapse navbar-collapse" id="userNavbar">

        <ul class="navbar-nav mx-auto gap-lg-3 mt-3 mt-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link active fw-semibold" to="/">
              Home
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink to="/posts" class="nav-link">
              Explore Posts
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/#about">
              About
            </RouterLink>
          </li>
        </ul>

        <!-- User Actions -->
        <div class="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
          <template v-if="!isLoggedIn">
            <RouterLink to="/login" class="btn btn-outline-primary px-4">
              Login
            </RouterLink>

            <RouterLink to="/register" class="btn btn-primary px-4">
              Sign Up
            </RouterLink>
          </template>

          <button
            v-else
            class="btn btn-outline-primary px-4"
            @click="logoutUser"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>