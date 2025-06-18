const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    const listItem = document.createElement('li');
    // listItem.classList.add('todo-item');

    listItem.addEventListener('click', function() {
        listItem.classList.toggle('completed');
    });

    const todoSpan = document.createElement('span');
    todoSpan.textContent = todoText;
    listItem.appendChild(todoSpan);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.classList.add('delete-btn');

    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation();
        todoList.removeChild(listItem);
    })

    listItem.appendChild(deleteButton);

    todoList.appendChild(listItem);

    todoInput.value = '';
    todoInput.focus();
}