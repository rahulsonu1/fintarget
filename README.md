This will start the Node.js cluster with two worker processes.

## Project Structure

- `cluster.js`: Sets up the Node.js cluster
- `server.js`: Contains the main server logic, including rate limiting and task processing
- `package.json`: Defines project dependencies and scripts
- `task_log.txt`: Log file for completed tasks

## Configuration

- Port: The server runs on port 8000 by default. You can change this by setting the `PORT` environment variable.
- Rate Limiting: Configured in `server.js`. Currently set to 1 task per second and 20 tasks per minute per user.

## API Endpoints

### POST /api/v1/task

Processes a task for a user.

Request body:
```json
{
  "userId": "string"
}

Note : Your machine must have Redis server running otherwise , it will throw error in console.

TO start the server , Your need to install nodemon paackage, then run script {npm start}.
