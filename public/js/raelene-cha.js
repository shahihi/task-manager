// Fetch tasks from backend and display them
async function getTasks() {
    try {
        const response = await fetch('http://localhost:5050/view-tasks');

        // Error: Corrupted JSON or server error (500)
        if (response.status === 500) {
            displayMessage("Unable to load tasks due to server error.");
            return;
        }

        // Success: Tasks retrieved
        const tasks = await response.json();

        // Filter tasks created by logged-in user
        const filteredTasks = tasks.filter(task => task.createdBy === localStorage.getItem("email"));

        displayTasks(filteredTasks);

    } catch (error) {
        // Network error or unexpected issues
        displayMessage("An unexpected error occurred. Please try again later.");
    }
}


// Display tasks in two columns
function displayTasks(tasks) {
    const pendingContainer = document.getElementById("pending-tasks");
    const completedContainer = document.getElementById("completed-tasks");
    let numberOfTasks = { pending: 0, completed: 0 };

    pendingContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    const corruptedRecords = findCorruptedRecords(tasks);
    if (corruptedRecords.length > 0) {
        displayMessage("Some tasks could not be displayed due to data corruption.");
        return;
    }

    tasks.forEach(task => {
        const item = document.createElement("div");
        item.classList.add("task-item");

        item.innerHTML = `
            <p>${task.title}</p>
        `;

        if (task.status === "completed") {
            completedContainer.appendChild(item);
            numberOfTasks.completed += 1;
        } else {
            pendingContainer.appendChild(item);
            numberOfTasks.pending += 1;
        }
    });

    // No tasks
    if (numberOfTasks.pending === 0) displayMessage("No pending tasks.", true, false);
    if (numberOfTasks.completed === 0) displayMessage("No completed tasks.", false, true);
}


// Display error or empty-state messages
function displayMessage(message, showInPending = true, showInCompleted = true) {
    const pendingContainer = document.getElementById("pending-tasks");
    const completedContainer = document.getElementById("completed-tasks");

    if (showInPending) pendingContainer.innerHTML = `<p class='message error'>${message}</p>`;
    if (showInCompleted) completedContainer.innerHTML = `<p class='message error'>${message}</p>`;
}

// DATA VALIDATION / CORRUPTION CHECK
function findCorruptedRecords(tasks) {
    return tasks.filter(task => {
        // Required fields must exist
        const missingField =
            !task.id ||
            task.title == null ||
            task.status == null ||
            !task.createdBy;


        //email must be valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = task.createdBy;
        const invalidEmail = (!emailRegex.test(emailInput));

        //status must be either "pending" or "completed"
        const invalidStatus = task.status !== "pending" && task.status !== "completed";

        return missingField || invalidEmail || invalidStatus;
    });
}