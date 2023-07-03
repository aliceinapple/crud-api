import { createServer, IncomingMessage, ServerResponse } from "http";
import { isValidUUID, errorHandler } from "./utils/validator";
import { parseBody } from "./utils/parseBody";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./controllers/users";
import cluster from "cluster";
import os from "os";

const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  res.setHeader("Content-Type", "application/json");

  const body = await parseBody(req).catch(() => ({}));

  try {
    if (method === "GET" && url === "/api/users") {
      const users = getUsers();
      res.statusCode = 200;
      res.end(JSON.stringify(users));
    } else if (method === "GET" && url?.startsWith("/api/users/")) {
      const userId = url.split("/").pop();
      if (userId && isValidUUID(userId)) {
        const user = getUserById(userId);
        if (user) {
          res.statusCode = 200;
          res.end(JSON.stringify(user));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Record not found" }));
        }
      } else {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid userId" }));
      }
    } else if (method === "POST" && url === "/api/users") {
      if (body && body.username && body.age) {
        const user = createUser(body.username, body.age, body.hobbies);
        res.statusCode = 201;
        res.end(JSON.stringify(user));
      } else {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing required fields" }));
      }
    } else if (method === "PUT" && url?.startsWith("/api/users/")) {
      const userId = url.split("/").pop();
      if (userId && isValidUUID(userId)) {
        if (body && (body.username || body.age || body.hobbies)) {
          const updatedUser = updateUser(userId, body);
          if (updatedUser) {
            res.statusCode = 200;
            res.end(JSON.stringify(updatedUser));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Record not found" }));
          }
        } else {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Missing fields to update" }));
        }
      } else {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid userId" }));
      }
    } else if (method === "DELETE" && url?.startsWith("/api/users/")) {
      const userId = url.split("/").pop();
      if (userId && isValidUUID(userId)) {
        const deleted = deleteUser(userId);
        if (deleted) {
          res.statusCode = 204;
          res.end();
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Record not found" }));
        }
      } else {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid userId" }));
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not found" }));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
    errorHandler(error);
  }
};

if (!process.env.USE_CLUSTER) {
  const server = createServer(handleRequest);

  const port: number = parseInt(process.env.PORT as string, 10) || 4000;

  server.listen(port, () => {
    console.log(`Server ${process.pid} is running on port ${port}`);
  });
} else {
  const numWorkers = os.cpus().length - 1;
  const basePort: number = parseInt(process.env.PORT as string, 10) || 4000;

  if (cluster.isPrimary) {
    for (let i = 0; i < numWorkers; i++) {
      const port = basePort + i;
      const worker = cluster.fork({ PORT: port });
    }
  } else {
    const server = createServer(handleRequest);

    const port = process.env.PORT;
    server.listen(port, () => {
      console.log(
        `Worker ${cluster?.worker?.process.pid} is running on port ${port}`
      );
    });
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
}
