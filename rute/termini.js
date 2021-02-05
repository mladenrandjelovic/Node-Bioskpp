const express=require('express');
const router=express.Router();
const korisnici=require('../zahtevi/korisnici')
const filmovi=require('../zahtevi/filmovi')
const sale=require('../zahtevi/sale')
const termini=require('../zahtevi/termini')
const rezervacija=require('../zahtevi/rezervacija')
// middleware that is specific to this router
router.get('/dodaj/:film_id',(req,res)=>//ruta za dodavanje termina za odredjeni film
{
    if(req.session.tip_naloga!='admin')//provera da li admin
        res.render('stranice/zabranjeno')
    else
    {
        sale.prikazi().then((sale)=>//povlacimo sve bioskopske sale(koristimo ga u dropdown meniju prilkikom biranja sale za odredjeni termin)
        {
            filmovi.nadji(req.params.film_id).then((film)=>//povlacimo informacije iz baze za odredjeni termin
            {
                res.render('termini/dodavanje_termina',{sale,film})
            })
        })
    }
})
router.post('/obrisi/:id',(req,res)=>//sluzi za brisanje odredjenog termina ciji je id prosledjen kao parametar
{
    termini.obrisi(req.params.id).then((rezultat)=>
    {
        req.session.tip_poruke="uspesno";
        req.session.sadrzaj_poruke="Termin uspešno obrisan";//javlja da je termin uspesno obrisan
        res.redirect('/termini/danasnji');
    })
})
router.post('/dodaj/:film_id',(req,res)=>//POST request za dodavanje termina
{
    if(req.session.tip_naloga!='admin')
        res.render('stranice/zabranjeno')
    else
    {
        termini.dodaj(req.body.sala_id,req.params.film_id,req.body.vreme_prikazivanja,req.body.cena_karte).then((result)=>
        {
            sale.prikazi().then((sale)=>//opet povlacimo sve sale zato sto su nam potrebe prilikom ponovog prikaza stranice za dodavanje termina 
            {
                filmovi.nadji(req.params.film_id).then((film)=>
                {
                    res.render('termini/dodavanje_termina',{sale,film,uspesno:'Uspesno ste dodali termin za film.'})//prikazujemo stranicu za dodavanje termina sa porukom u uspesno dodatom terminu
                })
            })
        }
        )
    }
})
router.get('/danasnji',(req,res)=>//sluzi za prikaz danasnjih termina,svrha ove rute je da adminu omoguci laksi pregled rezervacija za filmove koji se danas prikazuju
{
    if(typeof req.session.korisnik_id!='undefined' && req.session.tip_naloga=='admin')
    {
        termini.prikazi_danasnje().then((termini)=>//povlaci danasnje termine iz baze
        {
            res.render('termini/danasnji_termini',{termini});
        })
    }
    else
    {
        res.render('stranice/zabranjeno');
    }
})

module.exports=router;