import express, { Request, Response } from 'express';
import { TodoItem, UpdateTodoItem } from './types';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// In-memory storage for simplicity
let todos: TodoItem[] = [];

// Get all todo items
app.get('/api/v1/todos', (req: Request, res: Response) => {
  console.debug("fetched all todos");
  res.status(200).json(todos);
});

// Add a new todo item 
app.post('/api/v1/todos', (req: Request, res: Response) => {
  const { contents } = req.body as UpdateTodoItem;
  const newTodo: TodoItem = {
    id: uuidv4(),
    creation_date: new Date().toISOString(),
    contents,
  };
  console.debug("new todo item added : ", newTodo);
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Get a todo item by ID
app.get('/api/v1/todos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = todos.find(item => item.id === id);
  
  if (todo) {
    res.status(200).json(todo);
  } else {
    res.status(404).json({ message: 'Todo item not found' });
  }
});

// Delete a todo item by ID
app.delete('/api/v1/todos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = todos.findIndex(item => item.id === id);

  if (index !== -1) {
    console.debug("Removed Element : ", todos[index]);
    todos.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Todo item not found' });
  }
});

// Update a todo item's contents
app.put('/api/v1/todos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { contents } = req.body as UpdateTodoItem;

  const todo = todos.find(item => item.id === id);

  if (todo) {
    todo.contents = contents;
    res.status(200).json(todo);
  } else {
    res.status(404).json({ message: 'Todo item not found' });
  }
});

// Get todo items in a specific time frame
app.get('/api/v1/todos/timeframe', (req: Request, res: Response) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ message: 'Start date and end date are required' });
  }

  const filteredTodos = todos.filter(item => {
    const creationDate = new Date(item.creation_date);
    return creationDate >= new Date(start_date as string) && creationDate <= new Date(end_date as string);
  });

  res.status(200).json(filteredTodos);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
