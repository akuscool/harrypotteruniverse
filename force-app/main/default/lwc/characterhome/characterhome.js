import { LightningElement, track, wire } from 'lwc';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import PASS_DETAILS from '@salesforce/messageChannel/passselecteddetails__c';

const actions = [
    {label: 'Details', name: 'details'}
];
const columns = [
        
    { label: 'Name', fieldName: 'name' },
    { label: 'Species', fieldName: 'species', type: 'text' },
    { label: 'House', fieldName: 'house', type: 'text' },
    { label: 'Ancestry', fieldName: 'ancestry', type: 'text' },
    {
        type:'action',
        typeAttributes: {rowActions: actions }
    }
];
export default class Characterhome extends LightningElement {

    queryterm=undefined;
    @track hpdataset = [];
    @track columns = columns;
    @wire(MessageContext)
    messageContext;
    
    
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
            ho=data.house? data.house : "Not Available";
            sp=data.species? data.species : "Not Available";
            ancestry = data.ancestry? data.ancestry : "Not Available";
            var a =                                     //creating a json so that it matches with the column fields above
                {
                    "name":nm,
                    "species":sp,
                    "house":ho,
                    "ancestry":ancestry,
                    "Id":id
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
    handleClick(event){
        const payload = { recordId: event.detail.row.Id };
        publish(this.messageContext, PASS_DETAILS, payload);
    }
    

}