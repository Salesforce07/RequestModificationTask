public with sharing class RequestModficationController {
    
    @AuraEnabled(cacheable=true)
    public static List<TimesheetWrapper> getTimeSheetEntries(){
            List<TimesheetWrapper> timesheetWrapperList = new List <TimesheetWrapper>();
            for(TimeSheet_Entry__c timeSheetEntry: [SELECT Id, Date__c, Notes__c, Projects__c, Hours__c, Modules__c FROM TimeSheet_Entry__c Where Date__c= YESTERDAY]){
                TimesheetWrapper timesheetWrapper = new TimesheetWrapper();
                timesheetWrapper.Id = timeSheetEntry.Id;
                timesheetWrapper.date1 = timeSheetEntry.Date__c;
                timesheetWrapper.notes = timeSheetEntry.Notes__c;
                timesheetWrapper.project = timeSheetEntry.Projects__c;
                timesheetWrapper.module = timeSheetEntry.Modules__c;
                timesheetWrapper.hours = timeSheetEntry.Hours__c;
                timesheetWrapperList.add(timesheetWrapper);
            }
            return timesheetWrapperList;
    }
    

    // wrapper class for list of timesheet entries
    public class TimesheetWrapper{
      @AuraEnabled  public String id;
      @AuraEnabled  public String notes;
      @AuraEnabled  public Date date1;
      @AuraEnabled  public String project;
      @AuraEnabled  public String module;
      @AuraEnabled  public Decimal hours;
    }

    @AuraEnabled
    public static List<Request_Modification_Entery__c> saveRequestModification(List<Map<String, String>> modifications, String recordId){
        try {
           
            Id RequestModificationId;
            // check if request modification ticket is already present for that timesheet
            List <Request_Modification_Ticket__c> rmt= [SELECT id from Request_Modification_Ticket__c where Time_Sheet__r.Id = : recordId];
            if(rmt.size()==0){
                // create new request modification and get it id
                 Request_Modification_Ticket__c rmtInserted= new Request_Modification_Ticket__c(Time_Sheet__c= recordId);
                 insert rmtInserted;
                  RequestModificationId= rmtInserted.Id;   
            }
            else{
                    RequestModificationId= rmt[0].Id;
            }

            List<Request_Modification_Entery__c> requestModificationList= new List<Request_Modification_Entery__c>();
            for(Map<String, String> modification: modifications){
                Request_Modification_Entery__c requestModification = new Request_Modification_Entery__c();
                if(modification.get('id').length()>14){
                    System.debug('thi is under if'+ modification.get('id'));
                    requestModification.Timesheet_Entry__c= modification.get('id');
            }

                requestModification.Date__c= Date.valueOf(modification.get('date1'));
                requestModification.Notes__c= modification.get('notes');
                requestModification.Project__c= modification.get('project');
                requestModification.Module__c= modification.get('module');
                requestModification.Hours__c= Decimal.valueOf(modification.get('hours'));
                requestModification.Request_Modification_Ticket__c= RequestModificationId;
                if(modification.get('modificationDescription')!=null){
                    requestModification.Modification_Description__c= modification.get('modificationDescription');
                }
                requestModificationList.add(requestModification);
              
            }
            insert requestModificationList;
            return requestModificationList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}