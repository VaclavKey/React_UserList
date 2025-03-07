import { useState, useEffect } from 'react'
import './App.css'

type User = {
  id : number,
  name: string,
  email: string,
  phone: string,
  company: {
    name: string;
  };
}

type Post = {
  title: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Users not found');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const fetchUserDetails = async (userId: number) => {
    setLoading(true);
    setError('');
    try {
      const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (!userResponse.ok) throw new Error ('User not found');
      const userData = await userResponse.json();
      setCurrentUser(userData);

      const postsResponse = await fetch (`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      if (!postsResponse.ok) throw new Error('Posts not found');
      const postsData = await postsResponse.json();
      setPosts(postsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const handleUserClick = (userId: number) => {
    fetchUserDetails(userId);
  }

  // useEffect(() => {
  //   fetchUsers();
  // }, [])

  return (
    <div className="container">
      <h1>Users</h1>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error:{error}</p>}
      {!loading  && !currentUser && (
        <div>
          <button onClick={() => fetchUsers()}>Load Users</button>
          <ul>
            {users.map((user) => (
              <li key={user.id} onClick={() => handleUserClick(user.id)}>
                {user.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentUser && (
        <div>
          <h2>{currentUser.name}</h2>
          <p>{currentUser.email}</p>
          <p>{currentUser.phone}</p>
          <p>{currentUser.company.name}</p>
          <h3>Posts:</h3>
          <ul>
            {posts.slice(0,3).map((post) => (
              <li key={post.title}>{post.title}</li>
            ))}
          </ul>
          <button onClick={() => setCurrentUser(null)}>Back to Users</button>
        </div>
      )}
    </div>
  );
};

export default App;