document.addEventListener('DOMContentLoaded', function(event) {
  const newTaskLink = document.getElementById('new_task');
  const taskList = document.getElementById('task_list');
  if (taskList) {
    newTaskLink.addEventListener('click', newTask);
    taskList.addEventListener('click', event => {
      if (event.target.classList.contains('checkbox')) {
        checkTask(event.target.parentNode);
      } else if (event.target.classList.contains('delete')) {
        deleteTask(event);
      }
    });
    taskList.addEventListener('change', event => {
      updateTask(event.target.parentNode);
    });
    taskList.addEventListener('submit', event => {
      event.preventDefault();
      updateTask(event.target);
      event.target.querySelector('#task_title').blur();
    });
  }
});

const newTask = event => {
  event.preventDefault();
  const firstTask = document.getElementById('task_list').children[0];
  ajax('POST', '/tasks', { title: 'Task' }, responseText => {
    firstTask.insertAdjacentHTML('beforebegin', responseText);
  });
};

const deleteTask = event => {
  event.preventDefault();
  event.stopPropagation();
  const form = event.target.parentNode;
  ajax('DELETE', form.action, {});
  form.parentNode.hidden = true;
};

const updateTask = form => {
  const newTitle = form.querySelector('#task_title').value;
  ajax('PATCH', form.action, { task: { title: newTitle } });
};

const checkTask = form => {
  const newValue = toggleCheckbox(form);
  ajax('PATCH', form.action, { task: { done: newValue } });
};

const toggleCheckbox = form => {
  const hiddenField = form.querySelector('#task_done');
  const checkbox = form.querySelector('.checkbox');
  if (hiddenField.value === 'true') {
    hiddenField.value = 'false';
    checkbox.classList.remove('checked');
    return 'false';
  } else {
    hiddenField.value = 'true';
    checkbox.classList.add('checked');
    return 'true';
  }
};

const ajax = (type, url, data, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open(type, url + '.json');
  xhr.onload = function() {
    if (callback && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  data = Object.assign(data, { authenticity_token: Rails.csrfToken() });
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
};
