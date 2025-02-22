import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import NewTaskModal from "./NewTaskModal";

// Helper to reorder tasks after drag-and-drop
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Modal Component for creating a new task

const Goals = ({ darkmode }) => {
  // TASK STRUCTURE:
  // { id, text, details, startDate, dueDate, completed, starred, target, solved }
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks"); // "tasks" or "completed"
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);




  // New task state includes target and initializes solved count to 0
  const [newTask, setNewTask] = useState({
    text: "",
    details: "",
    startDate: "",
    dueDate: "",
    target: 0,
  });

    // fetch tasks from database

  // useEffect(() => {
  //   fetch("http://localhost:8000/tasks/")
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setTasks(res);
  //     });
  // }, [newTask]);

  // Colors based on dark mode
  const bgColor = darkmode ? "#202124" : "#fff";
  const textColor = darkmode ? "#e8eaed" : "#202124";
  const borderColor = darkmode ? "#5f6368" : "#dadce0";
  const inputBg = darkmode ? "#303134" : "#f1f3f4";
  const buttonBg = darkmode ? "#8ab4f8" : "#1a73e8";

  // Overall container style (centered, 33vw max on large devices, full on small screens)
  const containerStyle = {
    width: "100%",
    maxWidth: "100vw",
    minWidth: "300px",
    // margin: "0 auto",
    height: "92vh",
    display: "flex",
    top: "8vh",
    flexDirection: "row",
    backgroundColor: bgColor,
    color: textColor,
    fontFamily: '"Roboto", sans-serif',
  };

  // Sidebar style
  const sidebarStyle = {
    width: "220px",
    borderRight: `1px solid ${borderColor}`,
    padding: "15px",
    boxSizing: "border-box",
  };

  // Main panel style
  const mainPanelStyle = {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    position: "relative",
  };

  // Sidebar tab button style
  const tabButtonStyle = (active) => ({
    display: "block",
    width: "100%",
    padding: "10px",
    backgroundColor: active ? buttonBg : "transparent",
    color: active ? "#fff" : textColor,
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    marginBottom: "10px",
    borderRadius: "4px",
  });

  // Task item style
  const taskItemStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    borderBottom: `1px solid ${borderColor}`,
    marginBottom: "5px",
    borderRadius: "4px",
    backgroundColor: darkmode ? "#303134" : "#f9f9f9",
  };

  // Header row style for task card
  const taskHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  // Star button style
  const starButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "1.4em",
    cursor: "pointer",
    color: textColor,
  };

  // Checkbox style
  const checkboxStyle = {
    marginRight: "10px",
    cursor: "pointer",
  };

  // Task text style
  const taskTextStyle = {
    flex: 1,
    fontSize: "1.1em",
    cursor: "pointer",
    wordBreak: "break-word",
  };

  // Details text style
  const taskDetailsStyle = {
    fontSize: "0.95em",
    marginTop: "5px",
    color: darkmode ? "#9aa0a6" : "#5f6368",
  };

  // Progress display style
  const progressStyle = {
    marginTop: "8px",
    fontSize: "0.9em",
    fontWeight: "bold",
    color: buttonBg,
  };

  // Inline edit input style
  const editInputStyle = {
    flex: 1,
    padding: "8px",
    backgroundColor: inputBg,
    color: textColor,
    border: `1px solid ${borderColor}`,
    borderRadius: "4px",
  };

  // Floating Create Button style
  const floatingButtonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: buttonBg,
    color: "#fff",
    border: "none",
    fontSize: "32px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    zIndex: 50,
  };

  // Handler to create a new task from the modal.
  // New tasks get default values: solved = 0, starred = false.
  const handleCreateTask = () => {
    const task = {
      id: Date.now().toString(),
      text: newTask.text,
      details: newTask.details,
      startDate: newTask.startDate,
      dueDate: newTask.dueDate,
      completed: false,
      starred: false,
      target: newTask.target,
      solved: 0,
    };
    setTasks([...tasks, task]);
    setNewTask({
      text: "",
      details: "",
      startDate: "",
      dueDate: "",
      target: 0,
    });
    setIsModalOpen(false);
  };

  // Inline editing for task title (on double-click)
  const handleStartEditing = (id, currentText) => {
    setEditingTaskId(id);
    setEditingTaskText(currentText);
  };

  const handleFinishEditing = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editingTaskText } : task
      )
    );
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  // Toggle starred status
  const toggleStarred = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, starred: !task.starred } : task
      )
    );
  };

  // Toggle task completed status
  const toggleTaskCompleted = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    if(window.confirm("Are you sure you want to delete this task?")){
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // Increment solved count for a task (“Solve Problem” action)
  const solveProblem = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          // Only increment if solved is less than target
          if (task.solved < task.target) {
            return { ...task, solved: task.solved + 1 };
          }
        }
        return task;
      })
    );
  };

  // Filter tasks by active or completed
  const activeTasks = tasks.filter((task) => !task.completed);
  const starredTasks = tasks.filter((task) => task.starred);
  const completedTasks = tasks.filter((task) => task.completed);

  // Drag-and-drop handler for active tasks reordering
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(
      activeTasks,
      result.source.index,
      result.destination.index
    );
    // Merge reordered active tasks with unchanged completed tasks
    setTasks([...reordered, ...completedTasks]);
  };

  // Calculate progress percentage (if target > 0)
  const getProgressPercentage = (task) =>
    task.target > 0 ? Math.round((task.solved / task.target) * 100) : 0;

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={{ fontSize: "1.5em", marginBottom: "20px" }}>
          Tasks
        </h2>
        <button
          style={tabButtonStyle(activeTab === "tasks")}
          onClick={() => setActiveTab("tasks")}
        >
          My Tasks
        </button>
        <button
          style={tabButtonStyle(activeTab === "completed")}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
        <button
          style={tabButtonStyle(activeTab === "starred")}
          onClick={() => setActiveTab("starred")}
        >
          Starred
        </button>
      </div>

      {/* Main Panel */}
      <div style={mainPanelStyle}>
        {activeTab === "tasks" && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="activeTasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {activeTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          style={{
                            ...taskItemStyle,
                            ...provided.draggableProps.style,
                          }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div style={taskHeaderStyle}>
                            <button
                              onClick={() => toggleStarred(task.id)}
                              style={starButtonStyle}
                              title="Toggle Starred"
                            >
                              {task.starred ? "★" : "☆"}
                            </button>
                            {editingTaskId === task.id ? (
                              <input
                                type="text"
                                value={editingTaskText}
                                onChange={(e) =>
                                  setEditingTaskText(e.target.value)
                                }
                                onBlur={() => handleFinishEditing(task.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleFinishEditing(task.id);
                                }}
                                style={editInputStyle}
                                autoFocus
                              />
                            ) : (
                              <span
                                style={{
                                  ...taskTextStyle,
                                  textDecoration: task.completed
                                    ? "line-through"
                                    : "none",
                                }}
                                onDoubleClick={() =>
                                  handleStartEditing(task.id, task.text)
                                }
                              >
                                {task.text}
                              </span>
                            )}
                          </div>
                          {task.details && (
                            <div style={taskDetailsStyle}>
                              {task.details}
                            </div>
                          )}
                          <div style={{ marginTop: "8px", display: "flex", alignItems: "center" }}>
                            <span style={{marginLeft: "10px", fontSize: "0.85em", color: darkmode ? "#9aa0a6" : "#5f6368"}}>
                              {task.dueDate ? `Due: ${task.dueDate}` : ""}
                            </span>
                          </div>
                          <div style={progressStyle}>
                            Progress: {task.solved}/{task.target} (
                            {getProgressPercentage(task)}%)
                          </div>
                          {/* {task.solved < task.target && !task.completed && (
                            <button
                              onClick={() => solveProblem(task.id)}
                              style={{
                                marginTop: "8px",
                                padding: "6px 10px",
                                backgroundColor: buttonBg,
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              Solve Problem
                            </button>
                          )} */}
                          <div style={{ marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                            {/* <button
                              onClick={() => toggleTaskCompleted(task.id)}
                              style={{
                                padding: "6px 10px",
                                backgroundColor: darkmode ? "#5f6368" : "#dadce0",
                                color: textColor,
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginRight: "8px",
                              }}
                              title="Mark as Completed"
                            >
                              ✓
                            </button> */}
                            <button
                              onClick={() => deleteTask(task.id)}
                              style={{
                                padding: "6px 10px",
                                backgroundColor: "red",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                              title="Delete Task"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

    {activeTab === "starred" && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="activeTasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {starredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          style={{
                            ...taskItemStyle,
                            ...provided.draggableProps.style,
                          }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div style={taskHeaderStyle}>
                            <button
                              onClick={() => toggleStarred(task.id)}
                              style={starButtonStyle}
                              title="Toggle Starred"
                            >
                              {task.starred ? "★" : "☆"}
                            </button>
                            {editingTaskId === task.id ? (
                              <input
                                type="text"
                                value={editingTaskText}
                                onChange={(e) =>
                                  setEditingTaskText(e.target.value)
                                }
                                onBlur={() => handleFinishEditing(task.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleFinishEditing(task.id);
                                }}
                                style={editInputStyle}
                                autoFocus
                              />
                            ) : (
                              <span
                                style={{
                                  ...taskTextStyle,
                                  textDecoration: task.completed
                                    ? "line-through"
                                    : "none",
                                }}
                                onDoubleClick={() =>
                                  handleStartEditing(task.id, task.text)
                                }
                              >
                                {task.text}
                              </span>
                            )}
                          </div>
                          {task.details && (
                            <div style={taskDetailsStyle}>
                              {task.details}
                            </div>
                          )}
                          <div style={{ marginTop: "8px", display: "flex", alignItems: "center" }}>
                            <span style={{marginLeft: "10px", fontSize: "0.85em", color: darkmode ? "#9aa0a6" : "#5f6368"}}>
                              {task.dueDate ? `Due: ${task.dueDate}` : ""}
                            </span>
                          </div>
                          <div style={progressStyle}>
                            Progress: {task.solved}/{task.target} (
                            {getProgressPercentage(task)}%)
                          </div>
                          {/* {task.solved < task.target && !task.completed && (
                            <button
                              onClick={() => solveProblem(task.id)}
                              style={{
                                marginTop: "8px",
                                padding: "6px 10px",
                                backgroundColor: buttonBg,
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              Solve Problem
                            </button>
                          )} */}
                          <div style={{ marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                            {/* <button
                              onClick={() => toggleTaskCompleted(task.id)}
                              style={{
                                padding: "6px 10px",
                                backgroundColor: darkmode ? "#5f6368" : "#dadce0",
                                color: textColor,
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginRight: "8px",
                              }}
                              title="Mark as Completed"
                            >
                              ✓
                            </button> */}
                            <button
                              onClick={() => deleteTask(task.id)}
                              style={{
                                padding: "6px 10px",
                                backgroundColor: "red",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                              title="Delete Task"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {activeTab === "completed" && (
          <div>
            {completedTasks.length === 0 && (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                No completed tasks
              </p>
            )}
            {completedTasks.map((task) => (
              <div key={task.id} style={taskItemStyle}>
                <div style={taskHeaderStyle}>
                  <button
                    onClick={() => toggleStarred(task.id)}
                    style={starButtonStyle}
                    title="Toggle Starred"
                  >
                    {task.starred ? "★" : "☆"}
                  </button>
                  <span
                    style={{
                      ...taskTextStyle,
                      textDecoration: "line-through",
                    }}
                  >
                    {task.text}
                  </span>
                </div>
                {task.details && (
                  <div style={taskDetailsStyle}>{task.details}</div>
                )}
                <div style={progressStyle}>
                  Progress: {task.solved}/{task.target} (
                  {getProgressPercentage(task)}%)
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "red",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    title="Delete Task"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      {activeTab === "tasks" && (
        <button
          style={floatingButtonStyle}
          onClick={() => setIsModalOpen(true)}
          title="Create New Task"
        >
          +
        </button>
      )}

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
        newTask={newTask}
        setNewTask={setNewTask}
        darkmode={darkmode}
      />
    </div>
  );
};

export default Goals;
