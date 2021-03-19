/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-19 19:30:55
 */
import React from 'react';
import ReactDOM from 'react-dom';

// import Test from '@/Test';
// import npm from '@public/assets/imgs/npm.png';
// import {} from '@src/index';

// import npm from '@public/'

// import Index from './Test'
import Index from '@/Test'

// import {} from '@/Test';
import './style.scss';

const App = () => (
    <div>
        {/* <img src={npm} alt="图片" /> */}
        <Index/>
        1133366
    </div>
);

ReactDOM.render(<App />, document.querySelector('#root'));
