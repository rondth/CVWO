# Commenting Feature Implementation Guide

This guide will help you add a commenting feature where users can click on a post to see and add comments.

## 📋 Overview

**User Flow:**
1. User clicks on a post
2. Post detail view opens showing the post + all its comments
3. User can add a new comment
4. Comments are displayed with author and timestamp

---

## 🗂️ Files You Need to Create/Modify

### **Backend Files**

#### 1. **`backend/schema.sql`** (MODIFY)
**What to add:**
- A new `comments` table with:
  - `id` (SERIAL PRIMARY KEY)
  - `post_id` (INTEGER, references posts table)
  - `user_id` (INTEGER, references users table)
  - `content` (TEXT, the comment text)
  - `created_at` (TIMESTAMP with DEFAULT)
  - `updated_at` (TIMESTAMP with DEFAULT)

**Why:** Store comments in the database

---

#### 2. **`backend/models/comment.go`** (CREATE NEW)
**What to create:**
- A `Comment` struct similar to `Post` and `User` models
- Fields: `ID`, `PostID`, `UserID`, `Content`, `CreatedAt`, `UpdatedAt`
- JSON tags for API serialization

**Why:** Define the data structure for comments in Go

---

#### 3. **`backend/handlers/comment.go`** (CREATE NEW)
**What to create:**
- `GetCommentsHandler(db *sql.DB) http.HandlerFunc`
  - GET `/api/posts/{post_id}/comments`
  - Returns all comments for a specific post
  - Similar structure to `GetPostsHandler`
  
- `CreateCommentHandler(db *sql.DB) http.HandlerFunc`
  - POST `/api/posts/{post_id}/comments`
  - Creates a new comment on a post
  - Validates: content not empty, post exists, user exists
  - Similar structure to `CreatePostHandler`

**Why:** Handle HTTP requests for comment operations

**Key things to learn:**
- How to extract URL parameters using `chi.URLParam(r, "post_id")`
- How to validate that a post exists before allowing comments
- How to use `db.Query()` for multiple comments vs `db.QueryRow()` for single comment

---

#### 4. **`backend/main.go`** (MODIFY)
**What to add:**
- Import the comment handlers
- Add routes:
  - `r.Get("/api/posts/{post_id}/comments", handlers.GetCommentsHandler(db))`
  - `r.Post("/api/posts/{post_id}/comments", handlers.CreateCommentHandler(db))`

**Why:** Register the API endpoints

---

### **Frontend Files**

#### 5. **`frontend/src/services/api.ts`** (MODIFY)
**What to add:**
- `Comment` interface (similar to `Post` interface)
- `getComments(postId: number): Promise<Comment[]>` function
- `createComment(postId: number, userId: number, content: string): Promise<Comment>` function

**Why:** API functions to fetch and create comments

**Key things to learn:**
- How to structure API calls with nested routes (`/posts/{id}/comments`)
- How to pass multiple parameters (postId, userId, content)

---

#### 6. **`frontend/src/components/CommentList.tsx`** (CREATE NEW)
**What to create:**
- Component that displays a list of comments
- Takes `comments: Comment[]` as props
- Shows: comment content, author username, timestamp
- Similar structure to how posts are displayed

**Why:** Reusable component for displaying comments

**Key things to learn:**
- How to map over an array and render components
- How to format dates/timestamps for display
- How to style lists in Material-UI

---

#### 7. **`frontend/src/components/CommentForm.tsx`** (CREATE NEW)
**What to create:**
- Component with a text field for comment input
- Submit button
- Takes `onSubmit: (content: string) => void` as prop
- Similar structure to the post creation form

**Why:** Reusable form for adding comments

**Key things to learn:**
- Controlled components (useState for input)
- Form submission handling
- Disabling form while submitting

---

#### 8. **`frontend/src/components/PostDetail.tsx`** (CREATE NEW)
**What to create:**
- Component that shows a single post with its comments
- Takes `post: Post`, `currentUser: User`, and other props
- Displays:
  - Post title, body, topic
  - CommentList component
  - CommentForm component
- Handles fetching comments when component loads (useEffect)
- Handles adding new comments

**Why:** Main view when user clicks on a post

**Key things to learn:**
- useEffect for fetching data on component mount
- Managing state for comments
- Combining multiple child components
- Conditional rendering (show form only if logged in)

---

#### 9. **`frontend/src/components/Posts.tsx`** (MODIFY)
**What to modify:**
- Add click handler to post cards
- When clicked, navigate to PostDetail view or show it in a modal/dialog
- You'll need to manage state for "selected post"

**Why:** Make posts clickable to view details

**Key things to learn:**
- Event handlers (onClick)
- State management for selected items
- Conditional rendering (show list vs show detail)

---

#### 10. **`frontend/src/components/Home.tsx`** (MODIFY - Optional)
**What to modify:**
- If you want posts on the home page to be clickable too
- Similar changes to Posts.tsx

**Why:** Consistency across the app

---

