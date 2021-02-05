const express=require('express');
const router=express.Router();
const korisnici=require('../zahtevi/korisnici')
const filmovi=require('../zahtevi/filmovi')
const sale=require('../zahtevi/sale')
const termini=require('../zahtevi/termini')
const rezervacija=require('../zahtevi/rezervacija')
router.get('/dodaj',(req,res)=>//za dodavanje sale prikaz forme
{
    if(req.session.tip_naloga!='admin')//samo admin moze da doda salu
        res.render('stranice/zabranjeno')
    else
        res.render('sale/dodavanje_sale')
})
router.post('/dodaj',(req,res)=>//POST request za dodavanje sale
{
    if(req.session.tip_naloga!='admin')//samo admin moze da doda salu zbog toga vrsimo ovu proveru
        res.render('stranice/zabranjeno')
    else
    {//morali smo i prilikom post requesta da vrsimo proveru da li je ulogovani korisnik admin zato sto haker moze da napravi lazan post request ako zna rutu
        sale.dodaj(req.body.naziv,req.body.broj_redova,req.body.broj_mesta_u_redu).then((result)=>
        {
            res.render('sale/dodavanje_sale',{uspesno:'Uspesno ste se dodali novu bioskopsku salu'})
        })
    }
})
module.exports=router;