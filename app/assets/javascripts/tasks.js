// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('touchend', clickables);
  document.addEventListener('click', clickables);
  document.addEventListener('change', event => {
    console.log('UPDATE TASK');
    updateTask(event.target.parentNode);
  });
  document.addEventListener('submit', event => {
    console.log('UPDATE TASK');
    updateAndBlur(event);
  });
});

// Event Handlers
const clickables = event => {
  if (event.target.classList.contains('checkbox')) {
    event.preventDefault();
    clickCheckbox(event);
  } else if (event.target.classList.contains('delete')) {
    clickDelete(event);
  } else if (event.target.classList.contains('new-task')) {
    clickNew(event);
  }
};

const clickCheckbox = event => {
  console.log('CHECK TASK');
  checkTask(event.target.parentNode);
};

const clickDelete = event => {
  console.log('DELETE TASK');
  deleteTask(event);
};

const clickNew = event => {
  console.log('NEW TASK');
  newTask(event);
};

const updateAndBlur = event => {
  event.preventDefault();
  updateTask(event.target);
  event.target.querySelector('#task_title').blur();
};

const newTask = event => {
  event.preventDefault();
  let taskList = event.target.nextElementSibling;
  let taskData = { title: 'Task' };
  if (event.target.parentNode.tagName === 'FORM') {
    taskData.task_id = event.target.parentNode.dataset.id;
    taskList = event.target.parentNode.nextElementSibling;
  }
  ajax('POST', '/tasks', taskData, responseText => {
    taskList.insertBefore(htmlToElement(responseText), taskList.children[0]);
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

// AJAX Helpers
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

const htmlToElement = html => {
  const template = document.createElement('div');
  template.innerHTML = html;
  return template.firstChild;
};
