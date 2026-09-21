import { useState } from "react";

const categories = [
  "People",
  "Places",
  "Events",
  "Notes",
  "Routines",
  "Favorite Things",
];

function Memory() {
  const [memories, setMemories] = useState([
    {
      id: 1,
      title: "Family",
      text: "Important people in my family.",
      category: "People",
    },
    {
      id: 2,
      title: "Favorite Place",
      text: "A place that is special to me.",
      category: "Places",
    },
    {
      id: 3,
      title: "Daily Routine",
      text: "Morning study and evening walk.",
      category: "Routines",
    },
  ]);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("People");

  function addMemory(event) {
    event.preventDefault();

    if (!title.trim() || !text.trim()) {
      return;
    }

    const newMemory = {
      id: Date.now(),
      title: title.trim(),
      text: text.trim(),
      category,
    };

    setMemories((prev) => [
      newMemory,
      ...prev,
    ]);

    setTitle("");
    setText("");
    setCategory("People");
    setShowForm(false);
  }

  function deleteMemory(id) {
    setMemories((prev) =>
      prev.filter((memory) => memory.id !== id)
    );
  }

  const filteredMemories =
    activeCategory === "All"
      ? memories
      : memories.filter(
          (memory) =>
            memory.category === activeCategory
        );

  return (
    <div className="page">

      <div className="memory-header">

        <div>
          <p className="small-title">
            MEMORY VAULT
          </p>

          <h1>
            Keep the things that matter.
          </h1>

          <p className="description">
            Save important people, places, events,
            routines and personal notes in one place.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm
            ? "Close"
            : "+ Add Memory"}
        </button>

      </div>


      {showForm && (

        <form
          className="memory-form"
          onSubmit={addMemory}
        >

          <h2>Add a new memory</h2>

          <div className="memory-form-grid">

            <div>
              <label>Title</label>

              <input
                type="text"
                placeholder="Memory title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>


            <div>
              <label>Category</label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

          </div>


          <div>
            <label>Memory</label>

            <textarea
              placeholder="Write something you want to remember..."
              value={text}
              onChange={(event) =>
                setText(event.target.value)
              }
              rows="4"
            />
          </div>


          <button
            type="submit"
            className="primary-btn"
          >
            Save Memory
          </button>

        </form>

      )}


      <div className="memory-categories">

        <button
          className={
            activeCategory === "All"
              ? "memory-category active"
              : "memory-category"
          }
          onClick={() =>
            setActiveCategory("All")
          }
        >
          🧠 All
        </button>

        {categories.map((item) => (

          <button
            key={item}
            className={
              activeCategory === item
                ? "memory-category active"
                : "memory-category"
            }
            onClick={() =>
              setActiveCategory(item)
            }
          >
            {item}
          </button>

        ))}

      </div>


      <div className="memory-grid">

        {filteredMemories.length === 0 ? (

          <div className="empty-memory">
            <span>🧠</span>

            <h2>No memories here yet.</h2>

            <p>
              Add a memory to this category.
            </p>
          </div>

        ) : (

          filteredMemories.map((memory) => (

            <div
              className="vault-memory-card"
              key={memory.id}
            >

              <div className="memory-card-top">

                <span className="memory-category-label">
                  {memory.category}
                </span>

                <button
                  className="delete-memory"
                  onClick={() =>
                    deleteMemory(memory.id)
                  }
                  aria-label="Delete memory"
                >
                  ×
                </button>

              </div>

              <h3>{memory.title}</h3>

              <p>{memory.text}</p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Memory;