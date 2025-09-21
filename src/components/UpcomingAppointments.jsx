import React from 'react';
import './UpcomingAppointments.css';

const UpcomingAppointments = ({ appointments }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isToday = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return today.toDateString() === appointmentDate.toDateString();
  };

  const isTomorrow = (dateString) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = new Date(dateString);
    return tomorrow.toDateString() === appointmentDate.toDateString();
  };

  const getDateLabel = (dateString) => {
    if (isToday(dateString)) return 'Today';
    if (isTomorrow(dateString)) return 'Tomorrow';
    return formatDate(dateString);
  };

  return (
    <div className="upcoming-appointments">
      <h3>Upcoming Appointments</h3>
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <p>No upcoming appointments</p>
            <button 
              className="schedule-btn"
              onClick={() => alert('Opening appointment scheduler...')}
            >
              Schedule Service
            </button>
          </div>
        ) : (
          appointments.map(appointment => (
            <div key={appointment.id} className="appointment-item">
              <div className="appointment-date">
                <div className="date-label">{getDateLabel(appointment.scheduledDate)}</div>
                <div className="time-label">{formatTime(appointment.scheduledDate)}</div>
              </div>
              <div className="appointment-details">
                <h4>{appointment.serviceType}</h4>
                <p className="appointment-property">{appointment.property}</p>
                <p className="appointment-provider">{appointment.provider}</p>
              </div>
              <div className="appointment-actions">
                <button 
                  className="reschedule-btn"
                  onClick={() => alert(`Rescheduling ${appointment.serviceType} appointment`)}
                >
                  Reschedule
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this appointment?')) {
                      alert(`Cancelled ${appointment.serviceType} appointment`);
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;