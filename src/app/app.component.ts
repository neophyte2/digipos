import { Component, NgZone, OnInit } from '@angular/core';
import { GeneralService } from './shared/services/general.service';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'digipos';
  signUpLoginView = true;

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = undefined;
  origin = window.location.origin;
  pathname = window.location.pathname;

  constructor(
    private router: Router,
    public gs: GeneralService,
    private idle: Idle,
    private keepalive: Keepalive,
  ) { }

  ngOnInit() {
    let remainingSeconds = 30;


    this.inActivity(remainingSeconds)
  }

  inActivity(remainingSeconds: any) {
    // this.idle.setIdle(1800);
    this.idle.setTimeout(30);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer this.idle.'
      this.reset();
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      console.log(this.idleState);
      this.timedOut = true;
      // document.getElementById('closeTimoutModal').click()
      this.gs.clearStorage()
      this.gs.logout('/')
      this.router.navigate(['/login'], { queryParams: { showTimeoutModal: true } }).then(() => {
        window.location.reload();
      });
    });

    this.idle.onIdleStart.subscribe(() => {
      console.log('started');

      this.idleState = 'You\'ve gone idle!'
      console.log(this.idleState);
      //  document.getElementById('openTimeoutModal').click()
    });

    //  this.idle.onTimeoutWarning.subscribe((countdown) => {
    //    this.idleState = 'You will time out in ' + countdown + ' seconds!'
    //  });

    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
    const currentUser: any = this.gs.userDetails;
    console.log(currentUser);

    if (currentUser && currentUser.token && currentUser.token !== null) {
      console.log(currentUser);
      this.idle.watch()
      const interval = setInterval(() => {
        if (remainingSeconds > 0) {
          console.log(`Time remaining: ${remainingSeconds} seconds`);
          remainingSeconds--;
        } else {
          console.log("Countdown finished!");
          clearInterval(interval); // Stop the interval once the countdown is finished
        }
      }, 1000);
      console.log('start');
      this.timedOut = false;
    } else {
      this.idle.stop();
    }

  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  stay() {
    this.reset();
    // document.getElementById('closeTimoutModal').click()
  }
}
