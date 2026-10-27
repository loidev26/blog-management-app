<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../api'

const posts = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const getPosts = async () => {
  isLoading.value = true

  try {
    const response = await api.get('/posts/getAllPosts')
    posts.value = response.data.data || []
  } catch (error) {
    errorMessage.value = 'Failed to load posts. Please try again.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getPosts()
})
</script>

<template>
  <div class="container py-5">
    <div class="mb-4">
      <h1 class="fw-bold">Explore Posts</h1>
      <p class="text-muted">Discover stories and ideas from our community.</p>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Loading posts...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
      <button class="btn btn-sm btn-outline-danger ms-2" @click="getPosts">
        Try Again
      </button>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-5">
      <h4>No posts yet</h4>
      <p class="text-muted">Be the first to share a story!</p>
      <RouterLink to="/add-post" class="btn btn-primary">
        Write a Post
      </RouterLink>
    </div>

    <div v-else class="row g-4">
      <div
        v-for="post in posts"
        :key="post._id"
        class="col-md-6 col-lg-4"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold">{{ post.title }}</h5>

            <p class="text-muted small">
              By {{ post.author?.username || 'Unknown author' }}
            </p>

            <p class="card-text">
              {{ post.content?.slice(0, 150) }}
              {{ post.content?.length > 150 ? '...' : '' }}
            </p>

            <RouterLink
              :to="`/posts/${post._id}`"
              class="btn btn-outline-primary mt-auto"
            >
              Read More
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>