const express=require('express')
const mysql=require('mysql')
const parser = require('body-parser')
const app=express();
const rute_termini=require('../nodeBioskop/rute/termini')
const rute_filmovi=require('../nodeBioskop/rute/filmovi')
const rute_rezervacije=require('../nodeBioskop/rute/rezervacije')
const rute_sale=require('../nodeBioskop/rute/sale')
const rute_korisnici=require('./rute/korisnici')
const rute_stranice=require('../nodeBioskop/rute/stranice')
app.use('/test123',rute_termini)
const session = require('express-session')

app.use(session({
    secret: 'W3btMMZe7zwbpUL79XKx',
    resave: false,
    saveUninitialized: true,
  }))
app.set('view engine','pug')
app.use(parser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(function (req, res, next) {//prilikom svakoog zahteva za pristup stranici ce se izvrsiti ova funkcija
   /*
   Mi u sesiji cuvamo dva tipa podatka: podatak u idiju korisnika i podatak o njegovom tipu naloga(obican ili admin).
   Takodje cuvamo i podatke o poruci i tipu poruke(poruke recimo kada kreira rezervaciju pa da mu se ispise "Rezervacija uspesno dodata" ili prilikom dodavanja sale na ispise poruku "Sala uspesno dodata")
   Mi u nekim view-ovima koristimo te podatke,medjutim tu nam infomracije o sesiji nisu dostupne zbog toga pre izvrssenja bilo kog zahteva mi te podatke
   smestamo u lokalnim promenjivima za response posto su nam one dostupe u view-u
   */
    if(typeof req.session.korisnik_id!='undefined')//ako tip nije undefined to znaci da je korisnik ulogovan
   {
       res.locals.korisnik_id=req.session.korisnik_id;//setujemo lokalnoj promenjivoj u responsu id korisnika koji se nalazi u sesiji

   }
   else
   {
       res.locals.korisnik_id=null;//ako korisnik nije ulogovan setujemo na null id korisnika
   }
   if(typeof req.session.tip_naloga!='undefined')
   {
       res.locals.tip_naloga=req.session.tip_naloga;//setujemo lokalnoj promenjivoj u odgovoru tip naloga iz sesije

   }
   else
   {
    res.locals.tip_naloga=null;
   }
   if(typeof req.session.tip_poruke!='undefined')// u slucaju da postoji poruka koju je potrebno prikazati korisniku
   {
       res.locals.tip_poruke=req.session.tip_poruke;//cuvamo tip te poruke(uspesno,upozorenje,greska)

   }
   else
   {
    res.locals.tip_poruke=null;
   }
   if(typeof req.session.sadrzaj_poruke!='undefined')
   {
       res.locals.sadrzaj_poruke=req.session.sadrzaj_poruke;//cuvamo sadrzaj poruke u lokalnoj promenjivoj 

   }
   else
   {
    res.locals.sadrzaj_poruke=null;//znaci da poruka ne postoji pa se promenjiva setuje na null
   }
    req.session.sadrzaj_poruke=null;
    req.session.tip_poruke=null;//posto je poruku u uspesnom izvresenju neke radnje ili u gresci potrebno prikazati samo jednom(kada korisnik predje na drugu stranu on
    //ne vise ne treba da vidi tu poruku) onda je na kraju brisemo tj setujemo tip poruke i sadrzaj poruke na null samim tip se nece prikazati
    next();
  })
const pool = mysql.createPool({//kreiramo pool konekcija kako bi moglo da se izvrsava vise od jednog zahteva istovremeno
    host: 'localhost', user: 'root',database: 'bioskop',//podaci za pristup bazi
    connectionLimit : 10//koliko maksimalno konekcija sme da bude u poolu
    })
        
app.listen(3000);
//posto su nam rute razdvojene u vise fajlova ovde ih "importujemo"
app.use('/filmovi',rute_filmovi);
app.use('/termini',rute_termini);
app.use('/rezervacije',rute_rezervacije);
app.use('/sale',rute_sale);
app.use('/',rute_korisnici);
app.use('/',rute_stranice)

//TODO prikazi samo termine koji su u buducnosti!


exports.pool=pool;