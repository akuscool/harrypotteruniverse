import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import PASS_DETAILS from '@salesforce/messageChannel/passselecteddetails__c';
import NO_IMAGE from '@salesforce/resourceUrl/no_image';

export default class CharacterDetails extends LightningElement {
    Id = "default";
    subscription = null;
    svgUrl = `${NO_IMAGE}#no_image`;
    //recordId;
    name = "";
    alternate_names = "";
    species;
    gender;
    house;
    dateOfBirth;
    yearOfBirth;
    wizard;
    ancestry;
    eyeColour;
    hairColour;
    wand_wood;
    wand_core;
    wand_length;
    patronus;
    hogwartsStudent;
    actor;
    image_url;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            PASS_DETAILS,
            (message) => this.handleMessage(message)
        );
    }

    async handleMessage(message) {
        this.Id = message.recordId;
        const response = await fetch(`https://hp-api.onrender.com/api/character/${this.Id}`);
        const respjson = await response.json();
        try {
            for (const item of respjson) {
                this.name = item.name;
                this.alternate_names = item.alternate_names ? item.alternate_names : "None";
                this.image_url = item.image;
                this.species = item.species ? item.species : "Not Available";
                this.gender = item.gender ? item.gender : "Not Available";
                this.house = item.house ? item.house : "Not Available";
                this.dateOfBirth = item.dateOfBirth ? item.dateOfBirth : "Not Available";
                this.yearOfBirth = item.yearOfBirth ? item.yearOfBirth : "Not Available";
                this.wizard = item.wizard ? item.wizard : "Not Available";
                this.ancestry = item.ancestry ? item.ancestry : "Not Available";
                this.eyeColour = item.eyeColour ? item.eyeColour : "Not Available";
                this.hairColour = item.hairColour ? item.hairColour : "Not Available";
                this.patronus = item.patronus ? item.patronus : "Not Available";
                this.hogwartsStudent = item.hogwartsStudent? "Yes": "No";
                this.actor = item.actor ? item.actor : "Not Available";
                if (item.wand) {   //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/is_not_iterable
                    for (const key of Object.keys(item.wand))    //destructuring syntax javasscript
                    {
                        if (key == 'wood') { this.wand_wood = item.wand[key] ? item.wand[key] : "Not Available"; }
                        if (key == 'core') { this.wand_core = item.wand[key] ? item.wand[key] : "Not Available"; }
                        if (key == 'length') { this.wand_length = item.wand[key] ? item.wand[key] : "Not Available"; }
                    }
                }

            }


        }
        catch (err) {
            console.log(err.message);
        }

    }
}