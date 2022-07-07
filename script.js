const progressBtns = document.querySelectorAll('.progress');
const addBtn = document.querySelector('#add-task');
const resetBtn = document.querySelector('#reset');
const taskList = document.querySelector('#tasks-cont');
const taskInput = document.querySelector('.text-input');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let focused = false;
let update = false;

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
    tasks.shift(e.parentElement.parentElement)
    localStorage.setItem('tasks', JSON.stringify(tasks));

}

function addTask(e) {

    if (e.className == 'progress') {

        const parent = e.parentElement.parentElement;
        const task = (parent.querySelector('[name=task]')).value;
        const index = tasks.findIndex(name => name.task === task);

        const prog = e.id;
        const item = {
            task,
            progress : prog
        };

        tasks.splice(index, 1, item);
        localStorage.setItem('tasks', JSON.stringify(tasks));

    } else if (e.name == 'task') {
        
        setTimeout(() => {

            const parent = e.parentElement;
            const task = (parent.querySelector('[name=task]')).value;
            const index = tasks.findIndex(name => name.task === task);
            const progBtns = (parent.querySelectorAll('.progress'));
    
            let prog = 'none';
    
            progBtns.forEach(function(btn) {
                if (btn.style.backgroundColor != 'var(--white)') {
                    return prog = btn.id
                }
            })
    
            const item = {
                task,
                progress : prog
            };
    
            tasks.splice(index, 1, item);
            localStorage.setItem('tasks', JSON.stringify(tasks));

        }, 100);

    } else {

        e.preventDefault();

        const parent = document.querySelector('#task-input');
        const task = (parent.querySelector('[name=task]')).value;

        const item = {
            task,
            progress : 'none'
        };

        tasks.push(item)
        populateList(tasks, taskList);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        (parent.querySelector('[name=task]')).value = '';

    }
}

function populateList(tasks = [], taskList) {

    taskList.innerHTML = tasks.map((task, i) => {
      if (task.progress == 'none') {
        return `
        <div class="task" id="${i}">
            <input type="text" class="text-input" name="task" value="${task.task}">
            <div class="btn-cont">
                <button id="none" class="progress" style="background-color: var(--red)"></button>
                <button id="started" class="progress" style="background-color: var(--white)"></button>
                <button id="done" class="progress" style="background-color: var(--white)"></button>
            </div>
            <div class="controls-cont">
                <img src="./images/x.svg" alt="delete" class="controls" id="delete">
                <img src="./images/drag.svg" alt="drag" class="controls" id="drag">
            </div>
        </div>
      `;
      } else if (task.progress == 'started') {
        return `
        <div class="task" id="${i}">
            <input type="text" class="text-input" name="task" value="${task.task}">
            <div class="btn-cont">
                <button id="none" class="progress" style="background-color: var(--white)"></button>
                <button id="started" class="progress" style="background-color: var(--yellow)"></button>
                <button id="done" class="progress" style="background-color: var(--white)"></button>
            </div>
            <div class="controls-cont">
                <img src="./images/x.svg" alt="delete" class="controls" id="delete">
                <img src="./images/drag.svg" alt="drag" class="controls" id="drag">
            </div>
        </div>
      `;
      } else if (task.progress == 'done') {
        return `
        <div class="task" id="${i}">
            <input type="text" class="text-input" name="task" value="${task.task}">
            <div class="btn-cont">
                <button id="none" class="progress" style="background-color: var(--white)"></button>
                <button id="started" class="progress" style="background-color: var(--white)"></button>
                <button id="done" class="progress" style="background-color: var(--green)"></button>
            </div>
            <div class="controls-cont">
                <img src="./images/x.svg" alt="delete" class="controls" id="delete">
                <img src="./images/drag.svg" alt="drag" class="controls" id="drag">
            </div>
        </div>
      `;
      }
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
        addTask(e.target)

    } else if (e.target.id == 'delete') {

        deleteTask(e.target)

    } else if (e.target.name == 'task') {

        update = true;

    } else {

        update = false;

    }
}

function keyPress(e) {

    if (e.key == 'Enter' && focused == true) {

        addBtn.click();

    } else if (update == true) {

        addTask(document.activeElement)

    }

}

taskInput.onfocus = () => {focused = true};
taskInput.onblur = () => {focused = false};
progressBtns.forEach(btn => btn.addEventListener('click', changeColor));
addBtn.addEventListener('click', addTask);
resetBtn.addEventListener('click', reset);
document.addEventListener('click', runBtns);
document.onkeydown = keyPress;

populateList(tasks, taskList);