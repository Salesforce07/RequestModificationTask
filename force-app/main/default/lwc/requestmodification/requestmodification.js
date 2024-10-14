import { LightningElement, wire, api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getTimeSheetEntries from '@salesforce/apex/RequestModficationController.getTimeSheetEntries';
import saveRequestModification from '@salesforce/apex/RequestModficationController.saveRequestModification';


export default class Requestmodification extends LightningElement {

    recordId;
    
    connectedCallback(){
        const quer= window.location.search;
        const urlParama= new URLSearchParams(quer);
        this.recordId= urlParama.get('recordId');
        console.log('this is record id', this.recordId);
    }

    show= true;
    // selected enteries list to show in modification box (list to enteries selected by user to enter modification)
    @track selectedEnteriesList=[];

    // entry object, clicked by user from combo box
    selectedEntry;

    projectId='';



    filter={
        criteria:[
            {
                fieldPath:'Project__c',
                operator:'eq',
                value: this.projectId
            }
        ],
    };
    
    // boolearn to show combo and modification box
    showCombobox;
    showModificationBox=false;

     // auto id for empty entry
     autoId=0;
   

     //search key
     searchkey;
     inputKey='';

    // disable add button before user select any entry
    disableAddButton=true;   

    timeSheetEnteries;

    @wire(getTimeSheetEntries)
    wiredTimeSheetEntries({ error, data }) {
        if (data) {
            this.timeSheetEnteries= data;
            this.searchkey= data;
            console.log('this is timesheet enteries', JSON.stringify(this.timeSheetEnteries))
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error retrieving timesheet enteries',
                    message: error.message,
                    variant: 'error'
                })
            );
        }
    }


    renderedCallback(){
        // check if selectedEnteries are empty than hide modification box
        if(this.selectedEnteriesList.length === 0){
            this.showModificationBox= false;
        }
    }

    showComboboxOnFocus(){
        this.showCombobox= true;
    }

    hideSearch(){
        this.showCombobox= false;
    }

    handleSearch(event){
       this.inputKey= event.currentTarget.value;
       console.log('this is timesheet', JSON.stringify(this.timeSheetEnteries))
       console.log('this is search key', JSON.stringify(this.searchkey))
       this.searched= this.searchkey.filter(entry=>(entry.notes.toLowerCase().includes(event.currentTarget.value.toLowerCase()) || entry.id.includes(''+event.currentTarget.value)));
        this.showCombobox=true;
    }

    handleClickedEntry(event){
        // get selected entry object
        this.selectedEntry = this.timeSheetEnteries.find(entry=> entry.id === event.currentTarget.dataset.id);
        this.showCombobox=false;
        this.disableAddButton= false;
        this.inputKey= '';
    }

    handleAddEntry(){
        this.selectedEnteriesList= [...this.selectedEnteriesList, this.selectedEntry];
        
        // remove clicked entry from searchKey
        this.searchkey= this.searchkey.filter(entry=> entry.id !== this.selectedEntry.id);
        this.selectedEntry=null;
        this.showModificationBox= true;
        this.disableAddButton= true;
    }

    handleRemoveClickedEntry(event){
      this.selectedEntry= null;
      
    
      // get removed modification entry object
      let entryToAdd= this.selectedEnteriesList.find(entry=> entry.id == event.currentTarget.dataset.id);
      
      // add to searchkey again, if it's not new entry
      if(this.timeSheetEnteries.find(entry=> entry.id == entryToAdd.id)){
      this.searchkey= [...this.searchkey, entryToAdd];
      }

      // remove that entry from selected enteries list
      this.selectedEnteriesList= this.selectedEnteriesList.filter(entry=> entry.id !== entryToAdd.id);
    }

    handleRemoveEntry(){
        this.selectedEntry= null;
    }

    handleNewEntry(){
        console.log('this is slected entry length', this.selectedEnteriesList.length)
        let hasNoNullValue= true;
        if(this.selectedEnteriesList.length>0){
          this.selectedEnteriesList.forEach(entry=>{
              console.log('this is entry', JSON.stringify(entry))
            if(entry.notes=='' || entry.date1=='' || entry.project=='' || entry.hours==''){
                hasNoNullValue= false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Please enter all required fields',
                        variant: 'error'
                    })
                );
            }
          })
        }
        if(hasNoNullValue){
        
            this.autoId= this.autoId+1;
            let emptyEntry={
                id: this.autoId,
                notes: '',
                date1: '',
                project: '',
                hours: '',
                module: ''
            }
            this.selectedEnteriesList= [...this.selectedEnteriesList, emptyEntry];
            // entering to modification entry
            this.showModificationBox= true;
        
    }
}

    // handle modification enteries input change
    handleModificationChange(event){
        
        switch(event.currentTarget.name){
            case 'notes':
                const tempList= this.selectedEnteriesList.map(entry=>{
                    if(entry.id == event.currentTarget.dataset.id){
                        return entry= {...entry, notes: event.target.value}
                    }
                    else{return entry;}
                });
               
                this.selectedEnteriesList= [...tempList];
               break;
               
            case 'date':
                 const tempList1= this.selectedEnteriesList.map(entry=>{
                    if(entry.id == event.currentTarget.dataset.id){
                        return entry= {...entry, date1: event.target.value}
                    }
                    else{
                        return entry;
                    }
                });
                
                this.selectedEnteriesList= [...tempList1];
               
                break;

            case 'project': 
            console.log('project selected');
            const tempList2= this.selectedEnteriesList.map(entry=>{
                console.log('entry', entry)
                if(entry.id == event.currentTarget.dataset.id){
                    console.log('this is project id getting', event.detail.recordId)
                    console.log('this is project id bfore', this.projectId)
                    this.projectId= event.detail.recordId;
                    console.log('this is projectId after', this.projectId)
                    return entry= {...entry, project: event.detail.recordId}
                }
                else{
                    return entry;
                }
            });
            console.log('this is temp list', JSON.stringify(tempList2));
            this.selectedEnteriesList= [...tempList2];
            console.log('new change', JSON.stringify(this.selectedEnteriesList));
            break;

            case 'module':
            console.log('module selected');
            const tempList3= this.selectedEnteriesList.map(entry=>{
                console.log('entry', JSON.stringify(entry))
                if(entry.id == event.currentTarget.dataset.id){
                    console.log('this is id getting', event.detail.recordId)
                    return entry= {...entry, module: event.detail.recordId}
                }
                else{
                    return entry;
                }
            });
            console.log('this is temp list', JSON.stringify(tempList2));
            this.selectedEnteriesList= [...tempList3];
            console.log('new change', JSON.stringify(this.selectedEnteriesList));
            break;
            
            case 'hours':
                this.selectedEnteriesList.forEach(entry=>{
                    if(entry.id == event.currentTarget.dataset.id){
                        entry.hours= event.target.value;
                    }
                });
                break;
            case 'modificationDescription':
                // if modification entry description then add this property to entry
                this.selectedEnteriesList= this.selectedEnteriesList.map(entry=>{
                    if(entry.id == event.currentTarget.dataset.id){
                    return entry= {...entry, modificationDescription: event.target.value}
                    }
                    else{
                        return entry
                    }
                });
                break;
        }

        console.log('this is selected after change', JSON.stringify(this.selectedEnteriesList));
    }

    // handle modification save
    handleModificationSave(){
        let hasNoNullValue= true;
        this.selectedEnteriesList.forEach(entry=>{
          if(entry.notes=='' || entry.date1=='' || entry.project=='' || entry.hours==''){
              hasNoNullValue= false;
              this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'Error',
                      message: 'Please enter all required fields',
                      variant: 'error'
                  })
              );
          }
        })
        if(hasNoNullValue){
            console.log('to save', JSON.stringify(this.selectedEnteriesList))
            saveRequestModification({modifications: this.selectedEnteriesList, recordId: this.recordId})
            .then(result => {
                console.log('result', JSON.stringify(result));
            }).catch(error=>console.log('this is error', error))

            this.selectedEnteriesList= [];
            this.showModificationBox= false;
            this.searchkey= this.timeSheetEnteries;
        }
    }
      
}