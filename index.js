const express = require('express');
const axios = require('axios');
const cors = require('cors');
const {Pool} = require('pg');
const path = require('path');

const app = express();

app.use(cors());

//serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')))


//configuring postgreSql connection
const pool = new Pool({
    user: 'postgres',
    host:'localhost',
    database: 'hold',
    password:'root',
    port:5432
})




//fetching top 10 results fro api and storing them into database

app.get('/users', async (req, res)=>{
    try{
        //fetch data from api
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;

    //extracting top 10 entries
    const top10 = Object.values(data).slice(0,10).map((item)=> ({

        name: item.name,
        last: parseFloat(item.last),
        buy: parseFloat(item.buy),
        sell: parseFloat(item.sell),
        volume:parseFloat(item.volume),
        base_unit: item.base_unit


    }));


    //store top 10 in db
    for(let ticker of top10){
        await pool.query(
            'INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
            [ticker.name, ticker.last, ticker.buy, ticker.sell, ticker.volume, ticker.base_unit]

        );
    }


    res.send('Top 10 tickers stored successfully');

    }catch(error){
        console.error('Error fetching or storing data:', error);
        res.status(500).send('Failed to fecth or store data');
    }
    

});


//fetch stored data from db and send to frontend

app.get('/getusers', async (req,res) =>{
    try{

        const result = await pool.query('SELECT * FROM tickers');
        res.json(result.rows);

    }catch(error){

        console.error('Error fetching data:', error);
        res.status(500).send('Failed to fetch data');

    }
})


const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})