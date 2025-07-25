import React from 'react';

const FaqModal = ({ show, onClose }) => {
  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog"  style={{ height: '86vh', marginTop: '8vh' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Frequently Asked Questions</h5>
          </div>
          <div className="modal-body">
          <h6>1. What can Task Bot do?</h6>
            <p>It helps you manage your calendar, schedule tasks, and interact with your assistant in real-time.</p>

            <h6>2. How do I log in?</h6>
            <p>Click “Login” and follow the authentication flow to sign in with your Google account.</p>

            <h6>3. What happens when I type “clear” or “reset”?</h6>
            <p>Your chat history is cleared and can not be recovered.</p>

            <h6>4. Is my data secure?</h6>
            <p>Yes. Task Bot accesses your data only with your permission and does not store it beyond the session.</p>

            <h6>5. Can Task Bot integrate with other calendars?</h6>
            <p>Currently, Task Bot supports Google Calendar, with plans to add more integrations soon.</p>

            <h6>6. How do I add a new task?</h6>
            <p>You can type a task command or use the interface to add tasks directly to your schedule.</p>

            <h6>7. What should I do if I encounter a bug?</h6>
            <p>Please report any issues via the Feedback form or contact support directly through the app.</p>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary rounded" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqModal;
