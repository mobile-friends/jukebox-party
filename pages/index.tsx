import db from '../firebase.config';
import { useEffect, useState } from 'react';

export default function Home() {
  const [starCount, setStarCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    console.log(db);
    var starCountRef = db.ref('users/');
    starCountRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setStarCount(data);
    });
    console.log(starCountRef);
  }, []);

  const increaseStarCount = (userId) => {
    db.ref('users/' + userId).set({
      username: 'test',
      email: 'fa',
    });
    setUserCount(userCount + 1);
  };

  return (
    <div>
      <h1>jukebox.party</h1>
      <p>{JSON.stringify(starCount)}</p>

      <button onClick={() => increaseStarCount(userCount)}>Increase</button>
    </div>
  );
}
