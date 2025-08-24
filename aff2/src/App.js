import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Search App</h2>
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", width: "250px", marginBottom: "20px" }}
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} style={{ marginBottom: "10px" }}>
            <strong>{user.name}</strong> <br />
            📧 {user.email} <br />
            📞 {user.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
