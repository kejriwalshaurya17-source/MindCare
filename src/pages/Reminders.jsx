import { useState } from "react";

function Reminders() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Daily Mind Training",
      time: "09:00 AM",
      type: "Cognitive Exercise",
      active: true,
    },
    {
      id: 2,
      title: "Memory Review",
      time: "06:00 PM",
      type: "Memory",
      active: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Cognitive Exercise");

  function addReminder(event) {
    event.preventDefault();

    if (!title.trim() || !time) {
      return;
    }

    const newReminder = {
      id: Date.now(),
      title: title.trim(),
      time,
      type,
      active: true,
    };

    setReminders((prev) => [
      ...prev,
      newReminder,
    ]);

    setTitle("");
    setTime("");
    setType("Cognitive Exercise");
    setShowForm(false);
  }

  function toggleReminder(id) {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              active: !reminder.active,
            }
          : reminder
      )
    );
  }

  function deleteReminder(id) {
    setReminders((prev) =>
      prev.filter(
        (reminder) => reminder.id !== id
      )
    );
  }

  return (
    <div className="page">

      <div className="reminder-header">

        <div>
          <p className="small-title">
            SMART REMINDERS
          </p>

          <h1>Stay on track with gentle reminders.</h1>

          <p className="description">
            Create reminders for cognitive exercises,
            memory reviews and daily routines.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "+ Add Reminder"}
        </button>

      </div>


      {showForm && (
        <form
          className="reminder-form"
          onSubmit={addReminder}
        >

          <h2>Create Reminder</h2>

          <div className="reminder-form-grid">

            <div>
              <label>Reminder Title</label>

              <input
                type="text"
                placeholder="e.g. Morning brain exercise"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>


            <div>
              <label>Time</label>

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
              />
            </div>

          </div>


          <div>
            <label>Reminder Type</label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option>Cognitive Exercise</option>
              <option>Memory</option>
              <option>Daily Routine</option>
              <option>Medication Reminder</option>
              <option>Personal</option>
            </select>
          </div>


          <button
            type="submit"
            className="primary-btn"
          >
            Save Reminder
          </button>

        </form>
      )}


      <div className="reminder-list">

        {reminders.map((reminder) => (

          <div
            className={
              reminder.active
                ? "reminder-card"
                : "reminder-card disabled"
            }
            key={reminder.id}
          >

            <div className="reminder-icon">
              ⏰
            </div>


            <div className="reminder-info">

              <span className="reminder-type">
                {reminder.type}
              </span>

              <h3>{reminder.title}</h3>

              <strong>{reminder.time}</strong>

            </div>


            <div className="reminder-actions">

              <button
                className={
                  reminder.active
                    ? "toggle active"
                    : "toggle"
                }
                onClick={() =>
                  toggleReminder(reminder.id)
                }
              >
                <span></span>
              </button>

              <button
                className="delete-reminder"
                onClick={() =>
                  deleteReminder(reminder.id)
                }
              >
                ×
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Reminders;