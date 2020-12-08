# Progress
[View the MVP demonstration](https://www.youtube.com/watch?v=xPBdxCLZosU&t=76s)

A fitness tracker application where you can create custom workouts and browse workouts others have created.

Installation Requirements
- mongodb
- a method to run your database (recommended: mongod)
- a method to run your server (recommended: nodemon)

NodeJS Packages:
- body-parser
- dotenv
- ejs
- express
- express-session
- mongoose
- passport
- passport-local-mongoose

Installation Instructions:
- clone repository
- for security, change your .env SECRET variable
- install required dependencies
- using Node, run the following scripts to populate the database:
  1. model/dbExerciseInit.js !!! MANDATORY
  2. model/dbSetAndWorkoutInit.js (optional, sample workouts)

- run server, website is rendered on localhost:3000
