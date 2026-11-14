# To-Do List App (MERN Stack)

A mobile-first to-do list application built with the MERN stack. Users can create, edit, delete and search tasks, schedule them with a date and time, mark them as completed, and track their progress week by week.

- **Live demo:** DEPLOYED_FRONTEND_URL
- **API base URL:** DEPLOYED_API_URL/api

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack and Why](#tech-stack-and-why)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [API Documentation](#api-documentation)
7. [Known Limitations and Future Improvements](#known-limitations-and-future-improvements)
8. [Author](#author)

---

## Features

### Task management
- **Create tasks** with a title (required), description (optional), date and start time (required), end time (optional) and priority (Low, Medium or High, optional).
- **Edit tasks:** every field can be changed in a pre-filled form.
- **Delete tasks** by swiping a row to the left and tapping **Delete**, or with the trash icon (which asks for confirmation first).
- **Search tasks** by keyword in the title or description, across all weeks. Results offer view, edit and delete.
- **Change task status:** tick the checkbox to mark a task as completed. A completed task gets a strikethrough title. Unticking it moves it back to in progress.

### Home screen
- **Scrollable calendar strip** (about 90 days either side of today) with a "Today" shortcut. Selecting a day shows that day's tasks.
- **Weekly organisation:** weeks run **Monday to Sunday**.
- **Summary cards:** "Task Complete" and "Task Pending" counts for the selected week, plus a **weekly progress bar**.
- **Today's task preview:** the first 3 tasks of the selected day in time order. A **View All** link appears only when the day has more than 3 tasks.

### Extra screens
- **Onboarding** screen with a "Get Started" button.
- **Day page:** every task of one day in ascending time order, with edit, delete and status changes.
- **Completed tasks page:** all completed tasks of the week, with view and delete options (status can still be changed).
- **Pending tasks page:** all pending tasks of the week, with edit and delete options.

### Quality and UX
- Form validation with required fields marked by a red asterisk, and server errors shown in the form.
- **Optimistic updates** for the status checkbox, with automatic rollback if the request fails.
- Loading, empty and error states on every list.
- Debounced search to avoid sending a request on every keystroke.
- All dates are stored in UTC and displayed in **Indian Standard Time (IST)**.
- Fully responsive, mobile-first layout styled with Tailwind CSS.

---


## Tech Stack 

### Frontend

| Technology | Purpose | Why it was chosen |
|---|---|---|
| **React** (with **Vite**) | UI library and build tool | A component model suits the repeated pieces of this UI (task rows, cards, modals). Vite gives very fast start-up and hot reload. |
| **Tailwind CSS** | Styling | The design tokens from the Figma (colors, spacing, font) map directly onto utility classes and a small theme file. There are no separate CSS files to keep in sync, and responsive styling is built in. |
| **TanStack Query** | Server-state management | Handles fetching, caching, loading and error states, refetching after changes and optimistic updates. It replaces a lot of manual `useEffect` and `useState` code and avoids race conditions between requests. |
| **React Router** | Routing | Multiple screens (home, day, week, search). The selected date is kept in the URL, so it survives navigation and pages can be linked directly. |
| **Axios** | HTTP client | Sets a base URL once and rejects the promise on 4xx and 5xx responses, which TanStack Query relies on to detect failures. |
| **date-fns** and **@date-fns/tz** | Date handling | Week boundaries and day comparisons are always calculated in IST, whatever timezone the browser uses, without hand-written offset maths. |
| **lucide-react** | Icons | Consistent, tree-shakeable icon set, so only the icons actually used are bundled. |

### Backend

| Technology | Purpose | Why it was chosen |
|---|---|---|
| **Node.js** and **Express** | Server and REST API | Minimal and unopinionated, with the same language (JavaScript) on both sides. Fits the MERN requirement and a small API. |
| **MongoDB** and **Mongoose** | Database and modelling | A document model fits task data well. Mongoose adds a schema, built-in validation, indexes and timestamps, and a validation hook that enforces "end time must be after start time" in one place. |
| **cors**, **dotenv** | Cross-origin access, configuration | The frontend and API run on different origins, and secrets and URLs stay out of the code. |

### Hosting

| Service | Used for |
|---|---|
| **Netlify** | Frontend (static build) |
| **Render** | Backend API (Node web service) |
| **MongoDB Atlas** | Hosted database |

### Highlighted packages 

#### TanStack Query (`@tanstack/react-query`)

Manages everything that comes from the API (server state), so components don't need hand-written `useEffect` and `useState` fetching code.

- **Caching per week.** Tasks are cached under the key `['tasks', 'week', <week start>]`. Tapping different days of the same week makes no new request, and revisiting a week shows its data instantly.
- **Refreshing after changes.** After a create, edit or delete, one call invalidates every `['tasks', ...]` query. The home screen, day page, completed and pending pages and any open search results all refresh, including a task that was moved to another week.
- **Optimistic updates.** Ticking a checkbox updates the UI immediately. A snapshot of the cache is kept, and the change is rolled back automatically if the request fails.
- **Loading and error states** come built in, and responses from outdated requests (for example when the user switches weeks quickly) can't overwrite newer data.
- **Search** only runs when there is a keyword (`enabled`), and the previous results stay on screen while the next ones load (`keepPreviousData`), which avoids flicker while typing.

#### date-fns and @date-fns/tz

Handle all date logic in **Indian Standard Time (Asia/Kolkata)**, whatever time zone the user's device is set to. All of it lives in one file, `frontend/src/utils/date.js`.

- **Week boundaries:** `startOfWeek` and `endOfWeek` (with `weekStartsOn: 1` for Monday) compute Monday 00:00 to Sunday 23:59:59.999 in IST, which are then converted to UTC ISO strings for the API.
- **Display and comparison:** `format` and `isSameDay` run in IST, so a task at 11:30 PM stays on the correct day.
- **Why not plain `Date`:** its methods use the browser's local time zone, so a user outside India would see tasks in the wrong day or week. Hand-written `+05:30` arithmetic is easy to get wrong, so a tested library is used instead.
- date-fns is modular and does not mutate dates, and only the functions that are imported are bundled.

---

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── task.js            # Task schema and validation
│   ├── routes/
│   │   └── taskRoutes.js      # All task API endpoints
│   └── app.js                 # Express app entry point
│
└── frontend/
    ├── public/
    │   └── _redirects         # SPA routing rule for Netlify
    └── src/
        ├── api/               # axios client, API functions, error helper
        ├── components/
        │   ├── common/        # Modal, ConfirmDialog, SwipeableRow, PageLayout, PageHeader
        │   ├── home/          # SearchBar, WeekStrip, WeekSummary, WeeklyProgress
        │   └── tasks/         # TaskItem, TaskList, TaskFormModal, TaskDetailsModal, AddTaskButton
        ├── context/           # TaskFormContext (shared add/edit modal)
        ├── hooks/             # useWeekTasks, useSearchTasks, useTaskMutations, useDebounce
        ├── pages/             # Onboarding, Home, DayTasksPage, WeekTasksPage, SearchPage
        ├── utils/             # date.js (IST helpers), tasks.js, taskForm.js
        ├── App.jsx            # Router setup
        └── main.jsx           # Entry point and QueryClientProvider
```

---

## Getting Started

### Prerequisites

- **Node.js** 20 or newer
- **npm**
- A **MongoDB** database: either a local installation or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repository

```bash
git clone https://github.com/Stuti208/TODO-App.git
cd TODO-App
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` then start the server:

```bash
npm run dev
```
 

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`, then start the dev server:

```bash
npm run dev
```



## Environment Variables

### Backend (`backend/.env`)

| Variable  | Description |
|---|---|
| `PORT` | Port the API listens on (defaults to 5000) |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_ORIGIN` | Frontend URL allowed by CORS.|

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API

---


## API Documentation

**Base URL:** `http://localhost:5000/api` 

---

### 1. Create a task

`POST /api/create-task`

**Request body**

| Field | Type | Required |
|---|---|---|
| `title` | String | Yes |
| `description` | String | No |
| `date` | ISO date string | Yes |
| `startAt` | ISO date string | Yes |
| `endAt` | ISO date string | No |
| `priority` | `low` \| `medium` \| `high` | No (default `low`) |
| `isCompleted` | Boolean | No (default `false`) |

```json
{
  "title": "Finishing Wireframe",
  "description": "Complete the home screen wireframe",
  "date": "2026-11-13T18:30:00.000Z",
  "startAt": "2026-11-14T04:30:00.000Z",
  "endAt": "2026-11-14T05:30:00.000Z",
  "priority": "high"
}
```

**Success: `201 Created`**

```json
{
  "success": true,
  "data": {
    "_id": "6734a1f2c8b5e3a1d4f09b7c",
    "title": "Finishing Wireframe",
    "description": "Complete the home screen wireframe",
    "date": "2026-11-13T18:30:00.000Z",
    "startAt": "2026-11-14T04:30:00.000Z",
    "endAt": "2026-11-14T05:30:00.000Z",
    "priority": "high",
    "isCompleted": false,
    "createdAt": "2026-11-14T06:12:45.321Z",
    "updatedAt": "2026-11-14T06:12:45.321Z",
    "__v": 0
  }
}
```


### 2. Get tasks in a date range

`GET /api/get-tasks?from=<ISO>&to=<ISO>`

Returns every task whose `date` falls between `from` and `to` (both inclusive), sorted by `date` then `startAt` **ascending**. The frontend calls this once per week, passing Monday 00:00 to Sunday 23:59:59.999 in IST converted to UTC.

**Query parameters**

| Parameter | Required | Description |
|---|---|---|
| `from` | Yes | Start of the range (ISO date string) |
| `to` | Yes | End of the range (ISO date string), must not be before `from` |

**Example:** the week of Monday 9 to Sunday 15 November 2026 (IST)

```
GET /api/get-tasks?from=2026-11-08T18:30:00.000Z&to=2026-11-15T18:29:59.999Z
```

**Success: `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "_id": "6734a1f2c8b5e3a1d4f09b7c",
      "title": "Finishing Wireframe",
      "description": "Complete the home screen wireframe",
      "date": "2026-11-13T18:30:00.000Z",
      "startAt": "2026-11-14T04:30:00.000Z",
      "endAt": "2026-11-14T05:30:00.000Z",
      "priority": "high",
      "isCompleted": false,
      "createdAt": "2026-11-14T06:12:45.321Z",
      "updatedAt": "2026-11-14T06:12:45.321Z",
      "__v": 0
    }
  ]
}
```

A week with no tasks returns `"data": []`.


### 3. Search tasks

`GET /api/search-tasks?q=<keyword>`

Searches **all weeks** for tasks whose title or description contains the keyword. Matching is case-insensitive and partial (`meet` finds `Meeting with team`). Special characters such as `(` or `*` are escaped, so they are searched as plain text. Results are sorted newest first.

**Query parameters**

| Parameter | Required | Description |
|---|---|---|
| `searchKey` | Yes | Search keyword (blank values are rejected) |

**Example**

```
GET /api/search-tasks?q=wire
```

**Success: `200 OK`**: same shape as the date-range response, `{ "success": true, "data": [ ...tasks ] }`. No matches return `"data": []`.


---

### 4. Update task details

`PATCH /api/update-task/:id`

Edits a task. The client sends **all editable fields every time**: changed values for fields that were edited and the original values for the rest. The fields are then set as a whole and validated again.

**Request body**

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | Optional. If omitted, the description is cleared. |
| `date` | ISO date string | Required |
| `startAt` | ISO date string | Required |
| `endAt` | ISO date string or `null` | Optional. If omitted or `null`, the end time is cleared. |
| `priority` | `low` \| `medium` \| `high` | Falls back to `low` if omitted |


```json
{
  "title": "Finishing Wireframe v2",
  "description": "Complete the home and search screens",
  "date": "2026-11-13T18:30:00.000Z",
  "startAt": "2026-11-14T05:00:00.000Z",
  "endAt": "2026-11-14T06:30:00.000Z",
  "priority": "medium"
}
```

**Success: `200 OK`**

```json
{
  "success": true,
  "data": { "_id": "6734a1f2c8b5e3a1d4f09b7c", "title": "Finishing Wireframe v2", "...": "..." }
}
```


### 5. Update task status

`PATCH /api/update-task-status/:id`

Marks a task as completed or back to in progress. 

**Request body**

| Field | Type | Required |
|---|---|---|
| `isCompleted` | Boolean (`true` or `false`) | Yes |

```json
{ "isCompleted": true }
```

**Success: `200 OK`**

```json
{
  "success": true,
  "data": { "_id": "6734a1f2c8b5e3a1d4f09b7c", "isCompleted": true, "...": "..." }
}
```

### 6. Delete a task

`DELETE /api/delete-task/:id`

No request body.

**Success: `200 OK`**

```json
{ "success": true, "message": "Task deleted successfully" }
```

---


## Known Limitations and Future Improvements

- Add user authentication so each person has their own task list.
- Add pagination for very large task lists and search results.
- Add an undo option for deleted tasks.
- Support tasks that run past midnight (currently the end time must be on the same day).
- Add automated tests (API tests for the endpoints and component tests for the main screens).
- Improve modal accessibility with a keyboard focus trap.

---

## Author

**Stuti Jain**
GitHub: [github.com/Stuti208](https://github.com/Stuti208)
