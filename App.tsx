import * as React from 'react';
import * as rx from 'rxjs';

const dispatchCounter$ = new rx.Subject<number>();

const counterState$ = dispatchCounter$.pipe(
  rx.scan<number, number>((count, incValue) => count + incValue),
  rx.startWith(0),
  rx.shareReplay(1)
);

const increment = () => dispatchCounter$.next(1);
const decrement = () => dispatchCounter$.next(-1);

const useCounter = () => {
  const [state, setState] = React.useState<number | null>(null);

  React.useEffect(() => {
    const sub = counterState$.subscribe(setState);
    return () => sub.unsubscribe();
  }, []);

  return {
    count: state,
    increment,
    decrement,
  };
};

const Controls = () => {
  const counter = useCounter();

  return (
    <div>
      <button onClick={() => counter.increment()}>+</button>
      <button onClick={() => counter.decrement()}>-</button>
    </div>
  );
};

const Display = () => {
  const counter = useCounter();

  return <h3>{counter.count}</h3>;
};

const OtherDisplay = () => {
  const counter = useCounter();

  return <h3>{counter.count}</h3>;
};

const App = () => {
  return (
    <div>
      <Display />
      <Controls />
      <OtherDisplay />
    </div>
  );
};

export default App;
