//Input
let input = document.getElementById("input");

//Nav Buttons
let addButton = document.getElementById("add");
let deleteButton = document.getElementById("delete");
let updateButton = document.getElementById("update");
let doneTasksButton = document.getElementById("done-tasks");
let trashButton = document.getElementById("trash");
let allButtons = document.querySelectorAll("ul li:not(:first-child)");

//Output
let tasks = document.querySelector(".container .task-menu .tasks");

//Lock and unlock buttons when clicking on one of them
allButtons.forEach((b) => {
  let i = 0;
  b.onclick = () => {
    if (i > 0) {
      input.style.pointerEvents = "all";
      input.focus();
      allButtons.forEach((b) => b.classList.remove("not-in-use"));
      i = 0;
    } else {
      input.style.pointerEvents = "none";
      allButtons.forEach((b) => b.classList.add("not-in-use"));
      b.classList.remove("not-in-use");
      i++;
    }
  };
});

let arrayOfTasks;
let taskTrashArray;
let doneTasksArray = [];

window.onload = () => {
  if (window.localStorage.Tasks) {
    arrayOfTasks = JSON.parse(window.localStorage.Tasks);
    createTask(arrayOfTasks);
  } else {
    arrayOfTasks = [];
  }

  if (window.localStorage.Trash) {
    taskTrashArray = JSON.parse(window.localStorage.Trash);
  } else {
    taskTrashArray = [];
  }

  input.focus();
};

addButton.addEventListener("click", () => {
  if (input.value.trim() != "") {
    //Create Object
    let obj = {
      task: input.value,
      updateTask: false,
      deleteTask: false,
      doneTask: false,
    };

    //Push the object into the array
    arrayOfTasks.push(obj);

    //Add to local storage
    window.localStorage.Tasks = JSON.stringify(arrayOfTasks);

    //Create tasks
    createTask(arrayOfTasks);
  }
  input.value = "";
});

window.onkeyup = (e) => {
  if (e.key === "Enter") {
    addButton.click();
  }
};

let checkBoxAppearance = false;
let showDoneTasks = false;

function createTask(array) {
  tasks.innerHTML = "";

  for (let i = 0, j = 0; i < array.length; i++) {
    let div = document.createElement("div");
    div.className = "task";

    //For Done Tasks
    if (array[i].doneTask) {
      div.classList.add("done");
    } else {
      div.classList.remove("done");
    }

    let span = document.createElement("span");
    let spanText;
    if (checkBoxAppearance) {
      spanText = document.createElement("input");
      spanText.type = "checkbox";
      spanText.setAttribute("index", i);
    } else {
      spanText = document.createTextNode(i + 1);
    }
    span.appendChild(spanText);
    div.appendChild(span);

    let p = document.createElement("p");
    p.setAttribute("index", i);
    let pText = document.createTextNode(array[i].task);
    p.appendChild(pText);
    div.appendChild(p);

    tasks.appendChild(div);
  }

  var t = document.querySelectorAll(".container .tasks .task p");
  t.forEach((task) => {
    task.onclick = () => {
      let index = +task.getAttribute("index");
      if (task.parentElement.classList.contains("done")) {
        task.parentElement.classList.remove("done");
        arrayOfTasks[index].doneTask = false;

        //Add to local storage
        window.localStorage.Tasks = JSON.stringify(arrayOfTasks);
      } else {
        task.parentElement.classList.add("done");
        arrayOfTasks[index].doneTask = true;

        //Add to local storage
        window.localStorage.Tasks = JSON.stringify(arrayOfTasks);
      }
    };
  });

  let c = document.querySelectorAll(".container .tasks .task input");
  c.forEach((checkbox) => {
    checkbox.onclick = () => {
      let index = +checkbox.getAttribute("index");
      console.log(checkbox.checked);
      if (checkbox.checked) {
        arrayOfTasks[index].deleteTask = true;
        //Add to local storage
        window.localStorage.Tasks = JSON.stringify(arrayOfTasks);
      } else {
        arrayOfTasks[index].deleteTask = false;
        //Add to local storage
        window.localStorage.Tasks = JSON.stringify(arrayOfTasks);
      }
    };
  });
}

