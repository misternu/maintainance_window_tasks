document.addEventListener('DOMContentLoaded', function(event) {
  const taskList = document.getElementById('task_list');
  taskList.addEventListener('click', event => {
    if (event.target.classList.contains('checkbox')) {
      checkTask(event.target.parentNode);
    }
  });
});

const checkTask = form => {
  const newValue = toggleCheckbox(form);
  ajax_send('PATCH', form.action, { task: { done: newValue } });
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

const ajax_send = (type, url, data) => {
  const xhr = new XMLHttpRequest();
  xhr.open(type, url + '.json');
  data = Object.assign(data, { authenticity_token: Rails.csrfToken() });
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
};
