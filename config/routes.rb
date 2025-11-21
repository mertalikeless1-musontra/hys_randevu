Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # --- HYS API Rotaları ---
  # API sürümlerini yönetmek için namespace kullanıyoruz (api/v1/...)
  namespace :api do
    namespace :v1 do
      # Randevu oluşturma (POST) rotasını tanımlıyoruz
      resources :appointments, only: [:create]
      
      resources :doctors, only: [] do
        collection do
          get :available
        end
      end
    end
  end
end