// Create a class for the element
class Todo extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        let data = window.ftd.component_data(this);
        let todo_list = [];

        data.name.on_change = function () {
            const text_name = this.get();
            let obj = {"name": text_name, "done": true, "status": "Todo", "description": null};
            todo_list.push(obj);
            let index = todo_list.length -1;

            let todo = todo_item_display(obj, index, data, todo_list);
            data.todo_list.set(todo_list);

            wrapper.appendChild(todo);
        }

        // Create a shadow root
        const shadow = this.attachShadow({mode: 'open'});

        const page = document.createElement('div');
        page.setAttribute('class', 'page');

        const heading = document.createElement('div');
        heading.setAttribute('class', 'heading');
        heading.innerText = "Web Component World!!"

        // Create spans
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        todo_list.map((value, index) => {
            let todo = todo_item_display(value, index, data, todo_list);
            wrapper.appendChild(todo);
        });

        const button = document.createElement('button');
        button.setAttribute('class', 'button');
        button.innerText = "Sync"
        button.onclick = function (e) {
            data.todo_list.set(todo_list);
        }



        // Create some CSS to apply to the shadow dom
        const style = document.createElement('style');
        console.log(style.isConnected);

        style.textContent = `
        .page {
            width: 500px;
            background-color: #dae6f0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
        }
        
        .heading {
            font-size: 33px;
            font-weight: bold;
        }
        
      .wrapper {
            gap: 10px;
            display: flex;
            flex-direction: column;
            min-height: 200px;
            background-color: white;
            padding: 32px;
      }
      
      .todo-item {
        flex-direction: row;
        display: flex;
        gap: 10px;
        font-size: 30px;
        width: 100%;
        background-color: cyan;
      }
      
      .button {
        width: fit-content;
        font-size: 20px;
        padding: 5px 8px;
        align-self: end;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }

      img {
        width: 1.2rem;
      }

      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `;

        // Attach the created elements to the shadow dom
        shadow.appendChild(style);
        console.log(style.isConnected);

        page.appendChild(heading);
        page.appendChild(wrapper);
        page.appendChild(button);

        shadow.appendChild(page);
    }
}

// Define the new element
customElements.define('todo-list-display', Todo);



function todo_item_display(obj, index, data, todo_list) {
    const todo = document.createElement('div');
    todo.setAttribute('class', 'todo-item');
    todo.setAttribute('tabindex', 0);
    todo.setAttribute('id', index.toString());

    const check = document.createElement('input');
    check.id = 'todocheck' + index;
    check.type = "checkbox";
    check.value = obj.name + '<br/>';
    check.onclick = function (event) {
        if (check.checked) {
            todo.style.backgroundColor = "#aff5af";
            text.style.color = "darkgreen";
            obj.status = "Done";
        } else {
            todo.style.backgroundColor = "yellow";
            text.style.color = "#bb7d0c";
            obj.status = "Todo";
        }
        obj.done = check.checked;
        data.todo_list.set(todo_list);
    }

    const text = document.createElement('div');
    text.innerText = obj.name

    if (check.checked) {
        todo.style.backgroundColor = "green";
        text.style.color = "darkgreen";
    } else {
        todo.style.backgroundColor = "yellow";
        text.style.color = "#bb7d0c";
    }

    const input = document.createElement('input');
    input.id = 'todoinput' + index;
    input.onchange = function (event) {
        obj.description = !obj.description;
    }

    todo.appendChild(check);
    todo.appendChild(text);

    return todo;
}

function clear() {
    if (!!window.dummy_data_main && !!window.dummy_data_main["ftd-js/#todo_list"]) {
        let data = window.ftd.data["main"];
        let length = window.resolve_reference("ftd-js/#todo_list", data).length;
        let [_, data_id, start_index] = window.dummy_data_main["ftd-js/#todo_list"](data);
        let main = document.querySelector(`[data-id="${data_id}"]`);
        for (var i = length - 1 + start_index; i >= start_index; i--) {
            main.removeChild(main.children[i]);
        }
    }
}

function set() {
    if (!!window.dummy_data_main && !!window.dummy_data_main["ftd-js/#todo_list"]) {
        let data = window.ftd.data["main"];
        let [htmls, data_id, start_index] = window.dummy_data_main["ftd-js/#todo_list"](data);
        for (let i in htmls) {
            let nodes = stringToHTML(htmls[i]);
            let main = document.querySelector(`[data-id="${data_id}"]`);
            let g = main.children.length;
            let h = start_index + parseInt(i);
            main.insertBefore(nodes.children[0], main.children[start_index + parseInt(i)]);
        }
    }
}
