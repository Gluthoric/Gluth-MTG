```markdown
# react-gluth-mtg

react-gluth-mtg is a web application designed to help users track their Magic: The Gathering (MTG) card collection. The app provides an interactive interface for managing card quantities, viewing different editions, and displaying cards with quantities greater than one.

## Overview

The application interfaces with a MySQL database to store and manage information about MTG card editions and individual cards. The frontend is built using React, with Bootstrap for styling, and the backend is built using Node.js with Express to handle API requests. State management in the frontend is handled using React Context or Redux, and Axios or Fetch API is used for making requests to the backend.

### Architecture and Technologies

- **Frontend:** React, React Bootstrap, React Router DOM, Axios
- **Backend:** Node.js, Express, Sequelize ORM
- **Database:** MySQL
- **Styling:** Bootstrap
- **State Management:** React Context or Redux

### Project Structure

The project is structured as follows:

- **Frontend:**
  - `src/App.jsx`: Root component of the application.
  - `src/components/Navbar.jsx`: Navigation bar component.
  - `src/components/SortingFilteringControls.jsx`: Component for sorting and filtering controls.
  - `src/pages/`: Directory containing page components (Home, Editions, Edition, Cards, Kiosk).
  - `src/context/CardContext.js`: Context for managing card state.
  - `src/services/cardService.js`: Service for interacting with the backend API.
  - `src/index.css`: Global styles.
  - `src/App.css`: Component-specific styles.

- **Backend:**
  - `server/index.js`: Main entry point for the backend server.
  - `server/config/database.js`: Database configuration and initialization.
  - `server/models/`: Directory containing Sequelize models (Edition, Card, Collection, Kiosk).
  - `server/routes/`: Directory containing route handlers for API endpoints (cards, editions).

## Features

- **Navigation Bar:** Located on the left side, allows navigation to different sections like Editions and Kiosk.
- **Editions Page:** Displays all editions. Clicking on an edition shows all cards within that edition.
- **Cards Page:** Displays cards within a selected edition. Users can change the quantity of each card they own. Cards are visually distinguished based on ownership. Users can sort and filter cards.
- **Kiosk Page:** Displays cards with quantities greater than 1, similar to the Cards page.

## Getting started

### Requirements

To run the project, you need the following technologies installed on your computer:

- Node.js
- MySQL

### Quickstart

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/react-gluth-mtg.git
   cd react-gluth-mtg
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root and add the following:
   ```
   DATABASE_URL='mysql+pymysql://mtg_user:Caprisun1!@localhost/mtg_dashboard'
   ```

3. **Install dependencies:**
   ```sh
   npm install
   ```

4. **Set up the database:**
   Ensure MySQL is running and execute the following SQL commands to create the required schema:
   ```sql
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

5. **Run the backend server:**
   ```sh
   npm run server
   ```

6. **Run the frontend development server:**
   ```sh
   npm start
   ```

7. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

### License

The project is proprietary (not open source). All rights reserved. Copyright (c) 2024.
```