import * as React from 'react';
import { AppRouter } from './AppRouter';
import { Hello } from './Hello';

export function App() {
    return (
        <div className="app">
            <p>yo</p>
            <AppRouter />
            <Hello />
        </div>
    );
}
