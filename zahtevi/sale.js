const express=require('express')
const mysql=require('mysql')
const app=require('../app');
const zahtev=require('./zahtev');
async function dodaj(naziv,broj_redova,broj_mesta_u_redu)
{
    let sql="INSERT INTO sale (naziv,broj_redova,broj_mesta_u_redu) VALUES(?,?,?)"

   return zahtev.query(sql,[naziv,broj_redova,broj_mesta_u_redu]);
}
async function prikazi()
{
    let sql="SELECT * FROM sale"

   return zahtev.query(sql,null);
}

exports.dodaj=dodaj;
exports.prikazi=prikazi;