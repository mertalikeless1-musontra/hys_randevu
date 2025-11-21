module Api
  module V1
    class DoctorsController < ApplicationController
      def available
        unless params[:date].present?
          return render json: { error: 'Date parameter is required' }, status: :bad_request
        end

        begin
          date = DateTime.parse(params[:date])
          doctors = Doctor.available_at(date)
          render json: doctors, status: :ok
        rescue Date::Error, ArgumentError
          render json: { error: 'Invalid date format' }, status: :bad_request
        end
      end
    end
  end
end
