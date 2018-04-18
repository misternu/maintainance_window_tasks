class Task < ApplicationRecord
  before_save :default_values
  def default_values
    self.done ||= false
  end
end
