import { Component, OnInit } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
    PaginationResponse,
    PaginationResponseBuilder,
} from 'src/app/modules/@core/api-services/share-models/pagination.response';
import { ConfigService } from 'src/app/modules/@core/services/config.service';
import { DeviceSummaryResponse } from 'src/app/modules/@core/api-services/device/response-models/device-summary.response';
import { DeviceApiService } from 'src/app/modules/@core/api-services/device/device.api-service';
import { Router } from '@angular/router';
import { SortByFieldRequest } from 'src/app/modules/@core/api-services/share-models/sort-by-field.request';
import { sortBuilder } from 'src/app/modules/@shared/enums/sort-directions.enum';
import {
    BehaviorSubject,
    catchError,
    concat,
    debounceTime,
    finalize,
    of,
    tap,
} from 'rxjs';
import { get } from 'lodash';
import { ToastSeverities } from 'src/app/modules/@shared/enums/toast-severities.enum';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Component({
    selector: 'app-device-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.scss'],
    providers: [MessageService],
    styles: [
        `
            :host ::ng-deep .p-cell-editing {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
            }
        `,
    ],
})
export class ListingComponent implements OnInit {
    searchTerm = '';
    paginationData: PaginationResponse<DeviceSummaryResponse> =
        PaginationResponseBuilder({ Items: [] });
    private readonly searchTerm$ = new BehaviorSubject<string>('');
    constructor(
        private readonly router: Router,
        private readonly deviceApiService: DeviceApiService,
        private readonly configService: ConfigService,
        private readonly messageService: MessageService,
        private readonly dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.searchTerm$
            .asObservable()
            .pipe(debounceTime(300))
            .subscribe((val) => {
                this.fetchData(val);
            });
    }

    fetchData(
        search: string = '',
        page: number = this.configService.paginationConfig.page,
        take: number = this.configService.paginationConfig.take10,
        sorts: SortByFieldRequest[] = [],
        projectionFields: string[] = []
    ) {
        const filter = search
            ? `Tags.${search} IS NOT NULL OR LOWER(VirtualParameters.PPPoEACName) LIKE "%${search.toLocaleLowerCase()}%"`
            : '';

        this.deviceApiService
            .get$(page, take, filter, sorts, projectionFields)
            .subscribe((data) => {
                this.paginationData = data;
                this.paginationData.Items.forEach((i) => {
                    this.extractTags(i);
                });
            });
    }

    onSearchTermChanged($event: any) {
        console.log('onSearchTermEnter', $event);
        this.searchTerm$.next($event.target.value);
    }

    onRowEdit(item: DeviceSummaryResponse) {
        this.router.navigate([`/devices/${item['DeviceID.ID'].value[0]}`]);
    }

    onRawDetailClicked(item: DeviceSummaryResponse) {
        this.router.navigate([`/devices/${item['DeviceID.ID'].value[0]}/raw`]);
    }

    nextPage(event: any) {
        console.log('nextPage', event);
        const sorts = sortBuilder(event.multiSortMeta);
        const page = event.first / event.rows;
        this.fetchData(this.searchTerm, page, event.rows, sorts);
    }

    getStatusColor(item: DeviceSummaryResponse) {
        const lastInform = item['Events.Inform']?.value[0] || 0;
        const delta = Date.now() - lastInform;
        return (delta < 300000 && '#22c55e') || '#ff0000';
    }

    onExportBtnClicked() {
        const totalCount = this.paginationData.Total;
        const batchSize = 100;
        const batchCount = Math.ceil(totalCount / batchSize);
        const batchSizes = Array.from(
            { length: batchCount },
            (_, i) => batchSize
        );
        const devices: any[] = [];
        concat(
            ...batchSizes.map((pageSize, pageIndex) => {
                return this.deviceApiService.get$(pageIndex, pageSize, '');
            })
        )
            .pipe(
                tap((result) => {
                    devices.push(
                        ...result.Items.map((d: any) => ({
                            SerialNumber: this.getValue(
                                d['DeviceID.ProductClass'],
                                'value[0]',
                                ''
                            ),
                            ProductClass: this.getValue(
                                d['DeviceID.ProductClass'],
                                'value[0]',
                                ''
                            ),
                            SoftwareVersion: this.getValue(
                                d['VirtualParameters.SoftwareVersion'],
                                'value[0]',
                                ''
                            ),
                            IPV4Address: this.getValue(
                                d['VirtualParameters.IPV4Address'],
                                'value[0]',
                                ''
                            ),
                            OUI: this.getValue(
                                d['VirtualParameters.OUI'],
                                'value[0]',
                                ''
                            ),
                            SSID24G: this.getValue(
                                d['VirtualParameters.SSID24G'],
                                'value[0]',
                                ''
                            ),
                            SSID5G: this.getValue(
                                d['VirtualParameters.SSID5G'],
                                'value[0]',
                                ''
                            ),
                            PPPoEACName: this.getValue(
                                d['VirtualParameters.PPPoEACName'],
                                'value[0]',
                                ''
                            ),
                            Inform: this.getValue(
                                d['Events.Inform'],
                                'value[0]',
                                ''
                            ),
                            TagValues: this.getValue(
                                d['TagValues'],
                                'value[0]',
                                ''
                            ).replace(/,/g, ';'),
                        }))
                    );
                }),
                catchError((e) => {
                    this.messageService.add({
                        severity: ToastSeverities.Error,
                        summary: `Export Failed!`,
                    });
                    return of();
                }),
                finalize(() => {
                    console.log(devices);
                    const options = {
                        headers: [
                            'SerialNumber',
                            'ProductClass',
                            'SoftwareVersion',
                            'IPV4Address',
                            'OUI',
                            'SSID24G',
                            'VirtuaParameters.SSID5G',
                            'PPPoEACName',
                            'Inform',
                            'Tags',
                        ],
                    };
                    setTimeout(() => {
                        new AngularCsv(
                            devices,
                            'devices-' + Date.now(),
                            options
                        );
                    }, 500);
                    this.messageService.add({
                        severity: ToastSeverities.Success,
                        summary: `Export successfully!`,
                    });
                })
            )
            .subscribe();
    }

    getValue = get;

    private extractTags(device: DeviceSummaryResponse) {
        const tagValues = device.TagValues?.value[0] || '';
        device.TagPlainValues = tagValues.length ? tagValues.split(',') : [];
    }
}
