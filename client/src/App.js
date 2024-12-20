import React, { useState, useEffect } from "react";
import { FornaContainer } from "fornac";

function NussinovApp() {
  const [sequence, setSequence] = useState("");
  const [dpTable, setDpTable] = useState([]);
  const [visitedCells, setVisitedCells] = useState([]);
  const [structure, setStructure] = useState("");
  const [error, setError] = useState("");
  const [isDpTableVisible, setIsDpTableVisible] = useState(true);

  const handleInputChange = (e) => {
    const capitalizedInput = e.target.value.toUpperCase();
    setSequence(capitalizedInput);
    setIsDpTableVisible(false);
    setDpTable([]);
    setVisitedCells([]);
    setStructure("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validCharacters = /^[AUCG]*$/i;

    if (sequence.length > 30) {
      setError("Please enter a valid RNA sequence (≤ 30 characters).");
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
        setDpTable(modifyDpTable(data.dp_table));
        setVisitedCells(data.visited_cells);
        setStructure(data.structure);
        setError("");
        setIsDpTableVisible(true);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("An unexpected error occurred while processing your request.");
    }
  };

  const FoldingBar = ({ isVisible, toggleVisibility }) => (
    <div
      style={{
        backgroundColor: '#f0f0f0',
        padding: '12px 20px',
        cursor: 'pointer',
        textAlign: 'center',
        borderRadius: '8px 8px 0 0',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        color: '#333',
      }}
      onClick={toggleVisibility}
    >
      <span>{isVisible ? 'Hide DP Table' : 'Show DP Table'}</span>
      <span style={{
        transform: isVisible ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease',
        fontSize: '30px',
      }}>
        ▼
      </span>
    </div>
  );

  useEffect(() => {
    if (structure && sequence) {
      try {
        const fornaContainer = new FornaContainer("#fornaContainer", {
          animation: false,
          zoomable: true,
          initialSize: [600, 300],
        });

        const options = {
          structure: structure,
          sequence: sequence,
        };

        fornaContainer.addRNA(options.structure, options);
      } catch (error) {
        console.error("Error initializing FornaContainer:", error);
      }
    }
  }, [structure, sequence]);

  const modifyDpTable = (dpTable) => {
    const rows = dpTable.length;
    const cols = dpTable[0].length;
    return dpTable.map((row, i) =>
      row.map((cell, j) => ({
        value: cell,
        style: {
          opacity: i >= j ? 0.5 : 1,
          backgroundColor: i >= j ? 'lightgray' : 'white',
        },
      }))
    );
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.errorBar}>{error}</div>}
      <h1>Nussinov Algorithm Visualization</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={sequence}
          onChange={handleInputChange}
          placeholder="Enter RNA Sequence (≤ 30 chars)"
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
    <FoldingBar
      isVisible={isDpTableVisible}
      toggleVisibility={() => setIsDpTableVisible(!isDpTableVisible)}
    />
    <div style={{
  ...styles.dpTableContainer,
  ...(isDpTableVisible ? {} : styles.dpTableHidden)
}}>
    {isDpTableVisible && (
      <>
        <h3>DP Table for RNA Sequence: {sequence}</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.dpTableHeader}></th>
                {sequence.split('').map((char, index) => (
                  <th key={`header-${index}`} style={styles.dpTableHeader}>
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpTable.map((row, i) => (
                <tr key={i}>
                  <td style={styles.dpTableHeader}>{sequence[i]}</td> 
                  {row.map((cell, j) => (
                      <td
                      key={`${i}-${j}`}
                      style={{
                          ...styles.cell,
                          ...cell.style,
                          ...(i === 0 && j === dpTable[0].length - 1
                          ? { backgroundColor: 'lightgreen' }
                          : visitedCells.some(([x, y]) => x === i && y === j)
                          ? styles.highlight
                          : {}),
                      }}
                      >
                      {cell.value}
                      </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}
    </div>
  </div>
)}
        {structure && (
          <div>
            <h3>Predicted Secondary Structure:</h3>
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
                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{char}</span>

                    </td>
                ))}
                </tr>
            </tbody>
            </table>
            <h3>Visualization:</h3>
            <div id="fornaContainer" style={styles.fornaContainer}></div> {/* Forna Container */}
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
    fontSize: "18px",
    padding: "5px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    fontSize: "18px",
    padding: "18px 20px",
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
    // maxHeight: "60vh",
    overflowY: "auto",
    textAlign: "center",
  },
  tableWrapper: {
    maxWidth: '100vw',
    maxHeight: '70vh',
    overflow: 'auto',
    margin: '0 auto',
  },
  table: {
    borderCollapse: "collapse",
    margin: "20px auto",
    width: "auto",
    minWidth: '100%',
    height: "auto",
    minHeight: '100%',
  },
  cell: {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
    width: "40px",
    height: "40px",
    fontSize: "20px",
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
  fontSize: "20px",
},
fornaContainer: {
  width: "80%",
  height: "400px",
  border: "1px solid black",
  marginTop: "20px",
  margin: "20px auto",
},
dpTableContainer: {
  maxHeight: '1000px',
  overflow: 'hidden',
  transition: 'max-height 0.3s ease-out',
},
dpTableHidden: {
  maxHeight: '0',
},
dpTableHeader: {
  border: "1px solid black",
  padding: "10px",
  textAlign: "center",
  width: "40px",
  height: "40px",
  fontSize: "20px",
  fontWeight: "bold",
  backgroundColor: "#f8f9fa",
  position: "sticky",
  top: 0,
  zIndex: 1,
},
};

export default NussinovApp;
