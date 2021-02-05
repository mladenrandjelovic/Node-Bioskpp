const express=require('express');
const router=express.Router();
const korisnici=require('../zahtevi/korisnici')
const filmovi=require('../zahtevi/filmovi')
const sale=require('../zahtevi/sale')
const termini=require('../zahtevi/termini')
const rezervacija=require('../zahtevi/rezervacija')
router.get('/dodaj',(req,res)=>//prikazuje stranicu za dodavanje filma
{
    if(req.session.tip_naloga!='admin')//proverava u sesiji da li korisnik nije admin
        res.render('stranice/zabranjeno')// u slucaju da korisnik nije admin prikazuje mu stranicu da on nema dozvolu za pristup
    else
        res.render('filmovi/dodavanje_filma')//u slucaju da je korisnik admin prikazuje mu se stranica za dodavanje filma
})
router.post('/dodaj',(req,res)=>//POST zahtev za dodavanje filma poziva sa kada korisnik posalje formu sa popunjenim informacijama o filmu serveru
{
    if(req.session.tip_naloga!='admin')//proverava da li korisnik nije admin
        res.render('stranice/zabranjeno')//prikazuje stranicu za zabranjen pristup posto korisnik nije admin
    else
    {
    filmovi.dodaj(req.body.naziv,req.body.izvorni_naziv,req.body.trajanje,req.body.drzava,req.body.pocetak_prikazivanja,req.body.kraj_prikazivanja,req.body.slika,req.body.imdb_link).then((result)=>
    {//poziva funkciju koja izvrsava sql upit za dodavanje filma u bazi
            res.render('filmovi/dodavanje_filma',{uspesno:'Uspesno ste dodali film'})//posle dodavanja filma korisniku se prikazuje stranica za dodavanje filma sa porukom da je film uspesno dodat
    })
    }

})
router.get('/arhiva',(req,res)=>//prikazuje sve filmove koji se vise ne prikazuju
{
    filmovi.arhiva().then((filmovi)=>//poziva funkciju koja izvrsava upit u bazi i pronalazi sve filmove koji se vise ne prikazuju
    { //posto je ovo asihnhrona funkcija tek kada se dobije rezultat njenog izvrsenja se izvrsava kod u ovom bloku
        res.render('filmovi/lista_filmova',{filmovi})//korisinku se prikazuju view sa listom filmova,njemu se kao paramtar prosledjuje niz sa filmovima koje je sql upit vratio
    })

})
router.get('/najava',(req,res)=>//isto kao i arhiva samo prikazuje filmove koji su u najavi
{
    filmovi.najava().then((filmovi)=>
    {
        res.render('filmovi/lista_filmova',{filmovi})
    })

})
router.get('/nearhivirani',(req,res)=>//ova ruta prikazuje sve filmove koji se prikazuju ili ce se tek prikazivati
{
    if(req.session.tip_naloga=='admin')//posto ova ruta sluzi adminu za dodavanje termina za filmove njoj samo admin ima pristup
    {
        filmovi.nearhivirani().then((filmovi)=>
        {//pronalazi sve filome koji se trenutno prikazuju ili ce se prikazivati u bazi
            res.render('filmovi/lista_filmova_za_dodavanje_termina',{filmovi});//te filmove salje view-u kao parametar
        })
    }
    else
    {
        res.render('stranice/zabranjeno');
    }

})

router.get('/trenutni',(req,res)=>//ova ruta sluzi za prikaz filmova koji se trenutno prikazuju korisniku
{
   filmovi.prikazi_trenutne().then((trenutni_filmovi)=>//ova funkcija vraca sve filmove koji su trenutno na repertoaru
   {
       if(typeof trenutni_filmovi=='undefined')//tip ce biti undefined ako nije pronadjen nijedan film
       {
        trenutni_filmovi=Array();//setujemo niz trenutni_filmovi na prazan niz(zbog toga sto imamo foreach petlju u view-u kako ne bi bagovalo)
       }
    let idovi=Array();
    for(let i=0;i<trenutni_filmovi.length;i++)//prolazimo kroz niz sa trenutnim filmovima
    {
        idovi.push(trenutni_filmovi[i].id);//izvlacimo id za svaki film i smestamo ga u niz idovi
    }
    termini.prikazi_za_filmove(idovi).then((termini_za_filmove)=>{//ova funkcija iz baze povlaci sve termine za filmove koji se trenutno prikazuju
       res.render('filmovi/trenutni_filmovi',{trenutni_filmovi,termini_za_filmove})//prolsledjuje listu filmova koji se trenutno prikazuju i termine za te filmove view-u
    })
   })
})
module.exports=router;