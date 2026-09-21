import { Link } from "react-router-dom";

function Games() {
  return (
    <div className="page">

      <p className="small-title">COGNITIVE GAMES</p>

      <h1>Train your mind through play.</h1>

      <p className="description">
        Choose an activity and challenge your memory, attention and reaction.
      </p>

      <div className="page-card-grid">

        {/* MEMORY MATCH */}
        <div className="page-card">
          <span>🧩</span>

          <h3>Memory Match</h3>

          <p>
            Match pairs and exercise visual memory.
          </p>

          <Link
            to="/games/memory-match"
            className="primary-btn"
          >
            Play Game →
          </Link>
        </div>


        {/* SEQUENCE RECALL */}
        <div className="page-card">
          <span>🔢</span>

          <h3>Sequence Recall</h3>

          <p>
            Remember and reproduce the correct sequence.
          </p>

          <Link
            to="/games/sequence-recall"
            className="primary-btn"
          >
            Play Game →
          </Link>
        </div>


        {/* REACTION CHALLENGE */}
        <div className="page-card">
          <span>⚡</span>

          <h3>Reaction Challenge</h3>

          <p>
            Test your attention and reaction speed.
          </p>

          <Link
            to="/games/reaction-challenge"
            className="primary-btn"
          >
            Play Game →
          </Link>
        </div>


        {/* WORD RECALL */}
        <div className="page-card">
          <span>🔤</span>

          <h3>Word Recall</h3>

          <p>
            Remember words and test your recall ability.
          </p>

          <Link
            to="/games/word-recall"
            className="primary-btn"
          >
            Play Game →
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Games;