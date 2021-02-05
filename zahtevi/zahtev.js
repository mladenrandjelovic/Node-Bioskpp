const express=require('express')
const mysql=require('mysql')
const app=require('../app');
function query(sql,parametri)
{
    return new Promise((resolve)=>
    {
        app.pool.query(sql,parametri,(err,result)=>
        {
            //console.log(err);
            resolve(result)
        }
        )
    })
}
exports.query=query;