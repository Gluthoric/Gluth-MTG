```markdown
# react-gluth-mtg

react-gluth-mtg is a web application designed to help users track their Magic: The Gathering (MTG) card collection. The app allows users to filter, sort, and manage their card collection, providing a visual distinction between owned and unowned cards. It also features a Kiosk page to display cards with quantities greater than one.

## Overview

react-gluth-mtg is built using the following technologies:

- **Frontend**: React, React Bootstrap, React Router DOM
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Styling**: Bootstrap
- **State Management**: React Context or Redux
- **HTTP Client**: Axios

### Project Structure

The project is structured as follows:

- **Frontend**:
  - `src/App.jsx`: Root component that includes the navigation bar and main content area.
  - `src/main.jsx`: Main entry point for the React application, setting up routing and rendering the root component.
  - `src/pages`: Contains the different page components (Home, Editions, Edition, Kiosk).
  - `src/components/Navbar.jsx`: Defines the navigation bar component.
  - `public/index.html`: Main HTML file.
- **Backend**:
  - `server/config/database.js`: Configures and initializes the MySQL database connection using Sequelize.
  - `server/index.js`: Sets up the Express server.
  - `server/routes`: Defines the API routes for fetching and updating data.
  - `server/models`: Defines the Sequelize models for the database schema.
- **Configuration**:
  - `.env`: Environment variables for database connection.
  - `package.json`: Project dependencies and scripts.
  - `.eslintrc.cjs`: ESLint configuration.
  - `vite.config.js`: Vite configuration for bundling.

## Features

- **Navigation Bar**: Located on the left, allows users to navigate to different sections such as Editions and Kiosk.
- **Editions Page**: Displays all editions, and clicking on an edition shows all cards within that edition.
- **Cards Page**: Displays cards within a selected edition, allows changing the quantity of each card owned, and visually distinguishes owned vs. unowned cards.
- **Kiosk Page**: Displays cards with quantities greater than one.
- **Sorting and Filtering**: Users can sort and filter cards based on different traits.

## Getting started

### Requirements

To run this project, you will need:

- Node.js
- MySQL
- npm (Node Package Manager)

### Quickstart

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd react-gluth-mtg
   ```

2. **Set up the environment variables**:
   Create a `.env` file in the project root and add the following:
   ```env
   DATABASE_URL='mysql+pymysql://mtg_user:Caprisun1!@localhost/mtg_dashboard'
   ```

3. **Install the dependencies**:
   ```bash
   npm install
   ```

4. **Set up the database**:
   Ensure your MySQL server is running and create the necessary database and tables:
   ```sql
   CREATE DATABASE mtg_dashboard;
   USE mtg_dashboard;

   CREATE TABLE editions (
     id INT PRIMARY KEY,
     name VARCHAR(255) NOT NULL
   );

   CREATE TABLE cards (
     id INT PRIMARY KEY,
     edition_id INT,
     name VARCHAR(255) NOT NULL,
     quantity INT DEFAULT 0,
     FOREIGN KEY (edition_id) REFERENCES editions(id)
   );
   ```

5. **Run the backend server**:
   ```bash
   node server/index.js
   ```

6. **Run the frontend**:
   ```bash
   npm run dev
   ```

7. **Open the application**:
   Open your browser and navigate to `http://localhost:3000`.

### License

The project is proprietary (not open source). All rights reserved.

© 2024.
```