import { Component, HostListener, NgZone } from '@angular/core';
import { GeneralService } from './shared/services/general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'digipos';

  constructor(
    private authService: GeneralService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {

  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    // Set the flag in localStorage to true when the user closes the browser or tab.
    this.authService.logout('/'); // Call your logout method here
  }

  // Additional logic to reset the flag when the user navigates within the app or performs certain actions.
  // This is to prevent accidental logout when the user is actively using the app.
  // You can customize this behavior based on your app's requirements.

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: Event) {
    // Reset the flag in localStorage when the user navigates within the app.
    // this.logoutService.setShouldLogout(false);
  }

  // Add more HostListeners or other event listeners as needed to reset the flag on specific actions.
}
