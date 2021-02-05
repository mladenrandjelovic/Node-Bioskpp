const express=require('express')
const mysql=require('mysql')
const app=require('../app');
const zahtev=require('./zahtev');
async function dodaj(naziv,izvorni_naziv,trajanje,drzava,pocetak_prikazivanja,kraj_prikazivanja,slika,imdb_link)
{
    let sql="INSERT INTO filmovi (naziv,izvorni_naziv,trajanje,drzava,pocetak_prikazivanja,kraj_prikazivanja,slika,imdb_link) VALUES(?,?,?,?,?,?,?,?)"
    return zahtev.query(sql,[naziv,izvorni_naziv,trajanje,drzava,pocetak_prikazivanja,kraj_prikazivanja,slika,imdb_link]);
}
async function arhiva()
{
    let sql="SELECT *,DATE_FORMAT(pocetak_prikazivanja, '%d.%m.%Y.') as pocetak_prikazivanja,DATE_FORMAT(kraj_prikazivanja, '%d.%m.%Y.') as kraj_prikazivanja FROM filmovi WHERE kraj_prikazivanja<CURDATE()"
    return zahtev.query(sql,[]);
}
async function nearhivirani()
{
    let sql="SELECT *,DATE_FORMAT(pocetak_prikazivanja, '%d.%m.%Y.') as pocetak_prikazivanja,DATE_FORMAT(kraj_prikazivanja, '%d.%m.%Y.') as kraj_prikazivanja FROM filmovi WHERE kraj_prikazivanja>=CURDATE()"
    return zahtev.query(sql,[]);
}
async function najava()
{
    let sql="SELECT *,DATE_FORMAT(pocetak_prikazivanja, '%d.%m.%Y.') as pocetak_prikazivanja,DATE_FORMAT(kraj_prikazivanja, '%d.%m.%Y.') as kraj_prikazivanja FROM filmovi WHERE pocetak_prikazivanja>CURDATE()"
    return zahtev.query(sql,[]);
}
async function nadji(id)
{
    let sql="SELECT * FROM filmovi WHERE id=? LIMIT 1"
    return zahtev.query(sql,[id]);
}
async function prikazi_trenutne()
{
    let ts=Date.now();//vraca unix(ali u milisekundama,unix je u sekundama) broj milisekundi od 1.1.1970.
    let datum=new Date(ts);//pretvara u date object
    let godina=datum.getFullYear();//uzimamo godinu odatle
    let mesec=datum.getMonth()+1;//meseci krecu od 0 zato poveccavamo za 1
    let dan=datum.getDate();
    let datum_za_bazu=godina+'-'+mesec+'-'+dan;//formiramo datum koji u formatu godina-mesec-dan npr 2021-01-14
    let sql="SELECT * FROM filmovi WHERE pocetak_prikazivanja < ? AND kraj_prikazivanja > ?";//povlacimo filmove koji se trenutno prikazuju
    return zahtev.query(sql,[datum_za_bazu,datum_za_bazu]);
}
exports.dodaj=dodaj;
exports.prikazi_trenutne=prikazi_trenutne;
exports.nadji=nadji;
exports.arhiva=arhiva;
exports.najava=najava;
exports.nearhivirani=nearhivirani;