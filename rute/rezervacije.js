const express=require('express');
const router=express.Router();
const korisnici=require('../zahtevi/korisnici')
const filmovi=require('../zahtevi/filmovi')
const sale=require('../zahtevi/sale')
const termini=require('../zahtevi/termini')
const rezervacija=require('../zahtevi/rezervacija')
router.get('/moje',(req,res)=>//ova ruta prikazuje listu rezervacija za odredjenog korisnika
{
    if(typeof req.session.korisnik_id=='undefined')//ako je korisnik_id undefined to znaci da korisnik nije ulogovan
    res.render('stranice/zabranjeno')//prikazujemo mu stranicu da nema pristup
    else
    {// u slucaju da je ulogovan
        rezervacija.prikazi_za_korisnika(req.session.korisnik_id).then((rezervacije)=>//ucitava sve rezervacije koje je napravio odredjeni korisnik
        {//kada baza vrati podatke serveru onda se izvrsava ovaj deo koda
            res.render('rezervacije/lista_rezervacija',{rezervacije});//prikazuje korisniku sve njegove rezervacije koje se view-u prosledjuju kao parametar
        })
    }

})
router.post('/obrisi/:rezervacija_id',(req,res)=>//ova ruta sluzi za  za brisanje rezervacija
{
    if(typeof req.session.korisnik_id=='undefined')//ako korisnik nije ulogovan
    res.render('stranice/zabranjeno')//prikazuje se stranica da nema pristup tom delu sajta
    else if(req.session.tip_naloga=='obican')//ako je korisnik obican(nije admin)
    {
        rezervacija.obrisi_za_korisnika(req.session.korisnik_id,req.params.rezervacija_id).then((rezultat)=>//poziva se funkcija koja ce obrisati rezervaciju iz baze
        {//kao parametar joj se pored id-ja rezervacije prosledjuje i id korisnika kako bi se sprecilo da korisnik obrise rezervaciju koja nije njegova
            req.session.tip_poruke="uspesno";//u sesiji pamtimo da je korisnik uspesno obrisao rezervaciju tip poruke sluzi da poruku uokvirimo u zelen,zut ili crveni okvir zavisno od tipa
            req.session.sadrzaj_poruke="Uspešno ste obrisali rezervaciju."//poruka koja ce se prikazati korisniku posle brisanja rezervacije
            res.redirect('/rezervacije/moje');//korisnik se preusmerava na stranicu sa svojim rezervacijama
        })
    }
    else
    {
        rezervacija.nadji(req.params.rezervacija_id).then((rezervacija_info)=>//potrebni su nam podaci o rezervaciji pre njenog brisanja zbog toga trazimo tu rezervaciju iz baze
        {
            rezervacija_info=rezervacija_info[0];//zato sto vraca niz,a zapravo ce uvek vratiti samo jedan element posto trazimo po id-ju rezervacije a to je PRIMARY KEY u bazi
            rezervacija.admin_obrisi(req.params.rezervacija_id).then((rezultat)=>//vrsimo brisanje rezervacije funkcija je admin_obrisi posto admin moze da brise bilo koju rezervaciju,a ne kao obican korisnik koji moze samo svoje
            {
                req.session.tip_poruke="uspesno";//tip poruke uspesno oznacava da poruka treba da bude u zelenom okviru(upozoranje-zuti greska-crveni)
                req.session.sadrzaj_poruke="Uspešno ste obrisali rezervaciju."//poruka koja ce se ispisati korisniku posle preusmeravanja
                res.redirect('/rezervacije/termin/'+rezervacija_info.termin_id);//preusmaravamo admina na rutu posto admin brise rezervacije sa rute rezervacije/termin
                //koja kao paramtar prima termin_id mi smo zbog toga morali da ucitamo informacije o rezervaciji pre brisanja,kako bi smo znali gde treba da preusmerimo korisnika
            })
        })
 
    }
}

)
router.get('/:rezervacija_id',(req,res)=>//ova ruta nam sluzi za prikaz dodatih informacija o rezervaciji
{
    if(typeof req.session.korisnik_id=='undefined')//proverava da li je korisnik ulogovan
        res.render('stranice/zabranjeno')
    else if(req.session.tip_naloga=='obican')//proverava da li je korisnik obican
    {
        rezervacija.prikazi(req.params.rezervacija_id,req.session.korisnik_id).then((rezervacija_info)=>//prosledjuje pored id rezervacije i id korisnika kako bi smo sprecili da korisnik vidi informacije o rezervaciji drugog korisnika
        {
            if(rezervacija_info.length==0)//ako je duzina niza 0 to znaci da iz baze nije vracena nijedna rezervacija
                res.render('stranice/zabranjeno')
            else
            {
                rezervacija.prikazi_mesta(req.params.rezervacija_id).then((rezervisana_mesta)=>//povlacimo iz baze sva mesta koja su rezervisana u odredjenoj rezervaciji
                {
                    rezervacija_info=rezervacija_info[0];//posto je to niz koji ima samo jedan element onda ka pretvaramo u obicnu promenjivu
                    res.render('rezervacije/rezervacija_info',{rezervacija_info,rezervisana_mesta});//prikazujemo korisniku informacije o rezervaciji i mesta koja su rezervisana za nju
                })
            }

            //res.render('stranice/lista_rezervacija',{rezervacija});
        })
    }
    else//ako je korisnik ulogovan,a pritom nije obican to znaci da je admin
    {
        rezervacija.admin_prikazi(req.params.rezervacija_id).then((rezervacija_info)=>//admin ima pristup informacijama o svakoj rezervaciji,zato smo morali posebnu funkciju da pravimo za njega posto funkcija za prikaz informacija o rezervaciji kao parametar prima id korisnika i ona nalazi rezervaciju samo ako pripada tom korisniku
        {
            if(rezervacija_info.length==0)//ako je duzina 0 znaci da rezervacija sa tim idijem ne postoji
                res.render('stranice/nepostoji')//prikazujemo da stranica ne postoji tj. da ta rezervacija ne postoji
            else
            {
                rezervacija.prikazi_mesta(req.params.rezervacija_id).then((rezervisana_mesta)=>//ako rezervacija postoji mi trazimo i sva mesta koja su rezervisana tom rezervacijom
                {
                    rezervacija_info=rezervacija_info[0];//posto je rezervacija sa odredjnim idijem jedna jedina onda niz pretvaramo u obicnu promenjivu
                    res.render('rezervacije/rezervacija_info',{rezervacija_info,rezervisana_mesta});//prikazujemo informacije o rezervaciji korisniku
                })
            }

            //res.render('stranice/lista_rezervacija',{rezervacija});
        })
    }
})
router.get('/dodaj/:termin_id',(req,res)=>//ova ruta sluzi za dodavanje nove rezervacije za odredjeni termin
{
    if(typeof req.session.korisnik_id=='undefined')//proverava da li je korisnik ulogovan,posto neulogovan korisnik ne moze da izvrsi rezervaciju
        res.render('stranice/zabranjeno')
    else
    {
        termini.prikazi_sa_filmom_i_salom(req.params.termin_id).then((termin_info)=>{//povlacimo informacije o terminu za oredjeni film sa informacijama 
            //o tom filmu i informacijama o sali u kojoj se film u izabranom terminu prikazuje
            rezervacija.prikazi_rezervisana_mesta(req.params.termin_id).then((rezervisana_mesta)=>//prikazuje sva mesta koja su rezervisana u odredjenom terminu
            {//to nam je potrebno kako bi se korisniku prikazala rezervisana mesta kako on ne bi mogao ista da rezervise
                termin_info=termin_info[0];//posto ga vraca kao niz,a taj niz ima samo jedan element da ne bi smo pristupali u pug-u kao niz onda radimo ovo 
                res.render('rezervacije/rezervacija_mesta',{termin_info,rezervisana_mesta});//prikazujemo stranu za rezervaciju sa zauzetim mestima i informacijama o izabranom terminu
            })

            // res.render('trenutni_filmovi',{trenutni_filmovi,termini_za_filmove})
        })
    }
})
router.post('/dodaj/:termin_id',(req,res)=>//sluzi za dodavanje rezervacije za odrejdeni termin
{
    var req_sedista=req.body.sediste;//radi lakseg koriscnjena promenjive mi je smestamo u novu promenjivu(kraci naziv nema req.body)
    if(!Array.isArray(req_sedista))//ako korisnik rezervise samo jedno sediste POST metod nam ne vraca niz vec samo jedan element
    {//posto mi dole imamo for petlju koja prolazi kroz svaki element niza mi tu promenjivu moramo da pretvorimo u niz
        //zbog toga vrsimo proveru da li je parametar niz
        req_sedista=new Array(req_sedista);//pretvaramo promenjivu u niz
    }

    var sedista=new Array();//kreiramo novi niz

    for(var i=0;i<req_sedista.length;i++)//prolazimo kroz niz izabranih sedista koje je korisnik izabramo
    {
        var sediste=req_sedista[i];//uzimamo jedno sediste
        var str=sediste.split('x');//sedista u formi imaju value="red x mesto_u_redu" npr 4x3 predstavlja 3. mesto u 4. redu
        //zbog toga vrsimo split tj delimo string kod slova x i onda dobijamo dva stringa str[0]=4 (red) str[1]=3 (mesto u redu)
        sedista.push({red:str[0],mesto:str[1]});//radi preglednosti mi ta sedista smestamo u novi niz
        //svaki element novog niza sadrzi dva elementa(kao matrica br_sedista x 2) prvi element tog asocijativnog niza je red,a drugi element je mesto(mesto u redu)
    }
    var sifra_rezervacije=(1000+Math.floor(Math.random()*8999));//potrebno je kreirati sifru rezervacije koju ce korisnik dati na blagajni prilikom preuzimanja karata
    //ona je random broj zbog toga generisemo radnom broj
    if(typeof req.session.korisnik_id=='undefined')//ako korisnik nije ulogovan onda necemo cuvati rezervaciju u bazi nego cemo ga preusmeriti na stranicu za zabranjeni pristup
    res.render('stranice/zabranjeno')
    else//ako je korisnik ulogovan vrsimo dodavanje rezervacije u bazu
    {
        rezervacija.dodaj(req.session.korisnik_id,req.params.termin_id,sedista,sifra_rezervacije.toString()).then((rezultat)=>
        {//sifra_rezervacije je int,a parametar mora da bude string zbog toga pretravarmao broj u string
            req.session.tip_poruke="uspesno";
            req.session.sadrzaj_poruke="Uspešno ste izvršili rezervaciju."//ispisujemo poruku o uspesnoj rezervaciji
            res.redirect('/filmovi/trenutni');//preusmeravamo korisnika na stranicu sa ternutim filmovima
        }
        );
    }
})
router.get('/termin/:termin_id',(req,res)=>//prikazuje  sve rezervacije za odredjeni termin
{
    if(typeof req.session.korisnik_id!='undefined' && req.session.tip_naloga=='admin')//samo admin ima pristup ovom delu
    {
        termini.prikazi_sa_filmom_i_salom(req.params.termin_id).then((termin)=>//povlacimo dodatne informacije za termin
        {
            termin=termin[0];//zato sto vraca podatke kao niz,a posto je pretraga po primary keyu mi mozemo da imamo samo jedan termin sa odredjenim idijem
            rezervacija.prikazi_za_termin(req.params.termin_id).then((rezervacije)=>//povlaci sve rezervacije za odredjeni termin
            {
                //console.log(rezervacije);
                res.render('rezervacije/rezervacije_za_termin',{rezervacije,termin});//prikazuje listu rezervacija za termin i informacije o terminu
            })
        })
     
    }
    else
    {
        res.render('stranice/zabranjeno');
    }
})
module.exports=router;