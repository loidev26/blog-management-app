<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import '../assets/main.css'
import api from '../api'

const router = useRouter()
const notyf = new Notyf()

const posts = ref([])
const searchQuery = ref('')
const isLoading = ref(false)

const isLoggedIn = ref(
  Boolean(localStorage.getItem('token'))
)

const token = localStorage.getItem('token')

// Get the logged-in user's ID from the JWT
const getUserIdFromToken = () => {
  try {
    if (!token) return null

    const payload = JSON.parse(
      atob(
        token
          .split('.')[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/')
      )
    )

    return String(
      payload.id ||
      payload._id ||
      payload.userId ||
      payload.sub ||
      ''
    ) || null
  } catch (error) {
    console.error('Unable to read user ID from token:', error)
    return null
  }
}

const currentUserId = getUserIdFromToken()

// Check if the logged-in user owns the post
const isPostOwner = (post) => {
  const authorId = post.author?._id || post.author

  return Boolean(
    currentUserId &&
    authorId &&
    String(authorId) === currentUserId
  )
}

// Open Post Details
const goToPost = (postId) => {
  router.push(`/posts/${postId}`)
}

// Get All Posts
const getPosts = async () => {
  try {
    isLoading.value = true

    const response = await api.get('/posts/getAllPosts')

    console.log('All posts:', response.data.data)

    posts.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load posts:', error)
    notyf.error('Failed to load posts.')
  } finally {
    isLoading.value = false
  }
}

// Search Posts by Title, Content, or Author Username
const filteredPosts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  if (!query) {
    return posts.value
  }

  return posts.value.filter(post =>
    post.title?.toLowerCase().includes(query) ||
    post.content?.toLowerCase().includes(query) ||
    post.author?.username?.toLowerCase().includes(query)
  )
})

// Delete Post
const deletePost = async (postId) => {
  if (!confirm('Are you sure you want to delete this post?')) {
    return
  }

  try {
    const currentToken = localStorage.getItem('token')

    await api.delete(`/posts/deletePost/${postId}`, {
      headers: {
        Authorization: `Bearer ${currentToken}`
      }
    })

    posts.value = posts.value.filter(
      post => post._id !== postId
    )

    notyf.success('Post deleted successfully!')
  } catch (error) {
    console.error('Failed to delete post:', error)

    notyf.error(
      error.response?.data?.message ||
      'Failed to delete post.'
    )
  }
}

onMounted(() => {
  getPosts()
})
</script>

