import React, { memo, useRef, useState } from 'react';
import { v4 as uid } from 'uuid';
import dayjs from 'dayjs';
import { db, storage } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import styles from './SideBarForm.module.scss';
import FilesInput from '../FilesInput';

/**
 * Компонент - Форма добавления задачи <br/>
 * Содержит компонент FilesInput <br/>
 * [FilesInput]{@link module:FilesInput}
 * @module SideBarForm
 */
const SideBarForm = () => {

    /**
     * Тип состояния формы 
     * @typedef FormState
     * @type {object}
     * @property {string} id - ID.
     * @property {string} title - Заголовок задачи.
     * @property {string} description - Описание задачи.
     * @property {string} overtime - Срок выполнения задачи. Формат "YYYY-MM-DD"
     * @property {array} files - Файлы задачи.
     * @property {string} status - Статус задачи. Имеет 3 состояния "completed", "failed", "wait".
     * @property {number} createdAt - Дата создания задачи в миллисекундах.
     */
    
    /** @type {FormState} */
    const initialState = {
        id: '',
        title: '',
        description: '',
        overtime: '',
        files: [],
        status: 'wait',
        createdAt: dayjs().valueOf()
    }

    const [state, setState] = useState(initialState);
    
    const onChangeHandler = (e) => {
        const attr = e.target.name;

        setState(state => ({
            ...state,
            [attr]: e.target.value
        }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const uploadedFiles = [];
        const id = uid();
        
        // проходим по массиву добавляемых файлов
        for(let file of state.files) {

            // создаем ссылку под каждый файл
            const filesRef = ref(storage, `files/${file.name}`);

            // загружаем каждый файл в облако firebase storage
            await uploadBytes(filesRef, file)
            
            // создаем URL на файл в облаке firebase storage
            const url = await getDownloadURL(ref(storage, `files/${file.name}`))

            uploadedFiles.push({path: url, name: file.name});
        }

        // добавляем задачу
        await setDoc(doc(db, 'todos', id), {
            ...state, 
            id, 
            files: uploadedFiles
        });

        setState(initialState)
        e.target.reset();
    }

    return (
        <form 
            encType='multipart/form-data' 
            className={styles.form} 
            onSubmit={onSubmitHandler}>
            <span className={styles.title}>Добавление задачи</span>

            <label className={styles.form__label} htmlFor='title'>
                Введите заголовок задачи: 
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
                Введите описание задачи: 
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
                Введите дату окончания: 
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
                Прикрепите необходимые файлы: 
            </label>

            {!state.files || state.files.length === 0 ? 
                <span className={styles.fileName}>Загрузите файлы...</span> : 
                Array.from(state.files).map(item => <div key={item.name} className={styles.fileName}>{item.name}</div>)
            }

            <FilesInput 
                className={`${styles.btn} ${styles.btn_small}`} 
                setFiles={(files) => setState(state => ({...state, files}))} 
                placeholder="Добавить файл"/>
            <button 
                type='submit' 
                className={styles.btn}>
                Добавить
            </button>
        </form>
    );
};

export default memo(SideBarForm);