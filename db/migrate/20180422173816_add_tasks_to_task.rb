class AddTasksToTask < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :task_id, :integer
  end
end
