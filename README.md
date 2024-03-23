# Roblox App

Welcome to the Roblox App! This project contains the frontend (built with React) and backend (built with Node.js) components of the application.

## Installation

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/TusharPuri10/oauth2-robolox
```

### 2. Install Dependencies
* Navigate to the roblox-app directory (React frontend)
```bash
cd roblox-app
npm install
```

* Navigate to the server directory (Node.js backend)
```bash
cd server
npm install
```
### 3. Compile and add .env 
* compile
```bash
cd server
tsc
```
* Add ROBLOX_CLIENT_ID and ROBLOX_CLIENT_SECRET in .env inside dist folder

### 4. Start the Development Servers
* In the roblox-app directory (React frontend)
```bash
npm run dev
```
* In the server/dist directory (Node.js backend)
```bash
node index.js
```
This will start the frontend server at http://localhost:5173 and the backend server at http://localhost:3000.

### Usage
Once both servers are running, you can access the Roblox App in your web browser by navigating to http://localhost:5173.

