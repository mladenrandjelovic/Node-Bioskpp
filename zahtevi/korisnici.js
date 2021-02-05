const express=require('express')
const mysql=require('mysql')
const app=require('../app');
const zahtev=require('./zahtev');
async function napravi_nalog(ime,prezime,email,hash_sifra,broj_telefona)
{
    //console.log(ime,prezime,email,sifra,broj_telefona)
    let sql="INSERT INTO korisnici (ime,prezime,email,sifra,broj_telefona) VALUES(?,?,?,?,?)"
    return zahtev.query(sql,[ime,prezime,email,hash_sifra,broj_telefona]);
}
async function prikazisve()
{
   let sql='SELECT * from korisnici';
   return zahtev.query(sql,null);
}
async function prikazi(id)
{
   let sql="SELECT * from korisnici WHERE id="+id;
   return zahtev.query(sql,null);
}
async function nadjiPrekoMaila(email)
{
   let sql="SELECT * from korisnici WHERE email=?";
   return zahtev.query(sql,[email]);
}

exports.prikazisve=prikazisve;
exports.prikazi=prikazi;
exports.napravi_nalog=napravi_nalog;
exports.nadjiPrekoMaila=nadjiPrekoMaila;