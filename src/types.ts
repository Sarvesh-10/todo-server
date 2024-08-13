// src/types.ts

export interface TodoItem {
    id: string;
    creation_date: string; // ISO date-time format
    contents: string;
  }
  
  export interface UpdateTodoItem {
    contents: string;
  }
  