import React, { useRef } from 'react';

/**
 * Компонент, отвечающий за тег input[type="file"].
 * @module FilesInput
 */

 /**
 * @typedef FilesInputProps
 * @type {object}
 * @property {string} className - имя класса.
 * @property {function} setFiles - функция для изменения состояния в компоненте формы.
 * @property {string} placeholder - текст кнопки.
 */

/**
 * @param {FilesInputProps} - в props принимает объект типа тип FilesInputProps
 * @returns {void}
 */
const FilesInput = ({className, setFiles, placeholder}) => {

    const inputRef = useRef(null);

    const onClickHandler = () => {
        inputRef.current.click()
    }

    const onChangeHandler = (e) => {
        const filesUploaded = e.target.files;
        setFiles(filesUploaded)
    }

    return (
        <>
            <button
                type='button'
                className={className}
                onClick={onClickHandler}>
                {placeholder}
            </button>
            <input 
                ref={inputRef} 
                type="file"
                id='file' 
                name='files'
                onChange={onChangeHandler} 
                style={{display: 'none'}}
                multiple
                hidden />
        </>
    )
}

export default FilesInput;