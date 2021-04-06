import React from "react";
import io from "socket.io/client-dist/socket.io";
import { v4 as uuidv4 } from "uuid";

class App extends React.Component {
  state = {
    tasks: [],
    taskName: "",
  };
  componentDidMount() {
    this.socket = io.connect("localhost:3000");
    this.socket.on("removeTask", (taskId) => this.removeTask(taskId));
    this.socket.on("addTask", (task) => this.addTask(task));
    this.socket.on("updateData", (tasks) => this.updateTasks(tasks));
  }
  removeTask = (taskId, isLocal) => {
    this.setState({
      tasks: this.state.tasks.filter((task) => task.id !== taskId),
    });
    if (isLocal === true) {
      this.socket.emit("removeTask", taskId);
    }
  };
  addTask = (task) => {
    this.setState({ tasks: [...this.state.tasks, task] });
  };
  submitForm = (event) => {
    event.preventDefault();
    const task = { name: this.state.taskName, id: uuidv4() };
    this.addTask(task);
    this.socket.emit("addTask", task);
    this.setState({ taskName: "" });
  };

  updateTasks = (tasks) => {
    this.setState({ tasks });
  };
  render() {
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((task) => (
              <li className="task" key={task.id}>
                {task.name}{" "}
                <button
                  className="btn btn--red"
                  onClick={() => this.removeTask(task.id, true)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form
            id="add-task-form"
            onSubmit={(submit) => this.submitForm(submit)}
          >
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={this.state.taskName}
              onChange={(event) =>
                this.setState({ taskName: event.target.value })
              }
            />
            <button
              className="btn"
              type="submit"
              disabled={!this.state.taskName}
            >
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
