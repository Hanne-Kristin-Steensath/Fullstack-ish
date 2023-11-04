import { useState, useEffect, useRef } from "react";
import "../src/index.css";

function TaskList() {
  const [listData, setListData] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const taskInputRef = useRef();

  useEffect(() => {
    fetch("/api/lists/1/1")
      .then((response) => response.json())
      .then((data) => setListData(data))
      .catch((error) => console.error("Error fetching list data: ", error));
  }, []);

  const addNewTask = () => {
    fetch("/api/lists/1/1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: newTask }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedTasks = [...listData.tasks];
        updatedTasks.push(data);
        setListData({ ...listData, tasks: updatedTasks });
        setNewTask("");
      })
      .catch((error) => console.error("Error adding new task: ", error));
  };

  const EditingTask = (index) => {
    setEditingTask(index);
    setEditedTaskName(listData.tasks[index].name);
  };

  const saveEditedTask = (index) => {
    const task = listData.tasks[index];
    if (!task || !task.id) {
      console.error("Task ID is missing.");
      return;
    }

    const taskId = task.id;
    fetch(`/api/lists/1/1/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskName: editedTaskName }),
    })
      .then((response) => {
        if (response.status === 200) {
          const updatedTasks = [...listData.tasks];
          updatedTasks[index].name = editedTaskName;
          setListData({ ...listData, tasks: updatedTasks });
          setEditingTask(null);
        } else {
          console.error("Error updating task");
        }
      })
      .catch((error) => console.error("Error updating task: ", error));
  };

  const deleteTask = (taskId) => {
    fetch(`/api/lists/1/1/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          const updatedTasks = listData.tasks.filter(
            (task) => task.id !== taskId
          );
          setListData({ ...listData, tasks: updatedTasks });
        } else {
          console.error("Error deleting task");
        }
      })
      .catch((error) => console.error("Error deleting task: ", error));
  };

  return (
    <div className="container">
      <h2 className="task-list-header">Your to-do list</h2>
      {listData && (
        <div>
          <div className="addTask">
            <h3>{listData.list_name}</h3>
            <input
              className="task-input"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              ref={taskInputRef}
            />
            <button className="add-task-button" onClick={addNewTask}>
              Add Task
            </button>
          </div>
          <ul className="task-list">
            {listData.tasks.map((task, index) => (
              <li key={task.id} className="task-item">
                {editingTask === index ? (
                  <div className="task-text">
                    <input
                      type="text"
                      value={editedTaskName}
                      onChange={(e) => setEditedTaskName(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="task-text">{task.name}</div>
                )}

                <div className="buttonContainer">
                  {editingTask === index ? (
                    <button
                      className="edit-button"
                      onClick={() => saveEditedTask(index)}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        className="edit-button"
                        onClick={() => EditingTask(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TaskList;
