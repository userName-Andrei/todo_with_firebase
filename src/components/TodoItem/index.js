import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { db, storage } from '../../firebase';
import { doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import FilesInput from '../FilesInput';

import styles from './TodoItem.module.scss';

/**
 * Компонент определенной задачи. <br/>
 * Содержит компонент FilesInput <br/>
 * [FilesInput]{@link module:FilesInput}
 * @module TodoItem
 */

/**
 * Тип объекта задачи
 * @typedef Todo
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
 * Тип объекта props TodoItem
 * @typedef TodoItemProps
 * @type {object}
 * @property {Todo} item - Объект задачи.
 * @property {boolean} isFull - Cвойство определяет показ задачи.
 * @property {boolean} isEdit - Cвойство определяет редактирование задачи.
 */

/**
 * @param {TodoItemProps} props
 */
const TodoItem = ({item, isFull, isEdit}) => {

    const lastDay = dayjs(item.overtime);
    const overtime = dayjs().diff(lastDay) > 86400000;
    const initialState = {
        id: item.id,
        title: item.title,
        description: item.description,
        overtime: item.overtime,
        files: item.files,
        status: overtime && item.status !== 'completed' ? 'failed' : item.status
    }
    const [state, setState] = useState(initialState);
    const navigate = useNavigate();

    useEffect(() => {
        if (state.status === 'failed') {
            updateDoc(doc(db, 'todos', item.id), {
                status: 'failed'
            })
        }
    }, [])

    const onSelectChangeHandler = (e) => {
        setState(state => ({
            ...state,
            status: e.target.value
        }))

        updateDoc(doc(db, 'todos', item.id), {
            status: e.target.value
        })
    }

    const deleteTask = async () => {
        // удаление задачи
        await deleteDoc(doc(db, "todos", item.id));

        // удаление файлов задачи
        item.files.forEach(file => {
            deleteObject(ref(storage, `files/${file.name}`))
        })
    }

    const onChangeHandler = (e) => {
        setState(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const updatedFiles = [];

        // удаляем старые файлы
        item.files.forEach(file => {
            deleteObject(ref(storage, `files/${file.name}`));
        })

        // добавляем новые файлы
        for(let file of state.files) {

            // создаем ссылку под каждый файл
            const filesRef = ref(storage, `files/${file.name}`);

            // загружаем каждый файл в облако firebase storage
            await uploadBytes(filesRef, file)
            
            // создаем URL на файл в облаке firebase storage
            const url = await getDownloadURL(ref(storage, `files/${file.name}`))

            updatedFiles.push({path: url, name: file.name});
        }

        // добавляем документ в коллекцию todos
        await setDoc(doc(db, 'todos', item.id), {...state, files: updatedFiles, createdAt: item.createdAt});

        navigate(`/todos/${item.id}`)
    }

    if (isEdit) {
        return (
            <div 
                className={styles.item + ' ' + styles.edit}>

                <div className={styles.title}>
                    <span className={styles.tbody}>{item.title}</span>
                    <div className={styles.btn_group}>
                        <Link to={`/todos/${item.id}/edit`} >
                            <button className={styles.btn}>
                                <i className="_icon-edit"></i>
                            </button>
                        </Link>
                        <button 
                            className={styles.btn}
                            onClick={deleteTask}>
                                <i className="_icon-delete"></i>
                        </button>
                    </div>
                </div>

                <form 
                    encType='multipart/form-data'
                    className={`${styles.body} ${styles.body_form}`}
                    onSubmit={onSubmit}>

                    <label className={styles.form__label}>
                        Изменить статус задачи: 
                        <select 
                            value={state.status}
                            name="status" 
                            id="status" 
                            onChange={onChangeHandler}>
                            <option value="wait">В процессе</option>
                            <option value="completed">Выполнено</option>
                            <option value="failed">Провалено</option>
                        </select>
                    </label>

                    <label className={styles.form__label} htmlFor='title'>
                        Изменить заголовок задачи: 
                    </label>
                    <input 
                        type="text" 
                        id='title' 
                        name='title' 
                        value={state.title}
                        className={styles.form__input} 
                        placeholder="Введите заголовок задачи" 
                        onChange={onChangeHandler}
                        required />

                    <label className={styles.form__label} htmlFor='description'>
                        Изменить описание задачи: 
                    </label>
                    <textarea 
                        id='description' 
                        name='description'
                        value={state.description} 
                        className={styles.form__textarea} 
                        placeholder="Введите описание задачи" 
                        onChange={onChangeHandler}
                        required/>

                    <label className={styles.form__label} htmlFor='date'>
                        Изменить дату окончания: 
                    </label>
                    <input 
                        type="date" 
                        id='date' 
                        name='overtime' 
                        min={dayjs().format('YYYY-MM-DD')}
                        value={state.overtime}
                        className={styles.form__input}
                        placeholder='Дата окончания' 
                        onChange={onChangeHandler}
                        required/>

                    <label className={styles.form__label} htmlFor='file'>
                        Изменить прикрепленные файлы: 
                    </label>

                    {!state.files || state.files.length === 0 ? 
                        <span className={styles.file}>Загрузите файлы...</span> : 
                        <ul className={styles.fileList}>
                            {Array.from(state.files).map(file => (
                                <li key={file.name} className={styles.file}>
                                    <a href={file.path}>{file.name}</a>
                                </li>
                            ))}
                        </ul>
                    }

                    <FilesInput 
                        className={`${`${styles.btn} ${styles.btn_edit} ${styles.btn_small}`} ${styles.btn_small}`} 
                        setFiles={(files) => setState(state => ({...state, files}))} 
                        placeholder="Изменить файлы"/>
                    <button 
                        type='submit' 
                        className={`${styles.btn} ${styles.btn_edit}`}>
                        Сохранить
                    </button>
                </form>
            </div>
        )
    }

    if (isFull) {
        return (
            <div 
                className={styles.item + ' ' + styles[state.status]}>

                <div className={styles.title}>
                    <span className={styles.tbody}>{item.title}</span>
                    <div className={styles.btn_group}>
                        <Link to={`/todos/${item.id}/edit`} >
                            <button className={styles.btn}>
                                <i className="_icon-edit"></i>
                                </button>
                        </Link>
                        <button 
                            className={styles.btn}
                            onClick={deleteTask}>
                                <i className="_icon-delete"></i>
                        </button>
                    </div>
                </div>

                <div className={styles.body}>

                    <select 
                        value={state.status}
                        name="status" 
                        id="status" 
                        onChange={onSelectChangeHandler}
                        disabled={overtime}>
                        <option value="wait">В процессе</option>
                        <option value="completed">Выполнено</option>
                        <option value="failed">Провалено</option>
                    </select>

                    <span className={styles.date}>Дата окончания - {lastDay.format('DD.MM.YYYY')}</span>

                    <div className={styles.description}>{item.description}</div>
                    <div className={styles.files}>
                        {item.files.length > 0 && 
                        <>
                            Файлы:
                            <ul className={styles.fileList}>
                                {
                                    item.files.map(file => (
                                        <li key={file.name} className={styles.file}>
                                            <a href={file.path}>{file.name}</a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                        }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <li 
            className={styles.item + ' ' + styles[state.status]}>

            <div className={styles.title}>
                <Link to={`todos/${item.id}`} className={styles.tbody}>{item.title}</Link>
                <div className={styles.btn_group}>
                    <Link to={`/todos/${item.id}/edit`} >
                        <button className={styles.btn}>
                            <i className="_icon-edit"></i>
                            </button>
                    </Link>
                    <button 
                        className={styles.btn}
                        onClick={deleteTask}>
                            <i className="_icon-delete"></i>
                    </button>
                </div>
            </div>

            <div className={styles.body}>

                <select 
                    value={state.status}
                    name="status" 
                    id="status" 
                    onChange={onSelectChangeHandler}
                    disabled={overtime}>
                    <option value="wait">В процессе</option>
                    <option value="completed">Выполнено</option>
                    <option value="failed">Провалено</option>
                </select>

                <span className={styles.date}>Дата окончания - {lastDay.format('DD.MM.YYYY')}</span>

                <div className={styles.description}>{item.description}</div>
                <div className={styles.files}>
                    {item.files.length > 0 && 
                    <>
                        Файлы:
                        <ul className={styles.fileList}>
                            {
                                item.files.map(file => (
                                    <li key={file.name} className={styles.file}>
                                        <a href={file.path}>{file.name}</a>
                                    </li>
                                ))
                            }
                        </ul>
                    </>
                    }
                </div>
            </div>
        </li>
    );
};

export default TodoItem;