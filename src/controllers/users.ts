import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

const users: User[] = [];

export function getUsers(): User[] {
  return users;
}

export function getUserById(userId: string): User | undefined {
  return users.find((user) => user.id === userId);
}

export function createUser(
  username: string,
  age: number,
  hobbies: string[]
): User {
  const user: User = {
    id: uuidv4(),
    username,
    age,
    hobbies,
  };
  users.push(user);
  return user;
}

export function updateUser(
  userId: string,
  fields: Partial<User>
): User | undefined {
  const user = users.find((user) => user.id === userId);
  if (user) {
    user.username = fields.username || user.username;
    user.age = fields.age || user.age;
    user.hobbies = fields.hobbies || user.hobbies;
    return user;
  }
  return undefined;
}

export function deleteUser(userId: string): boolean {
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
}
