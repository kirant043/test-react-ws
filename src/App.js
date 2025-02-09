import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { events } from 'aws-amplify/data';
import config from './amplify_outputs.json';

Amplify.configure(config);

const App = () => {
  const [receivedEvents, setReceivedEvents] = useState([]);

  useEffect(() => {
    let channel;
    let subscription;

    const connectAndSubscribe = async () => {
      try {
        channel = await events.connect('/default');

        subscription = channel.subscribe({
          next: data => {
            console.log('Received event:', data);
            setReceivedEvents(prevEvents => [...prevEvents, data]);
          },
          error: err => {
            console.error('Subscription error:', err);
          },
        });
      } catch (error) {
        console.error('Error connecting to events channel:', error);
      }
    };

    connectAndSubscribe();

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
      if (channel && typeof channel.close === 'function') {
        channel.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Events</h1>
      {receivedEvents.length === 0 ? (
        <p>No events received yet.</p>
      ) : (
        <ul>
          {receivedEvents.map((event, index) => (
            <li key={index}>{JSON.stringify(event)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
