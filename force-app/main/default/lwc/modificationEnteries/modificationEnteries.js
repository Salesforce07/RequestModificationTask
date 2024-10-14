import { LightningElement } from 'lwc';

export default class ModificationEnteries extends LightningElement {
    modificationEnteries= [
            {
                Id: '11',
                notes: 'Created lwc',
                date1: '2021-01-01',
                project: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                module: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                hours: '2'
            },
            {
                Id: '22',
                notes: 'worked on a b',
                date1: '2021-01-01',
                project: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                module: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                hours: '3'
            },
            {
                Id: '33',
                notes: 'worked on invoice',
                date1: '2021-01-01',
                project: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                module: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                hours: '4'
            }
        ]
    newEnteries=  [
        {
            Id: '11',
            notes: 'Created lwc',
            date1: '2021-01-01',
            project: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            module: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            hours: '2'
        },
        {
            Id: '22',
            notes: 'worked on a b',
            date1: '2021-01-01',
            project: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            module: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            hours: '3'
        },
        {
            Id: '33',
            notes: 'worked on invoice',
            date1: '2021-01-01',
            project: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            module: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            hours: '4'
        }
    ]
}