import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    Subscription,
    catchError,
    filter,
    first,
    fromEvent,
    map,
    of,
    takeUntil,
    tap,
    withLatestFrom,
} from 'rxjs';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { AuthService } from 'src/app/modules/@core/services/auth.service';
import { UnsubscriberService } from 'src/app/modules/@shared/services/unsubscriber.service';
import { AuthRequest } from 'src/app/modules/@core/api-services/auth/request-models/auth.request';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastSeverities } from 'src/app/modules/@shared/enums/toast-severities.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from 'src/app/modules/@core/services/config.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
    providers: [UnsubscriberService, MessageService],
})
export class LogoutComponent implements OnInit, OnDestroy {
    urlSafe?: SafeResourceUrl;
    subscriptions: Subscription[] = [];

    constructor(
        public readonly layoutService: LayoutService,
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly unsubscriber: UnsubscriberService,
        private readonly messageService: MessageService,
        private readonly sanitizer: DomSanitizer,
        private readonly configService: ConfigService
    ) {}

    ngOnInit(): void {
        this.subscriptions = [
            this.configService.adminConfig$.subscribe((config) => {
                const hasValidUrl = !!config.data.dashboardLink;
                if (!hasValidUrl) {
                    this.authService.signOut();
                    return;
                }
                this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
                    config.data.dashboardLink + '?logout=true'
                );
            }),
            fromEvent(window, 'message')
                .pipe(
                    filter((e: any) => !!e.data?.startsWith),
                    map((e: any) => e.data),
                    filter((url: string) => url.includes('/#!/login')),
                    first()
                )
                .subscribe((url) => {
                    this.authService.signOut();
                }),
        ];
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
