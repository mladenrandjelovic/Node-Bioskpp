const express=require('express');
const router=express.Router();
const korisnici=require('../zahtevi/korisnici')
const filmovi=require('../zahtevi/filmovi')
const sale=require('../zahtevi/sale')
const termini=require('../zahtevi/termini')
const rezervacija=require('../zahtevi/rezervacija')
router.get('/',(req,res)=>//pocetna stranica
{
    res.redirect('/filmovi/trenutni');//pocetna stranica nam je stranica filmovima koji su na repertoaru
})
router.get('/onama',(req,res)=>
{
    res.render('stranice/o_nama');//stranica sa informacijama o bisokopu
})
router.get('/kontakt',(req,res)=>
{
    res.render('stranice/kontakt');//stranica sa kontakt informacijama
})

module.exports=router;