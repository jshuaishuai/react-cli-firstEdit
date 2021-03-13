/*
 * @Descripttion: 
 * @Author: Jason
 * @LastEditTime: 2021-03-13 11:54:42
 */
import React from 'react';
import ReactDOM from 'react-dom';

import npm from '@public/assets/imgs/npm.png'
import './style.scss'

const App = () => {
    return (<div>
        App入口
        <img src={npm} />
    </div>);
}

ReactDOM.render(<App />, document.querySelector('#root'))