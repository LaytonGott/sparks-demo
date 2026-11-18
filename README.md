# Task tracker API

A small HTTP API for a shared to-do list. Tasks live in memory for the lifetime of the server.

## Run locally

With Node.js 24 or later installed, run `npm ci` and `npm start`. The server listens on port 3000 by default. Set `PORT` to change it.

| Method | Path | Request and response |
| --- | --- | --- |
| POST | `/tasks` | Send `{"title":"Book meeting room"}` to create a task. Returns the task with status 201. |
| GET | `/tasks` | Returns an object with a `tasks` array. |
| PATCH | `/tasks/:id` | Send `{"completed":true}` to complete a task or `{"completed":false}` to reopen it. Returns the updated task. |

Each task has an ID, a title, a completion flag and an ISO creation timestamp. Titles accept up to 200 characters after trimming whitespace.

## Development

Run `npm run check` for the TypeScript check and `npm test` for the HTTP and store tests. GitHub Actions runs both checks on pull requests and pushes to main.