deleteButton.addEventListener("click", () => {
  if (checkBoxAppearance) {
    //Remove active class
    deleteButton.classList.remove("active");

    checkBoxAppearance = false;
    createTask(arrayOfTasks);

    arrayOfTasks.forEach((e) => {
      if (e.deleteTask) {
        taskTrashArray.push(e);
      }
    });
    arrayOfTasks = arrayOfTasks.filter((e, i) => {
      return !e.deleteTask;
    });

    window.localStorage.Trash = JSON.stringify(taskTrashArray);
    //Add to local storage
    window.localStorage.Tasks = JSON.stringify(arrayOfTasks);
    createTask(arrayOfTasks);
  } else {
    //Add active class
    deleteButton.classList.add("active");

    checkBoxAppearance = true;
    createTask(arrayOfTasks);
    let task = document.querySelectorAll(".container .task-menu .tasks .task");

    //Create Select All CheckBox Button
    let span = document.createElement("span");
    span.className = "all-checkboxes";
    let spanText = document.createTextNode("Delete - Select All");
    span.appendChild(spanText);
    let allCheckboxButton = document.createElement("input");
    allCheckboxButton.type = "checkbox";
    span.appendChild(allCheckboxButton);
    tasks.prepend(span);

    allCheckboxButton.onclick = () => {
      arrayOfTasks.forEach((t) => {
        if (allCheckboxButton.checked) {
          t.deleteTask = true;
          task.forEach((task) => (task.firstChild.firstChild.checked = true));
        } else {
          t.deleteTask = false;
          task.forEach((task) => (task.firstChild.firstChild.checked = false));
        }
      });
    };
  }
});

updateButton.addEventListener("click", () => {
  if (checkBoxAppearance) {
    //Remove active class
    updateButton.classList.remove("active");

    input.value = "";

    checkBoxAppearance = false;
    createTask(arrayOfTasks);
  } else {
    //Add active class
    updateButton.classList.add("active");

    checkBoxAppearance = true;
    createTask(arrayOfTasks);

    //Create Element
    let span = document.createElement("span");
    span.className = "update";
    let spanText = document.createTextNode("Update the subject");
    span.appendChild(spanText);
    tasks.prepend(span);

    let checkboxes = document.querySelectorAll(
      ".container .task-menu .tasks .task span input"
    );
    checkboxes.forEach((c) => {
      c.onclick = () => {
        let index = +c.getAttribute("index");
        if (c.checked) {
          input.value = arrayOfTasks[index].task;
          input.focus();

          //On Changing the subject of the task
          input.onkeyup = () => {
            arrayOfTasks[index].task = input.value;
            c.parentElement.nextElementSibling.innerHTML = input.value;
            //Add to local storage
            window.localStorage.Tasks = JSON.stringify(arrayOfTasks);
          };

          //Clear the checks
          checkboxes.forEach((c) => (c.checked = false));
          arrayOfTasks.forEach((a) => (a.updateTask = false));
          c.checked = true;
          arrayOfTasks[index].updateTask = true;

          //Add to local storage
          window.localStorage.Tasks = JSON.stringify(arrayOfTasks);
        } else {
          input.value = "";
          c.checked = false;
          arrayOfTasks[index].updateTask = false;
          //Add to local storage
          window.localStorage.Tasks = JSON.stringify(arrayOfTasks);
        }
      };
    });
  }
});

doneTasksButton.addEventListener("click", () => {
  if (showDoneTasks) {
    showDoneTasks = false;
    //Remove active class
    doneTasksButton.classList.remove("active");
    createTask(arrayOfTasks);
  } else {
    showDoneTasks = true;
    //Add active class
    doneTasksButton.classList.add("active");

    doneTasksArray = arrayOfTasks.filter((e) => e.doneTask);
    createTask(doneTasksArray);

    let span = document.createElement("span");
    span.className = "done-task";
    let spanText = document.createTextNode("Done Tasks");
    span.appendChild(spanText);
    tasks.prepend(span);
  }
});

let showTrash = false;
trashButton.addEventListener("click", () => {
  if (showTrash) {
    showTrash = false;
    //Remove active class
    trashButton.classList.remove("active");
    createTask(arrayOfTasks);
  } else {
    showTrash = true;
    //Add active class
    trashButton.classList.add("active");

    // createTask(taskTrashArray)
    createTask(taskTrashArray);
    let task = document.querySelectorAll(
      ".container .task-menu .tasks .task p"
    );
    task.forEach((e) => {
      e.style.pointerEvents = "none";
      e.parentElement.style.cursor = "auto";
    });
  }
});
