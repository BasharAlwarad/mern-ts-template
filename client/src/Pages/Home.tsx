import { useState, useEffect } from 'react';
import api from '@utils/api';

function Home() {
  // TODO: teaching material – replace any[] with a proper type later
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await api.get<any[]>('/users');
        if (isMounted) {
          setUsers(data);
        }
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Home</h1>
      {users ? (
        <div className="mt-2 text-sm opacity-80">
          Users loaded: {users.length}
        </div>
      ) : (
        <div className="mt-2 text-sm opacity-60">Loading users…</div>
      )}
    </div>
  );
}

export default Home;
