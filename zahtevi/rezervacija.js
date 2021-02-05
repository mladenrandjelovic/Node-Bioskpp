const express=require('express')
const mysql=require('mysql')
const app=require('../app');
const termin=require('./termini');
const zahtev=require('./zahtev');
async function dodaj(korisnik_id,termin_id,sedista,sifra_rezervacije)
{
    //console.log(sala_id,film_id,vreme_prikazivanja)
   // let sql="INSERT INTO termini (sala_id,film_id,vreme_prikazivanja) VALUES(?,?,?)"
   termin.prikazi(termin_id).then((termin)=>
   {
       var cena_karte=termin[0].cena_karte;
       var racun=cena_karte*sedista.length;
        kreiraj_rezervaciju(korisnik_id,termin_id,racun,sifra_rezervacije).then((rezervacija)=>
        {
            dodaj_sedista_rezervaciji(rezervacija.insertId,sedista).then((rezervisana_sedista)=>{

            })

        })
   })
}
async function prikazi_za_korisnika(korisnik_id)
{
    let sql="SELECT rezervacije.id,filmovi.naziv as naziv_filma,rezervacije.sifra_rezervacije,sale.naziv as naziv_sale,DATE_FORMAT(termini.vreme_prikazivanja, '%d.%m.%Y. %H:%i') as vreme_prikazivanja,rezervacije.racun as cena_karata,DATE_FORMAT(rezervacije.vreme_rezervacije, '%d.%m.%Y. %H:%i') as vreme_rezervacije FROM rezervacije INNER JOIN termini ON termini.id=rezervacije.termin_id INNER JOIN filmovi ON filmovi.id=termini.film_id INNER JOIN sale ON sale.id=termini.sala_id WHERE rezervacije.korisnik_id=? ORDER BY vreme_rezervacije DESC";
   return zahtev.query(sql,[korisnik_id]);
}
async function nadji(rezervacija_id)
{
    let sql="SELECT * FROM rezervacije WHERE id=?";
    return zahtev.query(sql,[rezervacija_id]);

}
async function prikazi(rezervacija_id,korisnik_id)
{
    let sql="SELECT rezervacije.id,sifra_rezervacije,filmovi.naziv as naziv_filma,sale.naziv as naziv_sale,DATE_FORMAT(termini.vreme_prikazivanja, '%d.%m.%Y. %H:%i') as vreme_prikazivanja,rezervacije.racun as cena_karata,DATE_FORMAT(rezervacije.vreme_rezervacije, '%d.%m.%Y. %H:%i') as vreme_rezervacije FROM rezervacije INNER JOIN termini ON termini.id=rezervacije.termin_id INNER JOIN filmovi ON filmovi.id=termini.film_id INNER JOIN sale ON sale.id=termini.sala_id WHERE rezervacije.id=? AND rezervacije.korisnik_id=?";
    return zahtev.query(sql,[rezervacija_id,korisnik_id]);
}
async function admin_prikazi(rezervacija_id)
{
    let sql="SELECT rezervacije.id,sifra_rezervacije,filmovi.naziv as naziv_filma,sale.naziv as naziv_sale,DATE_FORMAT(termini.vreme_prikazivanja, '%d.%m.%Y. %H:%i') as vreme_prikazivanja,rezervacije.racun as cena_karata,DATE_FORMAT(rezervacije.vreme_rezervacije, '%d.%m.%Y. %H:%i') as vreme_rezervacije FROM rezervacije INNER JOIN termini ON termini.id=rezervacije.termin_id INNER JOIN filmovi ON filmovi.id=termini.film_id INNER JOIN sale ON sale.id=termini.sala_id WHERE rezervacije.id=?";
    return zahtev.query(sql,[rezervacija_id]);
}
async function obrisi_za_korisnika(korisnik_id,rezervacija_id)
{
    let sql="DELETE FROM rezervacije WHERE id=? AND korisnik_id=?";
    return zahtev.query(sql,[rezervacija_id,korisnik_id]);
}
async function admin_obrisi(rezervacija_id)
{
    let sql="DELETE FROM rezervacije WHERE id=?";
    return zahtev.query(sql,[rezervacija_id]);
}
async function prikazi_mesta(rezervacija_id,korisnik_id)
{
    let sql="SELECT * FROM rezervacije_sedista WHERE rezervacija_id=?";
    return zahtev.query(sql,[rezervacija_id]);
}
async function prikazi_rezervisana_mesta(termin_id)
{
    //let sql1="SELECT rezervacije_sedista.* FROM rezervacije,rezervacije_sedista WHERE rezervacije.termin_id=? AND rezervacije_sedista.rezervacija_id=rezervacije.id";//prvi nacin za join 2 tabele
    let sql="SELECT rezervacije_sedista.* FROM rezervacije INNER JOIN rezervacije_sedista ON rezervacije_sedista.rezervacija_id=rezervacije.id WHERE rezervacije.termin_id=? ";//2 nacin za join 2 tabele
   return zahtev.query(sql,[termin_id]);
}
async function prikazi_za_termin(termin_id)
{
    let sql="SELECT *,rezervacije.id as id,DATE_FORMAT(rezervacije.vreme_rezervacije, '%d.%m.%Y. %H:%i') as vreme_rezervacije FROM rezervacije INNER JOIN korisnici ON korisnici.id=rezervacije.korisnik_id WHERE rezervacije.termin_id=?";
    return zahtev.query(sql,[termin_id]);
}
async function kreiraj_rezervaciju(korisnik_id,termin_id,racun,sifra_rezervacije)
{
    let sql="INSERT INTO rezervacije (termin_id,korisnik_id,vreme_rezervacije,racun,sifra_rezervacije) VALUES(?,?,NOW(),?,?)";

   return zahtev.query(sql,[termin_id,korisnik_id,racun,sifra_rezervacije]);
}
async function dodaj_sedista_rezervaciji(rezervacija_id,sedista)
{
    let sql="";
    let vrednosti_za_ubacivanje=new Array();
   /* ? ? ? ? ? ? ? ? ? ?
    rezervacija_id sedista[0].red,sedista[0].mesto,rezervacija_id,sedista[1].red,sedista[1].mesto*/
    for(i=0;i<sedista.length;i++)
    {
        vrednosti_za_ubacivanje.push(rezervacija_id.toString());
        vrednosti_za_ubacivanje.push(sedista[i].red);
        vrednosti_za_ubacivanje.push(sedista[i].mesto);
        if(i==0)//za ubacivanje prvog sedista
        sql+="INSERT INTO rezervacije_sedista (rezervacija_id,red,mesto_u_redu) VALUES (?,?,?)";//posto zapocinjemo query
        else
        sql+=",(?,?,?)";
    }
   return zahtev.query(sql,vrednosti_za_ubacivanje);
}
exports.obrisi_za_korisnika=obrisi_za_korisnika;
exports.dodaj=dodaj;
exports.prikazi_za_korisnika=prikazi_za_korisnika;
exports.prikazi_rezervisana_mesta=prikazi_rezervisana_mesta;
exports.prikazi_mesta=prikazi_mesta;
exports.prikazi=prikazi;
exports.admin_prikazi=admin_prikazi;
exports.admin_obrisi=admin_obrisi;
exports.prikazi_za_termin=prikazi_za_termin;
exports.nadji=nadji;