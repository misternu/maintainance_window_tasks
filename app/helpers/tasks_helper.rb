module TasksHelper
  def root_tasks
    Task.where(task_id: nil).order('created_at DESC')
  end
end