<template>
  <div class="bg-light min-vh-100">

    <!-- Hero Section -->
    <section class="py-5">
      <div class="container py-lg-5">
        <div class="row align-items-center g-5">

          <div class="col-lg-6">
            <span
              class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3"
            >
              YOUR DAILY DOSE OF INSPIRATION
            </span>

            <h1 class="display-4 fw-bold mb-4">
              Ideas worth reading.
              <span class="text-primary">
                Stories worth sharing.
              </span>
            </h1>

            <p class="lead text-secondary mb-4">
              Discover fresh ideas, helpful guides, and inspiring stories
              from our growing community of writers.
            </p>

            <a
              href="#posts"
              class="btn btn-primary btn-lg px-4 me-2"
            >
              Explore Posts
              <i class="bi bi-arrow-right ms-2"></i>
            </a>

            <RouterLink
              v-if="!isLoggedIn"
              to="/register"
              class="btn btn-outline-secondary btn-lg px-4"
            >
              Join Our Community
            </RouterLink>

            <RouterLink
              v-else
              to="/add-post"
              class="btn btn-outline-primary btn-lg px-4"
            >
              <i class="bi bi-plus-lg me-1"></i>
              Write a Post
            </RouterLink>
          </div>

          <div class="col-lg-6">
            <div
              class="bg-primary bg-opacity-10 rounded-5 p-5 text-center"
            >
              <i
                class="bi bi-journal-richtext text-primary"
                style="font-size: 150px;"
              ></i>

              <h4 class="fw-bold mt-3">
                Read. Learn. Discover.
              </h4>

              <p class="text-secondary mb-0">
                Your next favorite story is waiting.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Posts Section -->
    <section id="posts" class="py-5 bg-white">
      <div class="container">

        <!-- Section Heading and Search -->
        <div
          class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4"
        >
          <div>
            <p class="text-primary fw-semibold mb-2">
              OUR LATEST STORIES
            </p>

            <h2 class="fw-bold mb-2">
              Explore Posts
            </h2>

            <p class="text-secondary mb-0">
              Find something interesting to read today.
            </p>
          </div>

          <!-- Search Posts -->
          <div class="input-group" style="max-width: 320px;">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-search"></i>
            </span>

            <input
              v-model="searchQuery"
              type="search"
              class="form-control bg-light border-start-0"
              placeholder="Search posts..."
            />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-5">
          <div
            class="spinner-border text-primary"
            role="status"
          >
            <span class="visually-hidden">
              Loading...
            </span>
          </div>

          <p class="text-secondary mt-3">
            Loading posts...
          </p>
        </div>

        <!-- No Posts -->
        <div
          v-else-if="filteredPosts.length === 0"
          class="text-center py-5"
        >
          <i
            class="bi bi-journal-text text-primary"
            style="font-size: 60px;"
          ></i>

          <h4 class="fw-bold mt-3">
            {{ searchQuery ? 'No matching posts found' : 'No posts yet' }}
          </h4>

          <p class="text-secondary">
            {{
              searchQuery
                ? 'Try searching with a different keyword.'
                : 'Be the first to share a story with the community!'
            }}
          </p>

          <RouterLink
            v-if="isLoggedIn && !searchQuery"
            to="/add-post"
            class="btn btn-primary mt-2"
          >
            <i class="bi bi-plus-lg me-1"></i>
            Create Your First Post
          </RouterLink>
        </div>

        <!-- Clickable Post Cards -->
        <div v-else class="row g-4">

          <div
            v-for="post in filteredPosts"
            :key="post._id"
            class="col-md-6 col-lg-4"
          >
            <article
              class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden post-card"
              role="link"
              tabindex="0"
              @click="goToPost(post._id)"
              @keydown.enter="goToPost(post._id)"
            >

              <!-- Card Icon -->
              <div
                class="bg-primary bg-opacity-10 text-primary text-center py-4"
              >
                <i
                  class="bi bi-journal-richtext"
                  style="font-size: 60px;"
                ></i>
              </div>

              <!-- Card Content -->
              <div class="card-body p-4 d-flex flex-column">

                <span
                  class="badge bg-primary-subtle text-primary align-self-start mb-3"
                >
                  Community Post
                </span>

                <h5 class="fw-bold">
                  {{ post.title }}
                </h5>

                <p class="text-secondary post-content">
                  {{ post.content }}
                </p>

                <!-- Author and Date -->
                <div
                  class="d-flex justify-content-between align-items-center mt-auto pt-3"
                >
                  <small class="text-secondary">
                    <i class="bi bi-person me-1"></i>
                    {{ post.author?.username || 'Unknown author' }}
                  </small>

                  <small class="text-secondary">
                    <i class="bi bi-calendar3 me-1"></i>
                    {{
                      post.createdOn
                        ? new Date(post.createdOn).toLocaleDateString()
                        : ''
                    }}
                  </small>
                </div>

                <!-- Post Actions -->
                <div
                  class="d-flex justify-content-between align-items-center gap-2 mt-3"
                >
                  <span
                    class="text-primary small fw-semibold read-post"
                    role="link"
                    tabindex="0"
                    @click.stop="goToPost(post._id)"
                    @keydown.enter.stop="goToPost(post._id)"
                  >
                    Read full post
                    <i class="bi bi-arrow-right ms-1"></i>
                  </span>

                  <!-- Only the post owner sees Edit and Delete -->
                  <div
                    v-if="isPostOwner(post)"
                    class="d-flex gap-2 flex-shrink-0"
                  >
                    <RouterLink
                      :to="`/edit-post/${post._id}`"
                      class="btn btn-outline-primary btn-sm"
                      @click.stop
                      @keydown.enter.stop
                    >
                      <i class="bi bi-pencil me-1"></i>
                      Edit
                    </RouterLink>

                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click.stop="deletePost(post._id)"
                      @keydown.enter.stop
                    >
                      <i class="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            </article>
          </div>

        </div>

        <!-- Post Count -->
        <div
          v-if="!isLoading && filteredPosts.length > 0"
          class="text-center mt-5"
        >
          <p class="text-secondary">
            Showing {{ filteredPosts.length }}
            {{ filteredPosts.length === 1 ? 'post' : 'posts' }}
          </p>
        </div>

      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-5">
      <div class="container text-center py-4">
        <i class="bi bi-journal-richtext text-primary fs-1"></i>

        <h2 class="fw-bold mt-3">
          A space for ideas and stories
        </h2>

        <p
          class="text-secondary mx-auto"
          style="max-width: 600px;"
        >
          Postly brings together helpful articles, fresh perspectives,
          and stories designed to inspire curious minds.
        </p>

        <RouterLink
          v-if="!isLoggedIn"
          to="/register"
          class="btn btn-primary px-4 mt-2"
        >
          Become a Member
        </RouterLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
      <div
        class="container d-flex flex-wrap justify-content-between gap-3"
      >
        <span class="fw-bold">
          <i class="bi bi-journal-richtext me-2"></i>
          Postly
        </span>

        <small class="text-white-50">
          © 2026 Postly. All rights reserved.
        </small>
      </div>
    </footer>

  </div>
</template>

<style scoped>
.post-card {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.12) !important;
}

.post-card:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 3px;
}

.read-post {
  cursor: pointer;
}

.post-content {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
