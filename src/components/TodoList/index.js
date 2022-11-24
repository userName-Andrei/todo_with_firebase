import React from 'react';
import TodoItem from '../TodoItem';

import styles from './TodoList.module.scss';

/**
 * Компонент списка задач. <br/>
 * Содержит компонент TodoItem (определенная задача) <br/>
 * [TodoItem]{@link module:TodoItem}
 * @module TodoList
 */

/**
 * Тип объекта props TodoList
 * @typedef TodoListProps
 * @type {object}
 * @property {string} id - ID.
 * @property {string} title - Заголовок задачи.
 * @property {string} description - Описание задачи.
 * @property {string} overtime - Срок выполнения задачи. Формат "YYYY-MM-DD"
 * @property {array} files - Файлы задачи.
 * @property {string} status - Статус задачи. Имеет 3 состояния "completed", "failed", "wait".
 * @property {number} createdAt - Дата создания задачи в миллисекундах.
 */

/**
 * @param {TodoListProps[]} props  массив задач
 */
const TodoList = ({items}) => {

    return (
        <>
            <h1 className={styles.title}>Список дел</h1>
            <ul className={styles.todolist}>
                {items.length === 0 ? <li className={styles.subtitle}>Задач пока нет.</li> :items.map(item => <TodoItem key={item.id} item={item} />)}
            </ul>
        </>
    );
};

export default TodoList;