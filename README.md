# react-gluth-mtg

react-gluth-mtg is a web application designed to help users track their Magic: The Gathering (MTG) card collection. The app provides functionalities to filter, sort, and manage card quantities, offering a visual distinction between owned and unowned cards. Additionally, it features a Kiosk page for cards with quantities greater than one.

## Overview

The application is built using React for the frontend and Node.js with Express for the backend. It interfaces with a MySQL database to store information about card editions and individual cards. The app features multiple pages, including a homepage, editions page, cards page, and kiosk page. State management in the frontend is handled using React Context or Redux, and Axios or Fetch API is used for making requests to the backend.

### Architecture and Technologies

- **Frontend:** React, React Bootstrap for styling, React Router DOM for routing, React Context or Redux for state management.
- **Backend:** Node.js with Express for handling API requests.
- **Database:** MySQL using Sequelize ORM.
- **Styling:** Bootstrap.
- **HTTP Client:** Axios.

### Project Structure

- **Backend:**
  - `server/config/database.js`: Configures and initializes the MySQL database connection using Sequelize.
  - `server/index.js`: Sets up the Express.js server.
  - `server/models/`: Contains Sequelize models for `Card`, `Edition`, `Collection`, and `Kiosk`.
  - `server/routes/`: Defines API routes for fetching and updating card and edition data.
  - `server/middleware/validateQuantity.js`: Middleware for validating card quantities.

- **Frontend:**
  - `src/`: Contains React components, pages, and context for state management.
  - `src/components/`: Components like `Navbar`, `SortingFilteringControls`, `CardItem`, and `EditionCard`.
  - `src/pages/`: Pages like `Home`, `Editions`, `Edition`, `Cards`, and `Kiosk`.
  - `src/context/`: Context and reducer for managing card state.
  - `src/services/`: Service functions for making API requests.
  - `src/utils/`: Utility functions for sorting and filtering.

## Features

- **Navigation Bar:** A left-sided navigation bar for easy access to different sections like Editions and Kiosk.
- **Editions Page:** Displays all editions in a grid format with set symbols. Clicking on an edition shows all cards within that edition.
- **Cards Page:** Displays cards within a selected edition, allows changing card quantities, and visually distinguishes owned vs. unowned cards. Provides sorting and filtering functionalities.
- **Kiosk Page:** Similar to the Cards page but displays cards with quantities greater than one.

## Getting Started

### Requirements

Ensure you have the following installed on your machine:

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Quickstart

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/react-gluth-mtg.git
   cd react-gluth-mtg
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root and add the following:
   ```env
   DATABASE_URL='mysql+pymysql://mtg_user:Caprisun1!@localhost/mtg_dashboard'
   ```

3. **Install backend dependencies:**
   ```sh
   cd server
   npm install
   ```

4. **Install frontend dependencies:**
   ```sh
   cd ../
   npm install
   ```

5. **Set up the database:**
   Ensure your MySQL server is running and execute the following SQL commands to create the required tables:
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

6. **Run the backend server:**
   ```sh
   cd server
   npm start
   ```

7. **Run the frontend development server:**
   ```sh
   cd ../
   npm start
   ```

8. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

### License

The project is proprietary (not open source). Copyright (c) 2024.
