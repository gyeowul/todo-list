const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', fetchTodos);

addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});

async function fetchTodos() {
    try {
        const response = await fetch(`${API_BASE_URL}/todos`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const todos = await response.json();

        todoList.innerHTML = '';
        todos.forEach(todo => renderTodoItem(todo));
    } catch (error) {
        console.error('Failed to fetch todos:', error);
        alert('할 일 목록을 불러오는 데 실패했습니다. 서버가 실행 중인지 확인해주세요.');
    }
}

function renderTodoItem(todo) {
    const listItem = document.createElement('li');
    listItem.dataset.id = todo.id;

    if (todo.completed) {
        listItem.classList.add('completed');
    }

    const todoSpan = document.createElement('span');
    todoSpan.textContent = todo.text;
    listItem.appendChild(todoSpan);

    listItem.addEventListener('click', async function() {
        const newCompletedStatus = todo.completed ? 0 : 1;
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: newCompletedStatus })
            });

            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }

            todo.completed = newCompletedStatus;
            listItem.classList.toggle('completed');
        } catch (error) {
            console.error('Failed to toggle todo status:', error);
            alert('할 일 상태 변경에 실패했습니다.');
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.classList.add('delete-btn');

    deleteButton.addEventListener('click', async function(event) {
        event.stopPropagation();

        try {
            const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            todoList.removeChild(listItem);
        } catch (error) {
            console.error('Failed to delete todo:', error);
            alert('할 일 삭제에 실패했습니다.');
        }
    });

    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
}

async function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: todoText })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newTodo = await response.json();
        renderTodoItem(newTodo);

        todoInput.value = '';
        todoInput.focus();
    } catch (error) {
        console.error('Failed to add todo:', error);
        alert('할 일 추가에 실패했습니다.')
    }
}