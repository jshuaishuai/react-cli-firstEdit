/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-20 14:09:53
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Index from '@/src/Test'
import {} from '@/src/'
import dog from '@/src/assets/imgs/dog.jpeg';
import './style.scss';

const App = () => (
    <div>
        <Index/>
        <img src={dog} alt='表情包'/>
    </div>
)
ReactDOM.render(<App />, document.querySelector('#root'));
