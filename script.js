// ================= DOM =================
const taskInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");
const tasksList = document.querySelector("#tasks-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");

const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.querySelector("#clear-completed-btn");
const clearAllBtn = document.querySelector("#clear-all-btn");

// ================= VARIABLES =================
let tasks = JSON.parse(localStorage.getItem("todo_tasks")) || [];
let currentFilter = "all";

// ================= SAVE =================
function saveTasks() {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
}

// ================= ADD TASK =================
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        status: "active"
    });

    taskInput.value = "";

    saveTasks();

    render();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(e){

    if(e.key==="Enter"){
        addTask();
    }

});

// ================= FILTER =================
filterBtns.forEach(btn=>{

    btn.addEventListener("click",function(){

        filterBtns.forEach(b=>b.classList.remove("active"));

        this.classList.add("active");

        currentFilter=this.dataset.filter;

        render();

    });

});

// ================= CLEAR =================
clearCompletedBtn.addEventListener("click",function(){

    tasks=tasks.filter(task=>task.status!=="completed");

    saveTasks();

    render();

});

clearAllBtn.addEventListener("click",function(){

    tasks=[];

    saveTasks();

    render();

});

// ================= EVENT DELEGATION =================
tasksList.addEventListener("click",function(e){

    const item=e.target.closest(".task-item");

    if(!item) return;

    const id=Number(item.dataset.id);

    const task=tasks.find(t=>t.id===id);

    if(!task) return;

    // COMPLETE
    if(e.target.closest(".btn-green")){

        if(task.status==="completed"){
            task.status="active";
        }
        else{
            task.status="completed";
        }

    }

    // FAILED
    if(e.target.closest(".btn-red")){

        if(task.status==="failed"){
            task.status="active";
        }
        else{
            task.status="failed";
        }

    }

    saveTasks();

    render();

});

// ================= RENDER =================
function render(){

    tasksList.innerHTML="";

    let filteredTasks=tasks.filter(task=>{

        if(currentFilter==="active"){

            return task.status==="active";

        }

        if(currentFilter==="completed"){

            return task.status==="completed";

        }

        return true;

    });

    if(filteredTasks.length===0){

        emptyState.style.display="flex";

        if(currentFilter==="completed"){

            emptyState.querySelector("p").textContent="No completed tasks.";

        }

        else if(currentFilter==="active"){

            emptyState.querySelector("p").textContent="No active tasks.";

        }

        else{

            emptyState.querySelector("p").textContent="No tasks yet. Add one above!";

        }

    }

    else{

        emptyState.style.display="none";

    }

    filteredTasks.forEach(task=>{

        const li=document.createElement("li");

        li.className=`task-item ${task.status}`;

        li.dataset.id=task.id;

        let badge="";

        if(task.status==="completed"){

            badge=`<span class="status-badge green">
            <i class="fa-solid fa-circle-check"></i>
            </span>`;

        }

        if(task.status==="failed"){

            badge=`<span class="status-badge red">
            <i class="fa-solid fa-circle-xmark"></i>
            </span>`;

        }

        li.innerHTML=`

            <div class="status-indicator">

                ${badge}

                <span class="task-text">${task.text}</span>

            </div>

            <div class="hover-actions">

                <button class="action-icon-btn btn-green">

                    <i class="fa-solid fa-check"></i>

                </button>

                <button class="action-icon-btn btn-red">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>

        `;

        tasksList.appendChild(li);

    });

    let remaining=tasks.filter(task=>task.status==="active").length;

    remainingCount.textContent=remaining;

}

render();