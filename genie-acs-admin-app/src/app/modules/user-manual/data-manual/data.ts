import { Injectable } from '@angular/core';

@Injectable()
export class DataManual {
    getDataManual() {
        return [
            {
                id: '1',
                name: 'Cách bật TR-069 trên Router Wifi Dasan',
                downloadName: 'Cách bật TR-069 trên Router Wifi Dasan.docx',              
                download:
                    'https://drive.google.com/file/d/1zfzLQgJzMyUJI7PLysl16OlyOIwlXRq7/view?usp=sharing',
            },
            {
                id: '2',
                name: 'Hướng dẫn bật TR-069 trên Router Wifi TP-Link Acher C64',
                downloadName:
                    'Hướng dẫn bật TR-069 trên Router Wifi TP-Link Acher C64.docx',

                download:
                    'https://drive.google.com/file/d/1g-sfjqs5jxqUjCl1mpH0se3i0u4nukgp/view?usp=sharing',
            },
            {
                id: '3',
                name: 'Hướng Dẫn Sử Dụng TEDEVACS Version 2.7',
                downloadName: 'Hướng Dẫn Sử Dụng TEDEVACS Version 2.7.docx',

                download:
                    'https://drive.google.com/file/d/1keRmtJDkmV8Y5SgMpxNLUgnPYHdLGj5t/view?usp=sharing',
            },
            {
                id: '4',
                name: 'Cách bật TR-069 trên Router wifi TP-Link EC-225-G5',
                downloadName: 'Cách bật TR-069 trên Router wifi TP-Link EC-225-G5.docx',

                download:
                    'https://drive.google.com/file/d/1gTpyadYTsrD_d7jpkqo-g9q0NFla_CYV/view?usp=drive_link',
            },
        ];
    }
    getProducts() {
        return Promise.resolve(this.getDataManual());
    }
}
