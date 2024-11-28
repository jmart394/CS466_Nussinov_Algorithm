import React, { useState } from "react";

function NussinovApp() {
  const [sequence, setSequence] = useState(""); // State for input sequence
  const [dpTable, setDpTable] = useState([]); // State for DP Table
  const [visitedCells, setVisitedCells] = useState([]); // State for visited cells
  const [structure, setStructure] = useState(""); // State for predicted structure
  const [error, setError] = useState(""); // State for errors

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validCharacters = /^[AUCG]*$/i; // Valid RNA characters

    // Validation: Check sequence length and validity
    if (sequence.length > 20) {
      alert("Please enter a valid RNA sequence (≤ 20 characters).");
      return;
    }
    if (!validCharacters.test(sequence)) {
      alert("Invalid sequence! Please use only A, U, C, and G.");
      return;
    }

    try {
      // Send the sequence to the backend for processing
      const response = await fetch("http://localhost:4000/nussinov", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence }),
      });

      const data = await response.json();
      if (response.ok) {
        setDpTable(data.dp_table);
        setVisitedCells(data.visited_cells);
        setStructure(data.structure);
        setError(""); // Clear errors if any
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("An unexpected error occurred while processing your request.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Nussinov Algorithm Visualization</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={sequence}
          onChange={(e) => setSequence(e.target.value)}
          placeholder="Enter RNA Sequence (≤ 20 chars)"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Run Algorithm
        </button>
      </form>
      <div style={styles.output}>
        {error && <p style={styles.error}>{error}</p>}
        {dpTable.length > 0 && (
          <div>
            <h3>DP Table for RNA Sequence: {sequence}</h3>
            <table style={styles.table}>
              <tbody>
                {dpTable.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={`${i}-${j}`}
                        style={{
                          ...styles.cell,
                          ...(visitedCells.some(
                            ([x, y]) => x === i && y === j
                          )
                            ? styles.highlight
                            : {}),
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {structure && (
          <div>
            <h3>Predicted Secondary Structure:</h3>
            <p>{structure}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "20px",
  },
  form: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "300px",
    height: "40px",
    fontSize: "16px",
    padding: "5px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    fontSize: "16px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  output: {
    marginTop: "20px",
    maxHeight: "60vh",
    overflowY: "auto",
    textAlign: "center",
  },
  table: {
    borderCollapse: "collapse",
    margin: "20px auto",
    maxWidth: "100%",
  },
  cell: {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
    width: "40px",
    height: "40px",
    fontSize: "12px",
  },
  highlight: {
    backgroundColor: "yellow",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

export default NussinovApp;
