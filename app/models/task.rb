class Task < ApplicationRecord
  belongs_to :task, optional: true
  has_many :tasks, dependent: :destroy
  before_save :default_values

  def default_values
    self.done ||= false
  end
end
