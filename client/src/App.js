import React, { useState } from "react";

function NussinovApp() {
  const [sequence, setSequence] = useState("");
  const [dpTable, setDpTable] = useState([]);
  const [visitedCells, setVisitedCells] = useState([]);
  const [structure, setStructure] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validCharacters = /^[AUCG]*$/i;

    if (sequence.length > 20) {
      setError("Please enter a valid RNA sequence (≤ 20 characters).");
      return;
    }
    if (!validCharacters.test(sequence)) {
      setError("Invalid sequence! Please use only A, U, C, and G.");
      return;
    }

    try {
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
        setError("");
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("An unexpected error occurred while processing your request.");
    }
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.errorBar}>{error}</div>}
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
            {/* <p>{structure}</p> */}
            <table style={styles.structureTable}>
            <tbody>
                <tr>
                {sequence.split('').map((char, index) => (
                    <td key={`seq-${index}`} style={styles.structureCell}>{char}</td>
                ))}
                </tr>
                <tr>
                {structure.split('').map((char, index) => (
                    <td key={`struct-${index}`} style={styles.structureCell}>
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{char}</span>

                    </td>
                ))}
                </tr>
            </tbody>
            </table>
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
    minHeight: "100vh",
    paddingTop: "10px",
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
    padding: "16px 20px",
    margin: "10px",
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
  errorBar: {
  backgroundColor: "#ffcccc",
  color: "#cc0000",
  padding: "10px",
  margin: "20px auto",
  width: "50%",
  textAlign: "center",
  fontWeight: "bold",
  position: "fixed",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
  borderRadius: '10px',
},

structureTable: {
  borderCollapse: "collapse",
  margin: "20px auto",
  maxWidth: "100%",
},
structureCell: {
  border: "1px solid black",
  padding: "10px",
  textAlign: "center",
  width: "30px",
  height: "30px",
  fontSize: "14px",
},
};

export default NussinovApp;
