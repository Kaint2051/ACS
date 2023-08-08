import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { Manual } from 'src/app/modules/user-manual/data-manual/data-manual';
import { DataManual } from 'src/app/modules/user-manual/data-manual/data';
@Component({
    selector: 'user-manual',
    templateUrl: './user-manual.component.html',
    styleUrls: ['./user-manual.component.scss'],
})
export class UserManual implements OnInit {
    manuals!: Manual[];
    constructor(private dataManual: DataManual) {}
    ngOnInit() {
        this.dataManual.getProducts().then((data) => {
            this.manuals = data;
        });
    }
    //test

    downloadManual(manual: Manual) {
        window.open(manual.download, '_blank');
    }
}
