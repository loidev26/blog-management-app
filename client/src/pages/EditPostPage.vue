<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import '../assets/main.css'
import api from '../api'

const route = useRoute()
const router = useRouter()
const notyf = new Notyf()

const title = ref('')
const content = ref('')
const isLoading = ref(false)
const isSaving = ref(false)

// Get the selected post
const getPost = async () => {
  try {
    isLoading.value = true

    const response = await api.get(
      `/posts/getPost/${route.params.id}`
    )

    const data = response.data
    const post = data.data || data.post || data

    title.value = post.title || ''
    content.value = post.content || ''
  } catch (error) {
    notyf.error(
      error.response?.data?.message || 'Failed to load post.'
    )
  } finally {
    isLoading.value = false
  }
}

// Save the updated post
const updatePost = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    notyf.error('Please fill in both the title and content.')
    return
  }

  try {
    isSaving.value = true

    const token = localStorage.getItem('token')

    await api.put(
      `/posts/updatePost/${route.params.id}`,
      {
        title: title.value.trim(),
        content: content.value.trim()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    notyf.success('Post updated successfully!')

    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    notyf.error(
      error.response?.data?.message || 'Failed to update post.'
    )
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  getPost()
})
</script>

<template>
  <div class="bg-light min-vh-100 py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-7">

          <div class="mb-4">
            <RouterLink
              to="/"
              class="text-decoration-none text-primary"
            >
              <i class="bi bi-arrow-left me-2"></i>
              Back to Posts
            </RouterLink>

            <h1 class="fw-bold mt-3">Edit Your Post</h1>

            <p class="text-secondary">
              Update your title and content below.
            </p>
          </div>

          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4 p-md-5">

              <div v-if="isLoading" class="text-center py-5">
                <div
                  class="spinner-border text-primary"
                  role="status"
                ></div>
                <p class="text-secondary mt-3">
                  Loading post...
                </p>
              </div>

              <form v-else @submit.prevent="updatePost">
                <div class="mb-4">
                  <label for="title" class="form-label fw-semibold">
                    Post Title
                  </label>

                  <input
                    id="title"
                    v-model="title"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Enter your post title"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label for="content" class="form-label fw-semibold">
                    Post Content
                  </label>

                  <textarea
                    id="content"
                    v-model="content"
                    class="form-control"
                    rows="8"
                    placeholder="Write your story..."
                    required
                  ></textarea>
                </div>

                <div class="d-flex flex-wrap gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary px-4"
                    :disabled="isSaving"
                  >
                    <span
                      v-if="isSaving"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>

                    <i v-else class="bi bi-check-lg me-1"></i>

                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
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
  </div>
</template>