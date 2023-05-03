const container: HTMLElement | any = document.getElementById("app")

const URL_DECKELSERVICE = window.location.protocol + '//' + window.location.hostname + ':7013' + '/DeckelService/';
const URL_KRANDECKELSERVICE = window.location.protocol + '//' + window.location.hostname + ':7013' + '/KranDeckelService/';
// const URL_DECKELSERVICE = window.location.protocol + '//int1ans.dillinger.de:7013' + '/DeckelService/';
// const URL_KRANDECKELSERVICE = window.location.protocol + '//int1ans.dillinger.de:7013' + '/KranDeckelService/';


interface Deckelnummer
{
    wert: number;
}

interface Deckelzustand
{
    deckelnummer: number;
    zustand: string;
    ort: string;
    zuVerladen: boolean;

}


async function gibMoeglicheZuEntladeneDeckel()
{
    const data: Response = await fetch(URL_KRANDECKELSERVICE + "gibMoeglicheZuEntladendeDeckel",
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "GET"

        })
    const deckelNummerListe: any = await data.json();

    console.log("deckelNummerListe: " + deckelNummerListe.length);
    const deckelListe = [];
    for (const deckelNummerListeElement of deckelNummerListe)
    {
        // console.log("deckelNummerListeElement: " + deckelNummerListeElement.wert)
        const test: Deckelnummer = {
            wert: deckelNummerListeElement.wert
        };
        deckelListe.push(test);
        zeigeDeckelAn(test);
    }

}

function zeigeDeckelAn(deckelnummer: Deckelnummer): void
{
    const divid : string=    "deckel"+ deckelnummer.wert+ "ChBox";
    const labelid : string =  "Deckel " + deckelnummer.wert;

    // console.log("Divid " + divid)
    let div  = document.createElement('div');
    div.className = "deckel";

    let label = document.createElement('label');
    label.id = labelid;
    label.textContent = labelid;
    div.appendChild(label);

    let chbox = document.createElement('input');
    chbox.type= "checkbox";
    chbox.id = divid;
    // chbox.onclick = function (){
    // console.log("Entladen gedrueckt: " + deckelnummer);
    // }
    chbox.onclick = ()=>entladeDeckel("" + deckelnummer.wert);
    div.appendChild(chbox);

    container.appendChild(div);

}



function entladeDeckel(id:string)
{
    console.log("Entladen gedrueckt: " + id);
}

async function gibAlleDeckelnummern()
{
    const data: Response = await fetch(URL_DECKELSERVICE + "gibAlleDeckelnummern",
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "GET"

        })
    const deckelNummerListe: any = await data.json();

    console.log("deckelNummerListe: " + deckelNummerListe.length);
    const deckelListe = [];
    const zuVerladeneDeckel = [];
    const zuEntladeneDeckel = [];
    for (const deckelNummerListeElement of deckelNummerListe)
    {
        // console.log("deckelNummerListeElement: " + deckelNummerListeElement.wert)
        const test: Deckelnummer = {
            wert: deckelNummerListeElement.wert
        };
        deckelListe.push(test);
    }

    for (const deckelListeElement of deckelListe)
    {

        const deckelzustand:any =  gibDeckelzustand(deckelListeElement)
        const ds : Deckelzustand = {
          deckelnummer : deckelListeElement.wert,
          zustand : deckelzustand.zustand,
          ort : deckelzustand.ort,
            zuVerladen : deckelzustand.zuVerladen

        };

        console.log("DS: "+ ds.deckelnummer + " " + ds.zustand + " " + ds.ort + " " + ds.zuVerladen);
    }
}



async function gibDeckelzustand(deckelnummer: Deckelnummer)
{
    const data:Response = await fetch(URL_DECKELSERVICE + "gibDeckelzustand",
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(deckelnummer)

        })

    const deckelZustandString: any = data.json();
    console.log("deckelZustandString: " + deckelZustandString.toString())
    const deckelZustand: Deckelzustand = {
        deckelnummer : deckelnummer.wert,
        zustand: deckelZustandString.zustand.wert,
        ort: deckelZustandString.ort,
        zuVerladen: deckelZustandString.zuVerladen,
    };
    console.log("Deckelzustand: Deckelnummer: " + deckelZustand.deckelnummer + ", Zustand: " + deckelZustand.zustand  + " zuVerladen: " + deckelZustand.zuVerladen);


    return deckelZustand;
}


async function setzeIstVerladen(deckelnummer: number)
{
    return fetch(URL_DECKELSERVICE + "setzeIstVerladen",
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(deckelnummer)
        })
    // .then(verarbeiteAntwort)
    // .catch(verarbeiteException);
}
// gibAlleDeckelnummern();
gibMoeglicheZuEntladeneDeckel()

