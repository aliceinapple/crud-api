# crud-api

Clone the repository with the command: git clone https://github.com/aliceinapple/crud-api.git;
Switch to branch develop: git checkout develop;
Install all dependencies: npm install;
The application is run in development mode: npm run start:dev;
The application is run in production mode: npm run start:prod;
Implemented horizontal scaling. Script to run: npm run start:multi;
You can send requests with postman:

GET /api/users - Get a list of all users.
Parameters: None.

GET /api/users/{userId} - Get user information by ID.
Options:
{userId} - User ID. Replace {userId} with your actual user ID.

POST /api/users - Create a new user.
Options:
username - Username (string).
age - User’s age (number).
hobbies (optional) - List of user’s hobbies (array of strings).

PUT /api/users/{userId} - Update user information by ID.
Options:
{userId} - User ID. Replace {userId} with your actual user ID.
username (optional) - New username (string).
age (optional) - New age of the user (number).
hobbies (optional) - New list of user’s hobbies (array of strings).

DELETE /api/users/{userId} - Delete a user by ID.
Options:
{userId} - User ID. Replace {userId} with your actual user ID.
