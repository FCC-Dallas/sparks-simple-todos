'use strict';

let tasks = [];

function updateTasks () {
    let updatedHtml = '';

    for ( let task of tasks ) {
        updatedHtml += `
            <li class="task">
                <strong>
                    ${task.name}
                </strong>
                <span>
                    <button onclick="window.moveTask('${task.name}', -1)">Move Up</button>
                    <button onclick="window.moveTask('${task.name}', 1)">Move Down</button>
                    <button onclick="window.removeTask('${task.name}')">Remove</button>
                </span>
            </li>`;
    }

    document.querySelector('#tasks-list').innerHTML = updatedHtml;
}

function addTask () {
    let name = document.querySelector('#tasks-create-input').value;

    if (name.length > 0) {
        new Task(name);
    }

    document.querySelector('#tasks-create-input').value = '';
}
document.querySelector('#tasks-create-input').addEventListener("keypress", (event) => {
    if (event.keyCode == 13) addTask();
});

window.removeTask = function (name) {
    let result = tasks.find(task => {
        return task.name === name;
    });

    if (result) result.remove();
}

window.moveTask = function (name, value) {
    let result = tasks.find(task => {
        return task.name === name;
    });

    if (result) result.move(value);
}

class Task {
    constructor(name) {
        this.name = name;

        // Add task to tasks list
        tasks.push(this);
        updateTasks();
    }

    remove () {
        if (tasks.includes(this)) {
            let indexToRemove = tasks.indexOf(this);

            tasks.splice(indexToRemove, 1);
        }

        delete this;
        updateTasks();
    }

    move (value) {
        let positions = {
            max: tasks.length > 0 ? tasks.length - 1 : 0,
            min: 0,
            current: tasks.indexOf(this)
        };

        let state = {
            isMovingUp: value > 0,
            isMovingDown: value < 0,

            canMoveUp: (positions.current + value) <= positions.max,
            canMoveDown: (positions.current + value) >= positions.min
        };

        tasks.splice( positions.current, 1 );

        if (state.isMovingUp) {
            if (state.canMoveUp) {
                tasks.splice( positions.current + value, 0, this);
            } else {
                tasks.splice( positions.max, 0, this);
            }
        } else if (state.isMovingDown) {
            if (state.canMoveDown) {
                tasks.splice( positions.current + value, 0, this);
            } else {
                tasks.splice( positions.min, 0, this);
            }
        }
        updateTasks();
    }
}

