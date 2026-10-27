<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '../api'

const route = useRoute()
const router = useRouter()
const notyf = new Notyf()

const post = ref(null)
const isLoading = ref(true)

const comments = ref([])
const newComment = ref('')
const isSubmitting = ref(false)

// Check whether the user is logged in
const isLoggedIn = ref(!!localStorage.getItem('token'))

const getPost = async () => {
  try {
    isLoading.value = true

    const response = await api.get(
      `/posts/getPost/${route.params.id}`
    )

    console.log('API response:', response.data)

    const data = response.data
    post.value = data.post || data.data || data

    comments.value = post.value.comments || []
  } catch (error) {
    console.error('Failed to retrieve post:', error)
    notyf.error('Failed to load post.')
  } finally {
    isLoading.value = false
  }
}

const deletePost = async () => {
  if (!confirm('Are you sure you want to delete this post?')) {
    return
  }

  try {
    await api.delete(`/posts/deletePost/${route.params.id}`)
    notyf.success('Post deleted successfully.')
    router.push('/')
  } catch (error) {
    console.error('Failed to delete post:', error)
    notyf.error(
      error.response?.data?.message || 'Failed to delete post.'
    )
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) {
    notyf.error('Please enter a comment.')
    return
  }

  try {
    isSubmitting.value = true

    const response = await api.post(
      `/posts/addComment/${route.params.id}`,
      {
        content: newComment.value.trim()
      }
    )

    console.log('Add comment response:', response.data)

    newComment.value = ''

    await getPost()

    notyf.success('Comment added successfully.')
  } catch (error) {
    console.error(
      'Add comment error:',
      error.response?.data || error.message
    )

    notyf.error(
      error.response?.data?.message ||
      error.response?.data?.auth ||
      'Failed to add comment.'
    )
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Refresh login status when the page loads
  isLoggedIn.value = !!localStorage.getItem('token')
  getPost()
})
</script>

<template>
  <div class="container py-5">

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Loading post...</p>
    </div>

    <div v-else-if="post" class="card shadow-sm border-0 p-4">

      <!-- Post Details -->
      <h1 class="mb-3">{{ post.title }}</h1>

      <p class="text-secondary small mb-1">
        By {{ post.author?.username || 'Unknown author' }}
      </p>

      <p class="text-secondary small">
        {{ post.createdOn
          ? new Date(post.createdOn).toLocaleDateString()
          : 'Date unavailable' }}
      </p>

      <hr />

      <p class="post-content">{{ post.content }}</p>

      <!-- Comment Section -->
      <hr class="my-4" />

      <h3 class="mb-4">
        Comments ({{ comments.length }})
      </h3>

      <!-- Show form only to logged-in users -->
      <form
        v-if="isLoggedIn"
        @submit.prevent="addComment"
        class="mb-4"
      >
        <div class="mb-3">
          <label for="comment" class="form-label">
            Write a comment
          </label>

          <textarea
            id="comment"
            v-model="newComment"
            class="form-control"
            rows="3"
            placeholder="Share your thoughts..."
            :disabled="isSubmitting"
          ></textarea>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
        </button>
      </form>

      <p v-else class="text-muted mb-4">
        Please
        <RouterLink to="/login">log in</RouterLink>
        to leave a comment.
      </p>

      <!-- Display Comments -->
      <div v-if="comments.length === 0" class="text-muted py-3">
        No comments yet. Be the first to comment!
      </div>

      <div
        v-for="(comment, index) in comments"
        :key="comment._id || index"
        class="card bg-light border-0 mb-3"
      >
        <div class="card-body">
          <div class="d-flex align-items-center gap-2 mb-2">
            <strong>
              {{ comment.author?.username || 'User' }}
            </strong>
          </div>

          <p class="mb-2 comment-content">
            {{ comment.content }}
          </p>

          <small class="text-muted">
            {{ comment.createdOn
              ? new Date(comment.createdOn).toLocaleString()
              : ''
            }}
          </small>
        </div>
      </div>

      <!-- Back Button -->
      <RouterLink
        to="/"
        class="btn btn-outline-secondary mt-3 align-self-start"
      >
        Back to Posts
      </RouterLink>

    </div>

    <div v-else class="text-center">
      <h3>Post not found</h3>

      <RouterLink to="/" class="btn btn-primary mt-3">
        Back to Posts
      </RouterLink>
    </div>

  </div>
</template>

<style scoped>
.post-content,
.comment-content {
  white-space: pre-wrap;
  line-height: 1.8;
  overflow-wrap: anywhere;
  max-height: none;
  overflow: visible;
  display: block;
}
</style>