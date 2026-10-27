<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '../api'

const router = useRouter()
const notyf = new Notyf()

const title = ref('')
const content = ref('')
const isLoading = ref(false)

const addPost = async () => {
  try {
    isLoading.value = true

    const token = localStorage.getItem('token')

    const response = await api.post(
      '/posts/addPost',
      {
        title: title.value,
        content: content.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    notyf.success(
      response.data.message || 'Post created successfully!'
    )

    title.value = ''
    content.value = ''

    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    notyf.error(
      error.response?.data?.message ||
      'Failed to create post. Please try again.'
    )
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-7">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4 p-md-5">
            <h2 class="fw-bold mb-2">Create a Post</h2>

            <p class="text-muted mb-4">
              Share your thoughts with the Postly community.
            </p>

            <form @submit.prevent="addPost">
              <!-- Post Title -->
              <div class="mb-3">
                <label for="title" class="form-label">
                  Post Title
                </label>

                <input
                  id="title"
                  v-model="title"
                  type="text"
                  class="form-control"
                  placeholder="Enter your post title"
                  required
                />
              </div>

              <!-- Post Content -->
              <div class="mb-4">
                <label for="content" class="form-label">
                  Content
                </label>

                <textarea
                  id="content"
                  v-model="content"
                  class="form-control"
                  rows="6"
                  placeholder="What would you like to share?"
                  required
                ></textarea>
              </div>

              <!-- Buttons -->
              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-primary px-4"
                  :disabled="isLoading"
                >
                  {{
                    isLoading
                      ? 'Publishing...'
                      : 'Publish Post'
                  }}
                </button>

                <button
                  type="button"
                  class="btn btn-outline-secondary px-4"
                  @click="router.push('/')"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
