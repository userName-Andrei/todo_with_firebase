import Main from "./pages/Main";
import Todo from "./pages/Todo";
import SideBarForm from './components/SideBarForm';
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import './App.scss';

/**
 * Основной шаблон приложения.
 * @module App
 */

/**
 * Содержит роутинг на другие страницы, использует компонент формы и страницы: <br/>
 * [Главная страница]{@link module:Main} <br/>
 * [Страница определенной задачи]{@link module:Todo} <br/>
 * [Форма добавления задачи]{@link module:SideBarForm} <br/>
 */
function App() {

    return (
        <BrowserRouter>
        <div className="App">
            <div className="content">
                <Routes>
                    <Route path='/' element={<Main />} />
                    <Route path='*' element={<Main />} />
                    <Route path='/todos/:id' element={<Todo isFull />} />
                    <Route path='/todos/:id/edit' element={<Todo isEdit />} />
                </Routes>
            </div>
            <div className="sidebar">
                <div className="sidebar__body">
                    <SideBarForm />
                </div>
            </div>
        </div>
        </BrowserRouter>
    );
}

export default App;
