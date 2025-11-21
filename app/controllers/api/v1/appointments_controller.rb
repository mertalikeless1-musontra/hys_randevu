module Api
  module V1
    class AppointmentsController < ApplicationController
      # API olduğu için CSRF korumasını devre dışı bırakıyoruz
      skip_before_action :verify_authenticity_token, raise: false

      def create
        appointment = Appointment.new(appointment_params)

        if appointment.save
          render json: appointment, status: :created
        else
          render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def appointment_params
        # Strong Parameters
        params.require(:appointment).permit(:doctor_id, :patient_id, :scheduled_at)
      end
    end
  end
end