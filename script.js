const progressBtns = document.querySelectorAll('.progress');        // Global Variables
const addBtn = document.querySelector('#add-task');
const resetBtn = document.querySelector('#reset');
const taskList = document.querySelector('#tasks-cont');
const taskInput = document.querySelector('.text-input');
const date = document.querySelector('input[type=date]');
const dragBtns = document.querySelectorAll('.drag');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentDate = JSON.parse(localStorage.getItem('date')) || [];
let focused = false;
let update = false;

if (currentDate == '') {        // Sets default date

    const thisDate = new Date();
    const today = thisDate.getFullYear().toString() + '-' + (thisDate.getMonth() + 1).toString().padStart(2, 0) +
    '-' + thisDate.getDate().toString().padStart(2, 0);

    date.value = today;

    currentDate.push(today);
    localStorage.setItem('date', JSON.stringify(today));

} else {
    
    date.value = currentDate;

}

function changeColor(e) {       // Changes progress buttons color

    const parent = e.parentElement;
    const none = (parent.querySelector('[id=none]'));
    const started = (parent.querySelector('[id=started]'));
    const done = (parent.querySelector('[id=done]'));

    if (e.id == 'none') {

        none.style.backgroundColor = 'var(--red)';
        started.style.backgroundColor = 'var(--white)';
        done.style.backgroundColor = 'var(--white)';

    } else if (e.id == 'started') {

        none.style.backgroundColor = 'var(--white)';
        started.style.backgroundColor = 'var(--yellow)';
        done.style.backgroundColor = 'var(--white)';

    } else if (e.id == 'done'){

        none.style.backgroundColor = 'var(--white)';
        started.style.backgroundColor = 'var(--white)';
        done.style.backgroundColor = 'var(--green)';

    }

}

function deleteTask(e) {        // Deletes individual tasks

    taskList.removeChild(e.parentElement.parentElement)
    tasks.shift(e.parentElement.parentElement)
    localStorage.setItem('tasks', JSON.stringify(tasks));

}

