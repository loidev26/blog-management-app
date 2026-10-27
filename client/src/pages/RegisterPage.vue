<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '../api'

const router = useRouter()
const notyf = new Notyf()

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    notyf.error('Passwords do not match.')
    return
  }

  try {
    isLoading.value = true

    const response = await api.post('/users/register', {
      email: email.value,
      username: username.value,
      password: password.value
    })

    notyf.success(
      response.data.message || 'Registration successful!'
    )

    email.value = ''
    username.value = ''
    password.value = ''
    confirmPassword.value = ''

    setTimeout(() => {
      router.push('/login')
    }, 1500)

  } catch (error) {
    notyf.error(
      error.response?.data?.message ||
      'Registration failed. Please try again.'
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

          <!-- Register Card -->
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4 p-md-5">

              <!-- Logo -->
              <div class="text-center mb-4">
                <RouterLink
                  to="/"
                  class="text-decoration-none text-dark fw-bold fs-3"
                >
                  <i class="bi bi-journal-richtext text-primary me-2"></i>
                  Postly
                </RouterLink>

                <h2 class="fw-bold mt-4 mb-2">Create an Account</h2>

                <p class="text-secondary">
                  Join our community and start exploring stories.
                </p>
              </div>

              <!-- Register Form -->
              <form @submit.prevent="registerUser">

                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label fw-semibold">
                    Email Address
                  </label>

                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-envelope text-secondary"></i>
                    </span>

                    <input
                      type="email"
                      id="email"
                      class="form-control"
                      placeholder="you@example.com"
                      v-model="email"
                      required
                    />
                  </div>
                </div>

                <!-- Username -->
                <div class="mb-3">
                  <label for="username" class="form-label fw-semibold">
                    Username
                  </label>

                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-envelope text-secondary"></i>
                    </span>

                    <input
                      type="text"
                      id="username"
                      class="form-control"
                      placeholder="Enter your username"
                      v-model="username"
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
                      placeholder="Create a password"
                      v-model="password"
                      required
                    />
                  </div>

                  <small class="text-secondary">
                    Choose a strong password to protect your account.
                  </small>
                </div>

                <!-- Confirm Password -->
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-shield-lock text-secondary"></i>
                    </span>

                    <input
                      type="password"
                      id="confirmPassword"
                      class="form-control"
                      placeholder="Re-enter your password"
                      v-model="confirmPassword"
                      required
                    />
                  </div>
                </div>

                <!-- Submit -->
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 py-2 fw-semibold"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                  <i class="bi bi-arrow-right ms-2"></i>
                </button>

              </form>

              <!-- Login Link -->
              <div class="text-center mt-4">
                <span class="text-secondary">
                  Already have an account?
                </span>

                <RouterLink
                  to="/login"
                  class="text-primary fw-semibold text-decoration-none ms-1"
                >
                  Login
                </RouterLink>
              </div>

            </div>
          </div>

          <!-- Back to Home -->
          <div class="text-center mt-4">
            <RouterLink to="/" class="text-secondary text-decoration-none small">
              <i class="bi bi-arrow-left me-1"></i>
              Back to Home
            </RouterLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>