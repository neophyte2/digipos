import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GeneralService } from './shared/services/general.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'digipos';

  idleState = "NOT_STARTED";
  //@ts-ignore
  countdown: number = null;
  //@ts-ignore
  lastPing: Date = null;
  timedOut = false;

  constructor(
    public gs: GeneralService,
    private idle: Idle,
    private keepalive: Keepalive,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.inActivity();
    }, 10000);
  }

  inActivity() {
    // set idle parameters
    this.idle.setIdle(300); // how long can they be inactive before considered idle, in seconds
    this.idle.setTimeout(300); // how long can they be idle before considered timed out, in seconds
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    this.idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
    });

    // do something when the user is no longer idle
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      //@ts-ignore
      this.countdown = null;
      this.cd.detectChanges(); // how do i avoid this kludge?
    });

    // do something when the user has timed out
    this.idle.onTimeout.subscribe(() => {
      this.idleState = "TIMED_OUT"
      this.gs.logout('/')
    });

    // do something as the timeout countdown does its thing
    this.idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);

    // set keepalive parameters, omit if not using keepalive
    this.keepalive.interval(15); // will ping at this interval while not idle, in seconds
    this.keepalive.onPing.subscribe(() => {
      this.lastPing = new Date()
    }); // do something when it pings

    const currentUser: any = this.gs.userDetails;
    if (currentUser && currentUser.token && currentUser.token !== null) {
      this.idle.watch()
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
  }
}
