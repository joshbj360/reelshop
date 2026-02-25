import { usePostApi } from '../services/post.api'
import { usePostStore } from '../store/post.store'
import { useProfileStore } from '../../../profile/app/stores/profile.store'
import type { ICreatePostData } from '../types/post.types'

export const usePost = () => {
  const postApi = usePostApi()
  const postStore = usePostStore()
  const profileStore = useProfileStore()

  const isLoading = computed(() => postStore.isLoading)
  const error = computed(() => postStore.error)

  const createPost = async (data: ICreatePostData) => {
    postStore.setLoading(true)
    postStore.setError(null)
    try {
      const result = await postApi.createPost(data)
      postStore.addPosts([result])
      profileStore.addMyPost(result)
      return result
    } catch (error: any) {
      postStore.setError(error.message || 'Failed to create post')
      throw error
    } finally {
      postStore.setLoading(false)
    }
  }

  const fetchUserFeed = async (limit: number = 20, offset: number = 0) => {
    postStore.setLoading(true)
    postStore.setError(null)
    try {
      const result = await postApi.getUserFeed(limit, offset)
      postStore.addPosts(result.data)
      return result
    } catch (error: any) {
      postStore.setError(error.message || 'Failed to fetch feed')
      throw error
    } finally {
      postStore.setLoading(false)
    }
  }

  const fetchUserPosts = async (username: string, limit = 9, offset = 0) => {
    postStore.setLoading(true)
    try {
      // Use the specific endpoint for user profile posts
      const result = await postApi.getUserPosts(username, limit, offset)
      
      // We pass username so the store knows which Map key to update
      postStore.addPosts(result.data, username)
      
      return result
    } catch (e: any) {
      postStore.setError(e.message)
      throw e
    } finally {
      postStore.setLoading(false)
    }
  }

  const getPostById = async (id: string) => {
    postStore.setLoading(true)
    postStore.setError(null)
    try {
      const result = await postApi.getPostById(id)
      postStore.addPosts([result])
      return result
    } catch (error: any) {
      postStore.setError(error.message || 'Post not found')
      throw error
    } finally {
      postStore.setLoading(false)
    }
  }

  const likePost = async (id: string) => {
    try {
      postStore.addLikedPost(id)
      await postApi.likePost(id)
      return true
    } catch (error: any) {
      postStore.removeLikedPost(id)
      postStore.setError(error.message || 'Failed to like post')
      throw error
    }
  }

  const unlikePost = async (id: string) => {
    try {
      postStore.removeLikedPost(id)
      await postApi.unlikePost(id)
      return true
    } catch (error: any) {
      postStore.addLikedPost(id)
      postStore.setError(error.message || 'Failed to unlike post')
      throw error
    }
  }

  const savePost = async (id: string) => {
    try {
      await postApi.savePost(id)
      postStore.addSavedPosts([{ id }])
      return true
    } catch (error: any) {
      postStore.setError(error.message || 'Failed to save post')
      throw error
    }
  }

  const fetchSavedPosts = async (limit = 9, offset = 0) => {
    postStore.setLoading(true)
    try {
      const result = await postApi.getSavedPosts(limit, offset)
      postStore.addSavedPosts(result.data)
      return result
    } catch (e: any) {
      postStore.setError(e.message)
    } finally {
      postStore.setLoading(false)
    }
  }

  const unsavePost = async (postId: string) => {
    try {
      await postApi.unsavePost(postId)
      postStore.removeSavedPost(postId)
    } catch (e: any) {
      postStore.setError(e.message)
    }
  }

  return { isLoading, error, fetchSavedPosts, unsavePost, savePost, createPost, fetchUserFeed, likePost, unlikePost, fetchUserPosts, getPostById }
}
