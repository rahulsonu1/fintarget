const express = require('express');
const dotenv=require('dotenv').config() 
const app=express()









const port=process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Worker ${process.pid} started on port ${port}`);
});