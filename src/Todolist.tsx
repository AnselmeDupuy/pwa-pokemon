import {  useState } from 'react';

if (navigator.onLine) {
    console.log("Online");
} else {
    console.log("Offline");
}

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    active: boolean;
}

    // useEffect(() => {
        
    // }, []);

export const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState('');
    const [_filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
    const addTodo = () => {
        if (!input.trim()) return;
        setTodos([...todos, {
            id: Date.now(),
            text: input,
            completed: false,
            active: true
        }]);
        setInput('');
    };

    const showActiveTodos = () => {
        return todos.filter(todo => todo.active);
    }

    const showCompletedTodos = () => {
        return todos.filter(todo => todo.completed);
    }

    const showAllTodos = () => {
        return todos;
    }

    return (
        <>


        <div>
            <h1>Todo List</h1>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={addTodo}>Add Todo</button>

            <div>
                <h2>Filters:</h2>
                <button onClick={showAllTodos}>Show All</button>
                <button onClick={showCompletedTodos}>Show Completed</button>
                <button onClick={showActiveTodos}>Show Active</button>
            </div>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                        {todo.text}
                        <button onClick={() => {
                            setFilter('completed');
                            const updatedTodos = todos.map(t => 
                                t.id === todo.id ? { ...t, completed: !t.completed } : t
                            );
                            setTodos(updatedTodos);
                        }}>Toggle</button>
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};