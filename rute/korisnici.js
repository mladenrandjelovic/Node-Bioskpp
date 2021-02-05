const express=require('express');
const router=express.Router();
const korisnici=require('../zahtevi/korisnici')
const filmovi=require('../zahtevi/filmovi')
const sale=require('../zahtevi/sale')
const termini=require('../zahtevi/termini')
const rezervacija=require('../zahtevi/rezervacija')
const passwordHash=require('password-hash');
router.get('/prijava',(req,res)=>//prikazuje formu za prijavu
{
    res.render('korisnici/prijava')
})
router.post('/prijava',(req,res)=>//kada korisnik prosledi popunjenu formu
{
    korisnici.nadjiPrekoMaila(req.body.email).then((korisnik)=>//trazimo korisnika za odrejeni email(koji je on uneo u formu)
    {

        if(korisnik.length!=0)//posto query uvek vraca podatke kao niz ako mu je duzina nula znaci da nije naslo korisnika sa odredjenim mailom
        {
            korisnik=korisnik[0];//posto query vraca array ovde ga pretravaramo u obicnu promenjivu posto imamo samo jednog korisnika za odrejdnei mail
            var uneta_sifra=req.body.lozinka;//smestamo sifru koju je korisnik uneo u promenjivu
            var hashovana_iz_baze=korisnik.sifra;//smestamo sifru iz baze u drugu promenjivu,ova sifra je hesovana
            var sifra_je_tacna=passwordHash.verify(uneta_sifra,hashovana_iz_baze);//posto je sifra iz baze hesovana,a sifra koju je korisnik uneo nije mi moramo da ih uporedimo pomocu funckije iz biblioteke za hesovanje sifri
            if(sifra_je_tacna==true)//ako je sifra tacna mozemo prijaviti korisnika
            {
                req.session.korisnik_id=korisnik.id;//njegov id pamtimo u sesiji
                req.session.tip_naloga=korisnik.tip_naloga;//njegov tip naloga pamtimo u sesiji
                req.session.tip_poruke='uspesno';//za prikaz poruke o uspesnom logovanju
                req.session.sadrzaj_poruke="Uspešno ste se prijavili.";//poruka koja ce se prikazati
                res.redirect('/filmovi/trenutni');//preusmeravamo ga na stranicu sa filmovima koji se trenutno prikazuju 
            }
            else
            {
                res.render('korisnici/prijava',{greska:"Pogrešan email ili lozinka"})//ako je korisnik uneo pogresanu lozinku(namerno mu ispisujemo pogresan email ili lozinika kako ne bi znao sta je promasio(ako je haker koji proverava da li odredjeni korisnik ima nalog na sajtu))
            }
        }
        else
        {
            res.render('korisnici/prijava',{greska:"Pogrešan email ili lozinka"})// u slucaju da nije nasao korisnika po emailu
        }

    })
})
router.post('/odjava',(req,res)=>//sluzi za odjavu korisnika
{
    req.session.korisnik_id=null;//setujemo id korisnika u sesiji na null
    req.session.tip_naloga=null;//setujemo tip naloga na null
    res.redirect('/prijava');
})
router.get('/registracija',(req,res)=>//ruta koja prikazuje formu za registraciju
{
    res.render('korisnici/registracija')
})
router.post('/registracija',(req,res)=>
{
    hash_sifra = passwordHash.generate(req.body.lozinka);//posto se sifra u bazi cuva kao hesovana mi je hesujemo
    korisnici.napravi_nalog(req.body.ime,req.body.prezime,req.body.email,hash_sifra,req.body.br_telefona).then((result)=>
    {//pozivamo metodu koja cuva podatke u bazi
        req.session.tip_poruke='uspesno';
        req.session.sadrzaj_poruke="Uspešno ste registrovali.";//ispisujemo poruku da se uspesno ulogovao
        res.redirect('/prijava')//preusmervamo ga na stranici za prijavu
    })
})
module.exports=router;