function addTask(e) {        // Adds/Updates individual tasks to local storage

    if (e.className == 'progress') {        // Updates progress

        const parent = e.parentElement.parentElement;
        const task = (parent.querySelector('[name=added-task]')).value;
        const index = tasks.findIndex(name => name.task === task);

        const prog = e.id;
        const item = {
            task,
            progress : prog
        };

        tasks.splice(index, 1, item);
        localStorage.setItem('tasks', JSON.stringify(tasks));

    } else if (e.name == 'added-task') {      // Updates task

        setTimeout(() => {

            const parent = e.parentElement;
            const task = (parent.querySelector('[name=added-task]')).value;
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

    } else {        // Adds new task

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

function populateList(tasks = [], taskList) {       // Adds/Updates tasks to visual task list, depending on progress

    taskList.innerHTML = tasks.map((task, i) => {
      if (task.progress == 'none') {
        return `
        <div class="task" id="${i}">
            <input type="text" class="text-input" name="added-task" value="${task.task}">
            <div class="btn-cont">
                <button id="none" class="progress" style="background-color: var(--red)"></button>
                <button id="started" class="progress" style="background-color: var(--white)"></button>
                <button id="done" class="progress" style="background-color: var(--white)"></button>
            </div>
            <div class="controls-cont">
                <img src="./images/x.svg" alt="delete" class="controls" id="delete">
                <div class="move-cont">
                    <img src="./images/arrow-up.png" alt="arrow-up" class="controls" id="arrow-up">
                    <img src="./images/arrow-down.png" alt="arrow-down" class="controls" id="arrow-down">
                </div>
            </div>
        </div>
      `;
      } else if (task.progress == 'started') {
        return `
        <div class="task" id="${i}">
            <input type="text" class="text-input" name="added-task" value="${task.task}">
            <div class="btn-cont">
                <button id="none" class="progress" style="background-color: var(--white)"></button>
                <button id="started" class="progress" style="background-color: var(--yellow)"></button>
                <button id="done" class="progress" style="background-color: var(--white)"></button>
            </div>
            <div class="controls-cont">
                <img src="./images/x.svg" alt="delete" class="controls" id="delete">
                <div class="move-cont">
                    <img src="./images/arrow-up.png" alt="arrow-up" class="controls" id="arrow-up">
                    <img src="./images/arrow-down.png" alt="arrow-down" class="controls" id="arrow-down">
                </div>
            </div>
        </div>
      `;
      } else if (task.progress == 'done') {
        return `
        <div class="task" id="${i}">
            <input type="text" class="text-input" name="added-task" value="${task.task}">
            <div class="btn-cont">
                <button id="none" class="progress" style="background-color: var(--white)"></button>
                <button id="started" class="progress" style="background-color: var(--white)"></button>
                <button id="done" class="progress" style="background-color: var(--green)"></button>
            </div>
            <div class="controls-cont">
                <img src="./images/x.svg" alt="delete" class="controls" id="delete">
                <div class="move-cont">
                    <img src="./images/arrow-up.png" alt="arrow-up" class="controls" id="arrow-up">
                    <img src="./images/arrow-down.png" alt="arrow-down" class="controls" id="arrow-down">
                </div>
            </div>
        </div>
      `;
      }
    }).join('');

}

function reset() {      // Clears all local storage and visual list

    localStorage.clear();
    tasks = [];

    taskList.innerHTML = [].map((task,i)=> {
        return ``;
      })
}

function runBtns(e) {       // Runs individual taks buttons

    if (e.target.className == 'progress') {

        changeColor(e.target)
        addTask(e.target)

    } else if (e.target.id == 'delete') {

        deleteTask(e.target)

    } else if (e.target.className == 'controls') {

        if (e.target.id == 'arrow-up' || e.target.id == 'arrow-down') {

            moveTask(e.target);

        } else {

            return

        }

    } else if (e.target.name == 'added-task') {

        update = true;

    } else {

        update = false;

    }
}

function keyPress(e) {      // Keyboard shortcuts

    if (e.key == 'Enter' && focused == true) {

        addBtn.click();

    } else if (update == true) {

        addTask(document.activeElement)

    }

}

function moveTask(e) {      // Moves tasks up/down & stores to storage
    console.log('yo')
    const parent = document.querySelector('#tasks-cont');
    const div = e.parentElement.parentElement.parentElement;
    const prevDiv = div.previousElementSibling;
    const nextDiv = div.nextElementSibling;
    const divIndex = tasks.findIndex(function(task) {

        return task.task == div.firstElementChild.value

    });

    if (e.id == 'arrow-up') {
        
        if (divIndex == 0) {      // Handles errors
            
            return
        
        } else {

            parent.insertBefore(div, prevDiv);
            [tasks[divIndex - 1], tasks[divIndex]] = [tasks[divIndex], tasks[divIndex - 1]];

        } 
        
    } else if (e.id == 'arrow-down') {

        if ((divIndex + 1) == tasks.length) {      // Handles errors

            return

        } else {

            parent.insertBefore(nextDiv, div);
            [tasks[divIndex], tasks[divIndex + 1]] = [tasks[divIndex + 1], tasks[divIndex]];

        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

}

progressBtns.forEach(btn => btn.addEventListener('click', changeColor));
addBtn.addEventListener('click', addTask);
resetBtn.addEventListener('click', reset);
date.addEventListener('change', function() {

    now = date.value;

    currentDate = [];
    currentDate.push(now);
    localStorage.setItem('date', JSON.stringify(now));

});
taskInput.onfocus = () => {focused = true};
taskInput.onblur = () => {focused = false};

document.addEventListener('click', runBtns);
document.onkeydown = keyPress;

populateList(tasks, taskList);      // Adds saved data on screen load