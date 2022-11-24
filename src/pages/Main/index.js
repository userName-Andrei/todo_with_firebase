import React from 'react';
import { db } from '../../firebase';
import { query, orderBy, collection } from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import TodoList from '../../components/TodoList';
import Spinner from '../../components/Spinner';

/**
 * Главная страница
 * @module Main
 */

/**
 * Содержит компонент TodoList (список задач) и Spinner (лоадер) <br/>
 * [TodoList]{@link module:TodoList} <br/>
 * [Spinner]{@link module:Spinner} <br/>
 */
const Main = () => {

    const [todos, loading] = useCollectionData(query(collection(db, 'todos'), orderBy('createdAt')));

    return loading ? <Spinner /> : <TodoList items={todos} /> ;
};

export default Main;