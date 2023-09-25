import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    distinctUntilChanged,
    filter,
    first,
    fromEvent,
    map,
} from 'rxjs';
import { AuthRequest } from 'src/app/modules/@core/api-services/auth/request-models/auth.request';
import { AuthApiService } from 'src/app/modules/@core/api-services/auth/auth.api-service';
import { StorageService } from 'src/app/modules/@core/services/storage.service';
import { ConfigService } from 'src/app/modules/@core/services/config.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly jwtStorageKey = 'jwt';
    private readonly usernameStorageKey='username';
    public readonly jwt$ = new BehaviorSubject<string>('');
    public readonly isLoggingOut$ = new BehaviorSubject<boolean>(false);
    public readonly isAuthenticated$ = this.jwt$.asObservable().pipe(
        distinctUntilChanged(),
        map((token) => !!token)
    );

    constructor(
        private readonly configService: ConfigService,
        private readonly storageService: StorageService,
        private readonly tokenApiService: AuthApiService,
        private readonly router: Router
    ) {
        this.retrieveAuthInfoFromStorage();
    }

    private retrieveAuthInfoFromStorage() {
        const jwt = this.storageService.retrieve(this.jwtStorageKey);
        this.jwt$.next(jwt);
    }

    signIn$(authReq: AuthRequest) {
        return this.tokenApiService.signIn$(authReq).pipe(
            map((authRes) => {
                this.storageService.store(this.jwtStorageKey, authRes.jwt);
                this.storageService.store(this.usernameStorageKey,authReq.username);
                this.jwt$.next(authRes.jwt);
                console.log('Stored username',authReq.username);
            })
        );
    }
    getUsername():string{
        return this.storageService.retrieve(this.usernameStorageKey);
        }
    signingOut() {
        this.router.navigate(['/auth/logout']);
    }

    signOut() {
        this.tokenApiService.signOut$().subscribe(() => {
            this.storageService.remove(this.jwtStorageKey);
            this.jwt$.next('');
            this.router.navigate(['/auth/login']);
            window.location.reload();
        });
    }
}
