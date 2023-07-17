import { Component, OnInit } from '@angular/core';
import "youverify-web-sdk";

@Component({
  selector: 'dp-liveness',
  templateUrl: './liveness.component.html',
  styleUrls: ['./liveness.component.css']
})


export class LivenessComponent implements OnInit {

  constructor() {

  }

  ngOnInit(): void {
    //@ts-ignore
    const YVSDK = window.YouverifySDK as any;
    const livenessCheckModule = new YVSDK.liveness({
      publicMerchantKey: `647629fcf552280cb22005b9`,

      // true if environment is in development mode. Default to false    
      dev: false,

      personalInformation: {
        firstName: "John",
      },
      //Customize your form using prefered greeting texts and colours(This is Optional)
      appearance: {
        greeting: 'We will need to perform a liveness test. It will only take a moment.',
        actionText: 'Perform liveness test',
        buttonBackgroundColor: '#46B2C8',
        buttonTextColor: '#fffff',
        primaryColor: '#46B2C8'
      },

      onSuccess: () => {
        // liveness check was successful
      },
      onFailure: () => {
        // liveness check was not successful
      },
      // `onClose` callback is a function called onced the liveness check process modal has been closed
      onClose: () => { // optional
        // custom logic here
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