#### 11. **`frontend/src/App.tsx`** (MODIFY)
**What to modify:**
- Add route for PostDetail: `/posts/:id` or `/post/:id`
- Or handle it with state (show PostDetail instead of Posts list)
- Add functions to fetch comments and create comments
- Pass these functions as props

**Why:** Routing and state management at app level

**Key things to learn:**
- React Router dynamic routes (`:id`)
- Managing shared state (comments) at app level
- Passing callbacks down to child components

---

## 🗄️ Database Schema Design

### Comments Table Structure:
```sql
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Points:**
- `post_id` links comment to a post
- `user_id` links comment to the author
- `ON DELETE CASCADE` means if a post is deleted, its comments are deleted too
- `content` is TEXT (unlimited length, unlike VARCHAR)

---

## 🔄 Data Flow

### Creating a Comment:
1. **User types comment** → CommentForm component
2. **User clicks submit** → CommentForm calls `onSubmit(content)`
3. **PostDetail receives** → Calls `createComment(postId, userId, content)` from api.ts
4. **api.ts makes request** → POST to `/api/posts/{postId}/comments`
5. **Backend handler** → `CreateCommentHandler` validates and inserts into database
6. **Backend returns** → New comment object
7. **Frontend updates** → Adds comment to state, re-renders CommentList

### Viewing Comments:
1. **User clicks post** → Posts component shows PostDetail
2. **PostDetail mounts** → useEffect calls `getComments(postId)`
3. **api.ts makes request** → GET `/api/posts/{postId}/comments`
4. **Backend handler** → `GetCommentsHandler` queries database
5. **Backend returns** → Array of comments
6. **Frontend displays** → CommentList renders all comments

---

## 📝 Step-by-Step Implementation Order

### Phase 1: Backend (Database & API)
1. ✅ Modify `schema.sql` - Add comments table
2. ✅ Create `models/comment.go` - Define Comment struct
3. ✅ Create `handlers/comment.go` - Implement GetCommentsHandler and CreateCommentHandler
4. ✅ Modify `main.go` - Add comment routes
5. ✅ Test with Postman/curl - Verify API works

### Phase 2: Frontend (API & Components)
6. ✅ Modify `api.ts` - Add comment API functions
7. ✅ Create `CommentList.tsx` - Display comments
8. ✅ Create `CommentForm.tsx` - Add comment form
9. ✅ Create `PostDetail.tsx` - Combine post + comments
10. ✅ Modify `Posts.tsx` - Make posts clickable
11. ✅ Modify `App.tsx` - Add routing/state management

### Phase 3: Polish
12. ✅ Add loading states
13. ✅ Add error handling
14. ✅ Style the components
15. ✅ Test the full flow

---

## 🎯 Key Concepts to Learn

### Backend:
1. **Foreign Keys**: How comments relate to posts and users
2. **URL Parameters**: Extracting `post_id` from `/api/posts/{post_id}/comments`
3. **Nested Resources**: Comments belong to posts (RESTful design)
4. **Validation**: Check post exists before allowing comments
5. **SQL JOINs**: (Optional) Join comments with users to get usernames

### Frontend:
1. **Component Composition**: Building PostDetail from smaller components
2. **useEffect**: Fetching data when component mounts
3. **State Management**: Managing comments array in state
4. **Event Handling**: onClick to navigate/view details
5. **Conditional Rendering**: Show/hide components based on state
6. **React Router**: (If using routing) Dynamic routes with `:id`

---

## 🔍 What to Study in Existing Code

Before implementing, study these patterns:

1. **`handlers/post.go`** → See how `CreatePostHandler` works (similar to `CreateCommentHandler`)
2. **`handlers/post.go`** → See how `GetPostsHandler` works (similar to `GetCommentsHandler`)
3. **`components/Posts.tsx`** → See how forms and lists are structured
4. **`services/api.ts`** → See how API functions are structured
5. **`App.tsx`** → See how state and callbacks are passed down

---

## 💡 Tips

1. **Start Simple**: Get basic comment creation working first, then add features
2. **Test Backend First**: Use Postman to test API before building frontend
3. **One Feature at a Time**: Don't try to do everything at once
4. **Use Console.log**: Debug by logging data at each step
5. **Check Network Tab**: See what requests are being made in browser DevTools
6. **Read Error Messages**: They usually tell you what's wrong

---

## 🚀 Optional Enhancements (After Basic Feature Works)

- Edit/Delete comments (only by author)
- Reply to comments (nested comments)
- Comment count on posts
- Pagination for comments
- Real-time updates (WebSockets)
- Comment reactions/likes

---

## 📚 Resources

- Go database/sql docs: https://pkg.go.dev/database/sql
- React useEffect: https://react.dev/reference/react/useEffect
- Material-UI components: https://mui.com/components/
- Chi router URL params: https://github.com/go-chi/chi#url-parameters

Good luck! Start with the backend, test it, then move to frontend. Take it one step at a time! 🎉



