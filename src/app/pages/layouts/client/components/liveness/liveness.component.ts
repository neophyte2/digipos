import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import "youverify-web-sdk";
import { ClientService } from '../../service/client.service';
import swal from 'sweetalert2';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
  selector: 'dp-liveness',
  templateUrl: './liveness.component.html',
  styleUrls: ['./liveness.component.css']
})


export class LivenessComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private genSrv: GeneralService,
    private clntSrv: ClientService,
  ) { }

  ngOnInit(): void {
    const link = this.route.snapshot.queryParams['token'];
    let pass: boolean = false
    let photoUrl: string = ''
    //@ts-ignore
    const YVSDK = window.YouverifySDK as any;
    const livenessCheckModule = new YVSDK.liveness({
      publicMerchantKey: `647629fcf552280cb22005b9`,

      // true if environment is in development mode. Default to false    
      dev: environment.production,

      //Customize your form using prefered greeting texts and colours(This is Optional)
      appearance: {
        greeting: 'We will need to perform a liveness test. It will only take a moment.',
        actionText: 'Perform liveness test',
        buttonBackgroundColor: '#46B2C8',
        buttonTextColor: '#fffff',
        primaryColor: '#46B2C8'
      },

      onSuccess: (data: any) => {
        // liveness check was successful
        pass = data.passed
        photoUrl = data.photo
      },
      onFailure: (data: any) => {
        // liveness check was not successful
        pass = data.passed
        photoUrl = ''
      },
      // `onClose` callback is a function called onced the liveness check process modal has been closed
      onClose: (data: any) => { // optional
        // custom logic here
        if (pass === true) {
          swal.fire({
            icon: 'info',
            title: 'Saving Picture',
            html: 'Loading ...',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: () => {
              swal.showLoading(swal.getDenyButton());
            }
          })
          let payload = {
            picture: photoUrl
          }
          this.clntSrv.uploadPicture(payload, link).subscribe((data: any) => {
            if (data.responseCode === '00') {
              swal.close()
              window.location.href = 'https://sandbox3.coralpay.com:9091/merchantportal/#/success'
            } else {
              window.location.href = 'https://sandbox3.coralpay.com:9091/merchantportal/#/success'
            }
          })
        } else {
          window.location.href = 'https://sandbox3.coralpay.com:9091/merchantportal/#/error'
        }
      }

    });
    try {
      livenessCheckModule.initialize();
    } catch (error) {
      // handle validation error
    }
    livenessCheckModule.start();
  }

}
