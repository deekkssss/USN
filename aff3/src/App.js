import React, { useEffect, useState } from "react";

const API_BASE = "https://jsonplaceholder.typicode.com";

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load initial posts
  useEffect(() => {
    fetch(`${API_BASE}/posts?_limit=5`)
      .then((res) => res.json())
      .then(setPosts)
      .catch(() => setError("Failed to load posts"));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.body.trim()) {
      setError("Both title and body are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          body: form.body,
          userId: 1,
        }),
      });

      if (!res.ok) throw new Error("Network error");

      const newPost = await res.json();
      newPost.createdAt = new Date().toISOString();

      setPosts((prev) => [newPost, ...prev]);

      setForm({ title: "", body: "" });
    } catch (err) {
      setError("Failed to add post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Add a New Post</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          style={styles.input}
        />
        <textarea
          name="body"
          placeholder="Body"
          rows={4}
          value={form.body}
          onChange={handleChange}
          style={styles.textarea}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Posting..." : "Add Post"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <ul style={styles.list}>
        {posts.map((post) => (
          <li key={`${post.id}-${post.createdAt || ""}`} style={styles.card}>
            <h3 style={{ margin: "0 0 6px" }}>
              {post.title}{" "}
              {post.createdAt && <span style={styles.badge}>new</span>}
            </h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

      <p style={styles.note}>
        (Note: JSONPlaceholder fakes saving posts. Data isn’t stored on server.)
      </p>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: "20px auto", fontFamily: "Arial" },
  form: { display: "grid", gap: 8, marginBottom: 20 },
  input: { padding: "8px", borderRadius: 6, border: "1px solid #ccc" },
  textarea: { padding: "8px", borderRadius: 6, border: "1px solid #ccc" },
  button: {
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  error: { color: "red" },
  list: { listStyle: "none", padding: 0 },
  card: {
    background: "#f9f9f9",
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 6,
    marginBottom: 10,
  },
  badge: {
    fontSize: 12,
    background: "#cce5cc",
    padding: "2px 6px",
    borderRadius: 10,
    marginLeft: 6,
  },
  note: { fontSize: 12, color: "gray", marginTop: 10 },
};

export default App;
