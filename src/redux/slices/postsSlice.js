import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { postAPI } from '../../api/postAPI'

const initialState = {
  posts: {
    list: null,
    loading: false,
    
  },
  postForView: {
    post: null,
    loading: false
  },
  freshPosts: {
    posts: null,
    loading: false
  },
  postsForMainPage: {
    postsForMain: null,
    loading: false,
    
  }

}

export const getfetchPosts = createAsyncThunk(
  'post/getfetchPosts',
  async () => {
    const response = await postAPI.fetchPosts()
    return response
  }
)



export const getPostById = createAsyncThunk(
  'post/fetchById',
  async (postId) => {
    const response = await postAPI.fetchById(postId)
    return response
  }
)

export const getFreshPosts = createAsyncThunk(
  'posts/fetchFreshPosts',
  async (limit) => {
    const response = await postAPI.fetchFreshPosts(limit)
    return response
  }
)

export const getPostsPagin = createAsyncThunk(
  'postsPagin/fetchPosts',
  async (currentPage) => {
    const response = await postAPI.fetchPostsPagin(currentPage)
    return response
  }
)

export const postsSlice = createSlice({
  name: 'posts',
  initialState,

  reducers: {
    sortPostBySelect: (state) => {
      state.posts.list = state.posts.list.sort((a, b) => a.title > b.title ? 1 : -1)
    },

    sortByInputPost: (state, action) => {
      state.posts.list = action.payload ? state.posts.list = state.posts.list.filter((post) => post.title.toLowerCase().includes(action.payload.toLowerCase())) : !state.posts.list
    },

    freshPostInPage: (state) => {
      state.posts.list = state.posts.list.splice(state.posts.list.length-3)
    },
   
    editPost: (state, action) => {
      state.posts.list = state.posts.list.map((post)=> {
        if (post.id===action.payload.id) {
          return action.payload
        }
        return post
      })
    },
 
    addPost: (state,action) => {
      const newPost = {...action.payload}
      newPost.id = new Date().getTime()
      state.posts.list = state.posts.list ? [newPost, ...state.posts.list] : [newPost]
    },
    showPost: (state, action) => {
      state.postForView = {
        post: action.payload,
        loading: false
      }
    },
    deletePost: (state, action) => {
      state.posts.list = state.posts.list.filter((post) => post.id !== action.payload.id)
      state.postForView = {
        post: null,
        loading: false
      }
    }
  },

  extraReducers: (builder) => {

    builder.addCase(getPostById.pending, (state) => {
      state.postForView = {
        post: null,
        loading: true
      }
      })

    builder.addCase(getPostById.fulfilled, (state, action) => {
    state.postForView = {
      post: action.payload,
      loading: false
    }
    })

    builder.addCase(getPostsPagin.pending, (state) => {
      state.posts = {
        list: null,
        loading: true
      }
    })

    builder.addCase(getPostsPagin.fulfilled, (state, action) => {
      state.posts = {
        list: action.payload,
        loading: false
      }
    })


    builder.addCase(getFreshPosts.pending, (state) => {
      state.freshPosts = {
        posts: null,
        loading: true
      }
    })

    builder.addCase(getFreshPosts.fulfilled, (state, action) => {
      state.freshPosts = {
        posts: action.payload,
        loading: false
      }
    })

    builder.addCase(getfetchPosts.pending, (state) => {
      state.postsForMainPage = {
        postsForMain: null,
        loading: true
      }
    })

    builder.addCase(getfetchPosts.fulfilled, (state, action) => {
      state.postsForMainPage = {
        postsForMain: action.payload,
        loading: false
      }
    })
  },
})


export const { editPost, addPost, showPost, deletePost,  sortPostBySelect, sortByInputPost, freshPostInPage} = postsSlice.actions

export default postsSlice.reducer