import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from 'src/app/modules/@core/services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
    items!: MenuItem[];
    username:string='';

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private readonly authService: AuthService
    ) {}
    ngOnInit(): void {
        this.username=this.authService.getUsername();
        this.items = [
            // {
            //      label:'Username: '+this.username,
            //      icon:'pi pi-user'
                 

            // },
           {
                   label:'Logout',
                   icon:'pi pi-sign-out',
                   command:()=>{
                        console.log('Logout')
                        this.authService.signingOut();
                   }
           }


        ];
    }
}
