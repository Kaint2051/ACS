import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { AuthRequest } from 'src/app/modules/@core/api-services/auth/request-models/auth.request';
import { AuthApiService } from 'src/app/modules/@core/api-services/auth/auth.api-service';
import { StorageService } from 'src/app/modules/@core/services/storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly jwtStorageKey = 'jwt';
    public readonly jwt$ = new BehaviorSubject<string>('');
    public readonly isAuthenticated$ = this.jwt$.asObservable().pipe(
        distinctUntilChanged(),
        map((token) => !!token)
    );

    constructor(
        private readonly storageService: StorageService,
        private readonly tokenApiService: AuthApiService
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
                this.jwt$.next(authRes.jwt);
            })
        );
    }

    signOut() {
        this.tokenApiService.signOut$().subscribe(() => {
            this.storageService.remove(this.jwtStorageKey);
            this.jwt$.next('');
        });
    }
}
