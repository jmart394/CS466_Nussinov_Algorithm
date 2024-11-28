# CS466 Nussinov Algorithm

This project implements the Nussinov algorithm, as discussed in class, to visualize RNA secondary structure prediction. It features a React-based frontend and a Flask backend for running the algorithm.

## Features
- A user-friendly web interface to input RNA sequences.
- Dynamic programming visualization of the Nussinov algorithm.
- Integration of React for the frontend and Flask for the backend.

---

## Installation and Setup

### Instructions to Run the Application

1. **Set up the Flask Backend**
   - Open a terminal and navigate to the `flask-server` folder:
     ```bash
     cd flask-server
     ```
   - Activate the virtual environment:
     ```bash
     source venv/bin/activate
     ```
   - Install required Python packages:
     ```bash
     pip install Flask
     ```
     ```bash
     pip install flask-cors
     ```
   - Run the Flask server (using port 4000 to avoid conflicts):
     ```bash
     flask run --port=4000
     ```
     > ⚠️ Note: The backend is configured for port 4000, as port 5000 is commonly used by other services on macOS.

2. **Set up the React Frontend**
   - Open another terminal and navigate to the `client` folder:
     ```bash
     cd client
     ```
   - Install necessary Node.js dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm start
     ```
   - Your application should now be running at `http://localhost:3000`.

---

## Project Structure

- **Frontend (React)**: All React code is in the `client/src` folder.
  - Key file: `client/src/App.js`

- **Backend (Flask)**: The backend logic resides in the `flask-server` folder.
  - Key files:
    - `flask-server/app.py`: Handles server-side routes and communication.
    - `flask-server/nussinov_algorithm.py`: Contains the implementation of the Nussinov algorithm.

---

## Development Notes

### Key Files:
- `App.js`: Handles the frontend logic for taking user input and rendering the DP table and structure.
- `app.py`: Connects the backend to the frontend, processes user requests, and executes the algorithm.
- `nussinov_algorithm.py`: Implements the core Nussinov algorithm.

### Resources
This video helped in setting up the communication between React and Flask:
[React and Flask Full Stack Tutorial](https://www.youtube.com/watch?v=7LNl2JlZKHA)

---

## Troubleshooting
### Common Issues:
1. **Flask Port Conflicts**:
   - If port 4000 is in use, try running Flask on another port:
     ```bash
     flask run --port=5001
     ```
   - Update the fetch request in `App.js` to match the new port:
     ```javascript
     const response = await fetch("http://localhost:<new-port>/nussinov", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ sequence }),
     });
     ```

2. **React Port Conflicts**:
   - If port 3000 is unavailable, React will prompt to use a different port. Confirm this or manually set a custom port.

---

## Future Edits
Group members can edit the following files:
- **`App.js` (Frontend)**: Modify input validation, UI design, or table rendering logic.
- **`app.py` (Backend)**: Adjust route handling or communication with the frontend.
- **`nussinov_algorithm.py` (Algorithm)**: Update the algorithm logic or add new functionality.

---

