
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '../api'

const router = useRouter()
const notyf = new Notyf()

const identifier = ref('')
const password = ref('')
const isLoading = ref(false)

const loginUser = async () => {
  try {
    isLoading.value = true

    const response = await api.post('/users/login', {
      identifier: identifier.value,
      password: password.value
    })

    const token = response.data.access

    if (!token) {
      throw new Error('Login response did not contain an access token.')
    }

    // Get the role from the login response or JWT payload.
    let isAdmin = response.data.user?.isAdmin

    if (typeof isAdmin !== 'boolean') {
      try {
        const payload = JSON.parse(
          atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        )

        isAdmin = payload.isAdmin
      } catch {
        isAdmin = undefined
      }
    }

    // Don't guess the role if the backend didn't provide it.
    if (typeof isAdmin !== 'boolean') {
      throw new Error(
        'User role is missing. Check your backend login response or JWT payload.'
      )
    }

    localStorage.setItem('token', token)
    localStorage.setItem('isAdmin', String(isAdmin))

    identifier.value = ''
    password.value = ''

    notyf.success('Login successful!')

    await router.replace(isAdmin ? '/admin' : '/')
  } catch (error) {
    console.error(error)

    notyf.error(
      error.response?.data?.message ||
      error.message ||
      'Login failed. Please try again.'
    )
  } finally {
    isLoading.value = false
  }
}
</script>


<template>
  <div class="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">

          <!-- Login Card -->
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4 p-md-5">

              <!-- Logo and Heading -->
              <div class="text-center mb-4">
                <RouterLink
                  to="/"
                  class="text-decoration-none text-dark fw-bold fs-3"
                >
                  <i class="bi bi-journal-richtext text-primary me-2"></i>
                  Postly
                </RouterLink>

                <h2 class="fw-bold mt-4 mb-2">Welcome Back!</h2>

                <p class="text-secondary">
                  Log in to continue exploring stories.
                </p>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="loginUser">

                <!-- Email -->
                <div class="mb-3">
                  <label for="identifier" class="form-label fw-semibold">
                    Username or Email
                  </label>

                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-envelope text-secondary"></i>
                    </span>

                    <input
                      type="text"
                      id="identifier"
                      class="form-control"
                      placeholder="you@example.com"
                      v-model="identifier"
                      required
                    />
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label for="password" class="form-label fw-semibold">
                    Password
                  </label>

                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-lock text-secondary"></i>
                    </span>

                    <input
                      type="password"
                      id="password"
                      class="form-control"
                      placeholder="Enter your password"
                      v-model="password"
                      required
                    />
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  class="btn btn-primary w-100 py-2 fw-semibold"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Logging in...' : 'Login' }}
                  <i class="bi bi-arrow-right ms-2"></i>
                </button>

              </form>

              <!-- Register Link -->
              <div class="text-center mt-4">
                <span class="text-secondary">
                  Don't have an account?
                </span>

                <RouterLink
                  to="/register"
                  class="text-primary fw-semibold text-decoration-none ms-1"
                >
                  Sign Up
                </RouterLink>
              </div>

            </div>
          </div>

          <!-- Back to Home -->
          <div class="text-center mt-4">
            <RouterLink
              to="/"
              class="text-secondary text-decoration-none small"
            >
              <i class="bi bi-arrow-left me-1"></i>
              Back to Home
            </RouterLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>