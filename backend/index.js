const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const { Client } = require("pg");

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

app.get("/api/lists/:userId/:listId", async (request, response) => {
  const userId = request.params.userId;
  const listId = request.params.listId;

  try {
    const { rows } = await client.query(
      `
      SELECT Lists.id AS list_id, Lists.name AS list_name, Tasks.id AS task_id, Tasks.name AS task_name
      FROM Users
      JOIN Lists ON Users.id = Lists.user_id
      LEFT JOIN Tasks ON Lists.id = Tasks.list_id
      WHERE Users.id = $1 AND Lists.id = $2
      `,
      [userId, listId]
    );

    const listData = {
      list_name: rows[0].list_name,
      tasks: rows.map((row) => ({ id: row.task_id, name: row.task_name })),
    };

    response.json(listData);
  } catch (error) {
    response.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/api/lists/:userId/:listId/tasks",
  express.json(),
  async (request, response) => {
    const userId = request.params.userId;
    const listId = request.params.listId;
    const { task } = request.body;

    try {
      const result = await client.query(
        "INSERT INTO Tasks (list_id, name) VALUES ($1, $2) RETURNING id, name",
        [listId, task]
      );

      response.status(201).json(result.rows[0]);
    } catch (error) {
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

app.put(
  "/api/lists/:userId/:listId/tasks/:taskId",
  express.json(),
  async (request, response) => {
    const userId = request.params.userId;
    const listId = request.params.listId;
    const taskId = request.params.taskId;
    const { taskName } = request.body;

    try {
      const result = await client.query(
        "UPDATE Tasks SET name = $1 WHERE id = $2 AND list_id IN (SELECT id FROM Lists WHERE user_id = $3)",
        [taskName, taskId, userId]
      );

      if (result.rowCount === 0) {
        response
          .status(404)
          .json({ error: "Task not found or permission denied" });
      } else {
        response.status(200).json({ message: "Task updated successfully" });
      }
    } catch (error) {
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

app.delete(
  "/api/lists/:userId/:listId/tasks/:taskId",
  async (request, response) => {
    const userId = request.params.userId;
    const listId = request.params.listId;
    const taskId = request.params.taskId;

    try {
      const result = await client.query(
        "DELETE FROM Tasks WHERE id = $1 AND list_id IN (SELECT id FROM Lists WHERE user_id = $2)",
        [taskId, userId]
      );

      if (result.rowCount === 0) {
        response
          .status(404)
          .json({ error: "Task not found or permission denied" });
      } else {
        response.status(204).end();
      }
    } catch (error) {
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/");
});
