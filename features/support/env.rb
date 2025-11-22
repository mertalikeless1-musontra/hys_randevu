require 'cucumber/rails'

ActionController::Base.allow_rescue = false

begin
  DatabaseCleaner.strategy = :transaction
rescue NameError
  raise "Add database_cleaner to Gemfile in :test group"
end

Cucumber::Rails::Database.javascript_strategy = :truncation

# --- Rails API request helpers ---
World(Rails.application.routes.url_helpers)
World(ActionDispatch::IntegrationTest::Behavior)
World(ActionDispatch::TestProcess)

Rails.env = 'test'
