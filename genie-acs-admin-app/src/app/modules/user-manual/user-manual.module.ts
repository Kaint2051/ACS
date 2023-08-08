// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SharedModule } from 'src/app/modules/@shared/shared.module';
// import { RouterModule } from '@angular/router';
//  import { UserManual } from 'src/app/modules/user-manual/user-manual.component';

// @NgModule({
//     imports: [CommonModule, SharedModule, RouterModule],
// })
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/modules/@shared/shared.module';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DialogService } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserManual } from 'src/app/modules/user-manual/user-manual.component';
import { DataManual } from 'src/app/modules/user-manual/data-manual/data';

import { HttpClientModule } from '@angular/common/http';
@NgModule({
    declarations: [UserManual],
    providers: [DataManual],
    imports: [
        RouterModule.forChild([
            {
                path: ':id',
                component: UserManual,
            },
            {
                path: '',
                component: UserManual,
            },
        ]),
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        SharedModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        TableModule,
        ConfirmDialogModule,
    ],
})
export class UserManualModule {}
