# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Gerçek hayatta buraya 'http://localhost:5173' yazılır.
    # Test kolaylığı için '*' (herkes) diyerek açıyoruz.
    origins '*'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end