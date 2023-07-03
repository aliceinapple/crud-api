import http from "http";

const baseUrl = "http://localhost:4000";

describe("User API tests", () => {
  let userId: string;

  test("GET /api/users should return an empty array", (done) => {
    http.get(`${baseUrl}/api/users`, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        const users = JSON.parse(data);
        expect(users).toEqual([]);
        done();
      });
    });
  });

  test("POST /api/users should create a new user object", (done) => {
    const user = {
      username: "Alice InApple",
      age: 27,
      hobbies: ["Reading", "Drawing"],
    };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const req = http.request(`${baseUrl}/api/users`, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        const createdUser = JSON.parse(data);
        expect(createdUser).toHaveProperty("id");
        expect(createdUser.username).toBe(user.username);
        expect(createdUser.age).toBe(user.age);
        expect(createdUser.hobbies).toEqual(user.hobbies);
        userId = createdUser.id;
        done();
      });
    });

    req.write(JSON.stringify(user));
    req.end();
  });

  test("GET /api/users/{userId} should return the created user object", (done) => {
    http.get(`${baseUrl}/api/users/${userId}`, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        const user = JSON.parse(data);
        expect(user.id).toBe(userId);
        done();
      });
    });
  });

  test("PUT /api/users/{userId} should update the user object", (done) => {
    const updatedUser = {
      username: "Daria Morgendorffer",
    };
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };

    const req = http.request(
      `${baseUrl}/api/users/${userId}`,
      options,
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const updatedUser = JSON.parse(data);
          expect(updatedUser.id).toBe(userId);
          expect(updatedUser.username).toBe("Daria Morgendorffer");
          done();
        });
      }
    );

    req.write(JSON.stringify(updatedUser));
    req.end();
  });

  test("DELETE /api/users/{userId} should delete the user object", (done) => {
    const options = {
      method: "DELETE",
    };

    const req = http.request(
      `${baseUrl}/api/users/${userId}`,
      options,
      (res) => {
        expect(res.statusCode).toBe(204);
        done();
      }
    );

    req.end();
  });

  test("GET /api/users/{userId} should return 404 after deletion", (done) => {
    http.get(`${baseUrl}/api/users/${userId}`, (res) => {
      expect(res.statusCode).toBe(404);
      done();
    });
  });
});
