document.addEventListener('DOMContentLoaded', function(event) {
  const taskList = document.getElementById('task_list');
  taskList.addEventListener('submit', updateTask);
  taskList.addEventListener('click', event => {
    if (event.target.classList.contains('checkbox')) {
      checkTask(event.target.parentNode);
    }
  });
});

const checkTask = form => {
  const hidden_field = form.querySelector('#task_done');
  const checked = hidden_field.value;
  const new_value = checked === 'true' ? 'false' : 'true';
  Rails.ajax({
    type: 'PATCH',
    url: form.action,
    data: 'task[done]=' + new_value
  });
  hidden_field.value = new_value;
  const checkbox = form.querySelector('.checkbox');
  if (new_value === 'true') {
    checkbox.classList.add('checked');
  } else {
    checkbox.classList.remove('checked');
  }
};
