import React, { useState } from 'react'
import './TodoList.css'
interface TodoList {
    id:number,
    text:string,
    completed:boolean
}

type FilterType = 'All' | 'active' | 'completed'
export const App = () => {
    const [ todoList, setTodoList ] = useState<TodoList[]>([])
    const [ newTodoText, setNewTodoText ] = useState<string>("")
    const [ filterTodoList, setFilterTodoList ] = useState<FilterType>('All')

    const filtersTodos = todoList.filter(todo => {
        if (filterTodoList === 'active') return !todo.completed
        if (filterTodoList === 'completed') return todo.completed
        return true
    })

    const addTodo = () => {
        if (newTodoText.trim()) {
            setTodoList([...todoList, {
                id:Date.now(),
                text: newTodoText,
                completed:false,
            }])
            setNewTodoText('')
        }
    }

    const handleNewTodoText = (e:React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoText(e.target.value)
    } 

    const toggleTodo = (id:number) => {
        setTodoList(todoList.map(todo => 
            todo.id === id? { ...todo, completed: !todo.completed} : todo
        ))
    }
    const deleteTodo = (id:number) => {
        setTodoList(todoList.filter(todo => todo.id !== id))
    }

    const getFiltersTodos = () => {
        switch(filterTodoList) {
            case 'All' : return 'У вас нет никаких дел'
            case 'active' : return 'У вас нет активных дел'
            case 'completed' : return 'У вас нет завершённых дел'
        }
    }
  return (
    <div className='todoWrapper'>
        <h1>TodoList</h1>
        <div className="add-todo">
            <input type="text" placeholder='Что нужно сделать?' value={newTodoText} onChange={handleNewTodoText} onKeyUp={(e) => e.key === 'Enter' && addTodo()}/>
            <button onClick={addTodo}>Добавить</button>
        </div>
        <div className="filters-todo">
            <button onClick={() => setFilterTodoList('All')}>Все</button>
            <button onClick={() => setFilterTodoList('active')}>Активные</button>
            <button onClick={() => setFilterTodoList('completed')}>Завершённые</button>
        </div>
        <ul className="todo-list">
            {
                filtersTodos.length === 0? (
                    <span className='getFiltersTodos'>{getFiltersTodos()}</span>
                ):
                filtersTodos.map(todo => (
                    <li key={todo.id} className={todo.completed? 'completed' : ''} >
                        <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)}/>
                        <span>{todo.text}</span>
                        <button onClick={() => deleteTodo(todo.id)}>Удалить</button>
                    </li>
                 ))
            }
        </ul>
        <div className="start">
            Осталось выполнить: { todoList.filter( t=> !t.completed ).length }
        </div>
    </div>
  )
}