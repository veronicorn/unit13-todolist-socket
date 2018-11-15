$(function () {

    const render = function () {
        $('#todos').empty();
        $('add-new-todo').off('click');
        getTodos();
    }

    const day = moment().format('ddd');
    const month = moment().format('MMM Do');
    const year = moment().format('YYYY');

    const dayEl = $('<span>').addClass('day').text(day)

    const monthEl = $('<div>').addClass('month').text(month)
    const yearEl = $('<div>').addClass('year').text(year)
    const dateEl = $('<div>').append(monthEl, yearEl)

    $('.date').append(dayEl, dateEl);

    const renderTodo = function (outputElement, todo) {
        const output = $(outputElement);

        const todoEl = $('<div>').addClass('todo')
            .attr('data-id', todo._id)
            .addClass(todo.completed ? 'completed' : 'incomplete');

        todoEl.append(
            $('<span>').text(todo.text).addClass('list-text'),
            $('<button>')
                .addClass('delete')
                .append('<i>').addClass(todo.completed ? 'far fa-times-circle' : 'far fa-circle')
        );

        output.append(todoEl);
    }

    const renderTodos = function (outputElement, todos) {
        const output = $(outputElement);
        output.empty();
        todos.forEach((todo) => renderTodo(outputElement, todo));
    }

    const getTodos = function () {

        $.ajax({
            url: '/api/todos',
            method: 'GET'
        })
            .then(function (todos) {
                renderTodos('#todos', todos);
            });
    }

    $('form').on('submit', function (event) {
        event.preventDefault();
        const newTodo = {
            text: $('#new-todo-text').val().trim(),
            completed: false,
        };

        for (let key in newTodo) {
            if (newTodo[key] === '') {
                alert('Please add text for new todo');
                return;
            }
        }
        $.ajax({
            url: '/api/todos',
            method: 'POST',
            data: newTodo
        }).then(
            function (data) {
                console.log('app.js103: ' + JSON.stringify(data));
                if (data) {
                    console.log('data', data)
                    $('#new-todo-text').val('');
                    $('#new-todo-text').focus();

                    render();
                } else {

                    alert('There was a problem with your submission. Please check your entry and try again.');
                }
            });
    });

    $('body').on('click', '.incomplete', function (event) {
        const todoId = $(this).attr('data-id');

        $.ajax({
            url: `/api/todos/${todoId}`,
            method: 'PUT',
            data: {
                completed: true
            },
        })
            .then(function (data) {
                if (data.success) {
                    render();
                } else {
                    alert('There was an unexpected error. Please check your entry and try again.');
                }
            });
    })

    $('body').on('click', '.completed', function (event) {
        const todoId = $(this).attr('data-id');
        $.ajax({
            url: `/api/todos/${todoId}`,
            method: 'DELETE'
        })
            .then(function (data) {
                if (data.success) {
                    render();
                } else {
                    alert('There was an unexpected error. Please check your entry and try again.');
                }
            });
    });

    $("#new-todo-text").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            $("form").submit();
        }
    });

    render();

    const socket = io();
    socket.on('new todo', function (todo) {
        console.log(todo);
        getTodos();
    });
    socket.on('delete todo', function (todo) {
        console.log(todo);
        getTodos();
    });
    socket.on('update todo', function (todo) {
        console.log(todo);
        getTodos();
    });
});