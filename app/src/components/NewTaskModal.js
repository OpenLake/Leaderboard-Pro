const NewTaskModal = ({
    isOpen,
    onClose,
    onCreate,
    newTask,
    setNewTask,
    darkmode,
  }) => {
    if (!isOpen) return null;
  
    // Colors based on dark mode
    const bgColor = darkmode ? "#202124" : "#fff";
    const textColor = darkmode ? "#e8eaed" : "#202124";
    const borderColor = darkmode ? "#5f6368" : "#dadce0";
    const inputBg = darkmode ? "#303134" : "#f1f3f4";
    const buttonBg = darkmode ? "#8ab4f8" : "#1a73e8";
  
    const overlayStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: darkmode
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(0, 0, 0, 0.4)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  
    // const dueDateStyle = {
    //   marginLeft: "10px",
    //   fontSize: "0.85em",
    //   color: darkmode ? "#9aa0a6" : "#5f6368",
    // };
    
  
    const modalStyle = {
      backgroundColor: bgColor,
      color: textColor,
      padding: "20px",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "500px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    };
  
    const inputStyle = {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      backgroundColor: inputBg,
      color: textColor,
      border: `1px solid ${borderColor}`,
      borderRadius: "4px",
      boxSizing: "border-box",
    };
  
    const numberInputStyle = {
      ...inputStyle,
      padding: "10px",
      width: "100%",
    };
  
    const buttonStyle = {
      padding: "10px 15px",
      backgroundColor: buttonBg,
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "10px",
    };
  
    const cancelButtonStyle = {
      ...buttonStyle,
      backgroundColor: "#ccc",
      color: "#000",
    };
  
    const handleCreate = () => {
      if (newTask.text.trim() === "") {
        alert("Task title cannot be empty");
        return;
      }
      if (newTask.target <= 0) {
        alert("Please set a valid target (number of problems to solve)");
        return;
      }
      onCreate();
    };
  
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2 style={{ marginTop: 0, textAlign: "center" }}>New Task</h2>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.text}
            onChange={(e) =>
              setNewTask({ ...newTask, text: e.target.value })
            }
            style={inputStyle}
          />
          <textarea
            placeholder="Description (optional)"
            value={newTask.details}
            onChange={(e) =>
              setNewTask({ ...newTask, details: e.target.value })
            }
            style={{ ...inputStyle, height: "80px", resize: "vertical" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              type="date"
              placeholder="Start date"
              value={newTask.startDate}
              onChange={(e) =>
                setNewTask({ ...newTask, startDate: e.target.value })
              }
              style={{ ...inputStyle, width: "48%", marginBottom: "0" }}
            />
            <input
              type="date"
              placeholder="Due date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              style={{ ...inputStyle, width: "48%", marginBottom: "0" }}
            />
          </div>
          <input
            type="number"
            placeholder="Target Problems to Solve"
            value={newTask.target}
            onChange={(e) =>
              setNewTask({ ...newTask, target: Number(e.target.value) })
            }
            style={numberInputStyle}
            min="1"
          />
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button onClick={handleCreate} style={buttonStyle}>
              Create
            </button>
            <button onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

export default NewTaskModal;