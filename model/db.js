const mong = require('mongoose');
mong
.connect('mongodb://127.0.0.1:27017/expense')
.then(()=>console.log('db connected'))
.catch((err)=>console.log(err.message));