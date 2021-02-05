const express=require('express')
const mysql=require('mysql')
const app=require('../app');
const zahtev=require('./zahtev');
async function dodaj(sala_id,film_id,vreme_prikazivanja,cena_karte)
{
    //console.log(sala_id,film_id,vreme_prikazivanja)
    let sql="INSERT INTO termini (sala_id,film_id,vreme_prikazivanja,cena_karte) VALUES(?,?,?,?)"

   return zahtev.query(sql,[sala_id,film_id,vreme_prikazivanja,cena_karte]);
}
async function prikazi(id)
{
    let sql="SELECT * FROM termini WHERE id=?";

   return zahtev.query(sql,[id]);
}

async function prikazi_za_filmove(idovi_filmova)
{
    let upitnici="";
    for(let i=0;i<idovi_filmova.length;i++)
    {
        if(i==0)
        upitnici+='?';
        else
        upitnici+=",?";
    }
    console.log(upitnici);
    let sql="SELECT termini.*,DATE_FORMAT(termini.vreme_prikazivanja, '%d.%m.%Y. %H:%i') as vreme_prikazivanja,sale.naziv as naziv_sale FROM termini INNER JOIN sale ON sale.id=termini.sala_id WHERE film_id IN("+upitnici+") AND termini.vreme_prikazivanja>=NOW() ORDER BY termini.vreme_prikazivanja";

   return zahtev.query(sql,idovi_filmova);
}
async function prikazi_sa_filmom_i_salom(id_termina)
{
    let sql="SELECT termini.*,DATE_FORMAT(termini.vreme_prikazivanja, '%d.%m.%Y. %H:%i') as vreme_prikazivanja,filmovi.naziv as naziv_filma,sale.naziv as naziv_sale,sale.broj_redova,sale.broj_mesta_u_redu FROM termini INNER JOIN sale ON sale.id=termini.sala_id INNER JOIN filmovi ON filmovi.id=termini.film_id WHERE termini.id=? LIMIT 1";
    return zahtev.query(sql,id_termina);
}
async function prikazi_danasnje()
{
    let sql="SELECT termini.*,DATE_FORMAT(termini.vreme_prikazivanja, '%d.%m.%Y. %H:%i') as vreme_prikazivanja,filmovi.naziv as naziv_filma,sale.naziv as naziv_sale,sale.broj_redova,sale.broj_mesta_u_redu FROM termini INNER JOIN sale ON sale.id=termini.sala_id INNER JOIN filmovi ON filmovi.id=termini.film_id WHERE DATE(termini.vreme_prikazivanja)=CURDATE()";
    return zahtev.query(sql);
}
async function obrisi(termin_id)
{
    let sql="DELETE FROM termini WHERE id=?";
    return zahtev.query(sql,[termin_id]);
}
exports.dodaj=dodaj;
exports.prikazi=prikazi;
exports.prikazi_za_filmove=prikazi_za_filmove;
exports.prikazi_sa_filmom_i_salom=prikazi_sa_filmom_i_salom;
exports.prikazi_danasnje=prikazi_danasnje;
exports.obrisi=obrisi;