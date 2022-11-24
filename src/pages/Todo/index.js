import React from 'react';
import { db } from '../../firebase';
import { doc } from 'firebase/firestore';
import TodoItem from '../../components/TodoItem';
import Spinner from '../../components/Spinner';
import { useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';


/**
 * Страница задачи. </br>
 * Содержит компоненты Spinner - лоадер, TodoItem - компонент конкретной задачи. </br>
 * [Spinner]{@link module:Spinner}
 * [TodoItem]{@link module:TodoItem}
 * @module Todo
 */

/**
 * Тип объекта props Todo
 * @typedef TodoProps
 * @type {object}
 * @property {boolean} isFull - Cвойство определяет показ задачи.
 * @property {boolean} isEdit - Cвойство определяет редактирование задачи.
 */

/**
 * @param {TodoProps} props
 */
const Todo = (props) => {

    const id = useParams()?.id;
    const [todo, loading] = useDocumentData(doc(db, 'todos', id));

    return loading ? <Spinner /> : <TodoItem item={todo} {...props} />;
};

export default Todo;