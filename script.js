const progressBtns = document.querySelectorAll('.progress');
const addBtn = document.querySelector('#add-task');
const resetBtn = document.querySelector('#reset');
const taskList = document.querySelector('#tasks-cont');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function changeColor(e) {

    if (e.id == 'none') {

        e.nextElementSibling.style.backgroundColor = 'var(--white)';
        e.nextElementSibling.nextElementSibling.style.backgroundColor = 'var(--white)';
        e.style.backgroundColor = 'var(--red)';

    } else if (e.id == 'started') {

        e.previousElementSibling.style.backgroundColor = 'var(--white)';
        e.nextElementSibling.style.backgroundColor = 'var(--white)';
        e.style.backgroundColor = 'var(--yellow)';

    } else if (e.id == 'done'){

        e.previousElementSibling.style.backgroundColor = 'var(--white)';
        e.previousElementSibling.previousElementSibling.style.backgroundColor = 'var(--white)';
        e.style.backgroundColor = 'var(--green)';

    }
}

function deleteTask(e) {
    taskList.removeChild(e.parentElement.parentElement)
    console.log(tasks.indexOf(e.parentElement.parentElement.id))
    tasks.shift(e.parentElement.parentElement)
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log(tasks)
}

function addTask(e) {

    e.preventDefault();

    const parent = document.querySelector('#task-input');
    const task = (parent.querySelector('[name=task]')).value;
    const progBtns = parent.querySelectorAll('.progress');
    let count = tasks.map((task, i) => { return i });

    const item = {
        task,
        progress : 'none',
        number : count
    };

    tasks.push(item)
    populateList(tasks, taskList);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    (parent.querySelector('[name=task]')).value = '';
}

function populateList(tasks = [], taskList) {
    taskList.innerHTML = tasks.map((task, i) => {
      return `
        <div class="task" id="task${i}">
            <input type="text" class="text-input" value="${task.task}">
            <div class="btn-cont">
                <button id="none" class="progress" style="background-color: var(--red)"></button>
                <button id="started" class="progress"></button>
                <button id="done" class="progress"></button>
            </div>
            <div class="controls-cont">
                <img src="./images/x.svg" alt="delete" class="controls" id="delete">
                <img src="./images/drag.svg" alt="drag" class="controls" id="drag">
            </div>
        </div>
      `;
    }).join('');
}

function reset() {
    localStorage.clear();
    tasks = [];
    taskList.innerHTML = [].map((task,i)=> {
        return ``;
      })
}

function runBtns(e) {
    if (e.target.className == 'progress') {
        changeColor(e.target)
    } else if (e.target.id == 'delete') {
        deleteTask(e.target)
    }
}

progressBtns.forEach(btn => btn.addEventListener('click', changeColor));
addBtn.addEventListener('click', addTask);
resetBtn.addEventListener('click', reset);
document.addEventListener('click', runBtns);

populateList(tasks, taskList);