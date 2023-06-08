import { LightningElement, track } from 'lwc';


export default class Characterhome extends LightningElement {

    queryterm=undefined;
    @track hpdataset = [];
    @track columns = [
        
        { label: 'Name', fieldName: 'name' },
        { label: 'Species', fieldName: 'species', type: 'text' },
        { label: 'House', fieldName: 'house', type: 'text' },
        { label: 'Ancestry', fieldName: 'ancestry', type: 'text' }
    ];
    
    connectedCallback(){
        this.getCharacters();
       
    }
    async getCharacters(){ //an async function can have await keyword inside it
        const response = await fetch("https://hp-api.onrender.com/api/characters"); //await basically holds the execution to this line and only goes on the next once this line is executed
        const dataSet = await response.json(); //format conversion
        const hpMap = new Map();
        for (const data of dataSet) { //iterate over the web call response
            var nm, sp, ho, ancestry, id;
            id=data.id;
            nm=data.name;
            ho=data.house;
            sp=data.species;
            ancestry = data.ancestry;
            var a =                                     //creating a json so that it matches with the column fields above
                {
                    "name":nm,
                    "species":sp,
                    "house":ho,
                    "ancestry":ancestry,
                    "id":id
        };
        
        hpMap.set(id,a); //creating a map
           //this.hpdataset.push(a);
        }
        this.hpdataset = Array.from(hpMap.values()); //creating an array from values of a map
    }
    handleSearch(event){
        const isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            this.queryterm = event.target.value;
            this.makeCall();
            
        }
    }
    showList(){
        return true;
    }
    makeCall(){
        //console.log('calling out for -->'+ this.queryterm);
    }

}