<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '../api'

const router = useRouter()
const posts = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const notyf = new Notyf()

// Logout admin
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('isAdmin')

  router.replace('/login')
}

// Get all posts
const getAllPosts = async () => {
  try {
    isLoading.value = true

    const response = await api.get('/posts/getAllPosts')
    posts.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load posts:', error)
    notyf.error('Failed to load posts.')
  } finally {
    isLoading.value = false
  }
}

// Search posts by title or author
const filteredPosts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  if (!query) return posts.value

  return posts.value.filter(post =>
    post.title?.toLowerCase().includes(query) ||
    post.author?.username?.toLowerCase().includes(query)
  )
})

// Count unique authors
const uniqueAuthors = computed(() => {
  return new Set(
    posts.value
      .map(post => post.author?._id)
      .filter(Boolean)
  ).size
})

// Delete a post
const deletePost = async (postId) => {
  if (!confirm('Are you sure you want to delete this post?')) {
    return
  }

  try {
    const token = localStorage.getItem('token')

    await api.delete(`/posts/deletePost/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    posts.value = posts.value.filter(post => post._id !== postId)

    notyf.success('Post deleted successfully!')
  } catch (error) {
    console.error('Failed to delete post:', error)

    notyf.error(
      error.response?.data?.message || 'Failed to delete post.'
    )
  }
}

onMounted(getAllPosts)
</script>

<template>
  <div class="bg-light min-vh-100">

    <!-- Admin Header -->
    <section class="bg-white border-bottom py-5">
      <div class="container">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">

          <div>
            <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
              <i class="bi bi-shield-check me-1"></i>
              ADMIN PANEL
            </span>

            <h1 class="fw-bold mb-2">Admin Dashboard</h1>

            <p class="text-secondary mb-0">
              Manage community posts and moderate content.
            </p>
          </div>

          <!-- Logout Button -->
          <button
            class="btn btn-outline-danger"
            @click="logout"
          >
            <i class="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>

        </div>
      </div>
    </section>

    <div class="container py-5">

      <!-- Statistics -->
      <div class="row g-4 mb-5">

        <!-- Total Posts -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4 d-flex align-items-center gap-3">

              <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-3">
                <i class="bi bi-journal-richtext fs-3"></i>
              </div>

              <div>
                <p class="text-secondary mb-1">Total Posts</p>
                <h3 class="fw-bold mb-0">{{ posts.length }}</h3>
              </div>

            </div>
          </div>
        </div>

        <!-- Unique Authors -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4 d-flex align-items-center gap-3">

              <div class="bg-success bg-opacity-10 text-success rounded-3 p-3">
                <i class="bi bi-people fs-3"></i>
              </div>

              <div>
                <p class="text-secondary mb-1">Unique Authors</p>
                <h3 class="fw-bold mb-0">{{ uniqueAuthors }}</h3>
              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- Manage Posts -->
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4 p-md-5">

          <!-- Section Heading -->
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

            <div>
              <h4 class="fw-bold mb-2">Manage Posts</h4>

              <p class="text-secondary mb-0">
                View posts from all users and delete posts when necessary.
              </p>
            </div>

            <!-- Refresh Button -->
            <button
              class="btn btn-outline-primary"
              @click="getAllPosts"
              :disabled="isLoading"
            >
              <i class="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>

          </div>

          <!-- Search -->
          <div class="input-group mb-4">

            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-search"></i>
            </span>

            <input
              v-model="searchQuery"
              type="search"
              class="form-control bg-light border-start-0"
              placeholder="Search by post title or author..."
            />

          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="text-center py-5">

            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <p class="text-secondary mt-3">Loading posts...</p>

          </div>

          <!-- Empty State -->
          <div
            v-else-if="filteredPosts.length === 0"
            class="text-center py-5"
          >

            <i
              class="bi bi-journal-x text-primary"
              style="font-size: 55px;"
            ></i>

            <h5 class="fw-bold mt-3">No posts found</h5>

            <p class="text-secondary mb-0">
              Try another search or refresh the list.
            </p>

          </div>

          <!-- Posts Table -->
          <div v-else class="table-responsive">

            <table class="table table-hover align-middle">

              <thead class="table-light">
                <tr>
                  <th>Post</th>
                  <th>Author</th>
                  <th>Date Created</th>
                  <th class="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="post in filteredPosts"
                  :key="post._id"
                >

                  <!-- Post Details -->
                  <td style="min-width: 220px; max-width: 350px;">

                    <div class="fw-semibold">
                      {{ post.title }}
                    </div>

                    <small class="text-secondary">
                      {{ post.content }}
                    </small>

                  </td>

                  <!-- Author -->
                  <td class="text-nowrap">
                    <i class="bi bi-person-circle text-primary me-1"></i>
                    {{ post.author?.username || 'Unknown author' }}
                  </td>

                  <!-- Date -->
                  <td class="text-secondary text-nowrap">
                    {{
                      post.createdOn
                        ? new Date(post.createdOn).toLocaleDateString()
                        : '—'
                    }}
                  </td>

                  <!-- Delete Action -->
                  <td class="text-end">

                    <button
                      class="btn btn-outline-danger btn-sm"
                      @click="deletePost(post._id)"
                    >
                      <i class="bi bi-trash me-1"></i>
                      Delete
                    </button>

                  </td>

                </tr>
              </tbody>

            </table>

          </div>

          <!-- Table Footer -->
          <div class="border-top pt-3 mt-3">
            <small class="text-secondary">
              Showing {{ filteredPosts.length }} of {{ posts.length }} posts
            </small>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>
