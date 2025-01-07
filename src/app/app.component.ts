import { Component, ViewChild } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { AuthGuardService } from './services/auth-guard.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from './services/sidenav.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {

  title = 'Adventurer Studio';
  showFiller = false;

  @ViewChild('drawer') public sidenav: MatSidenav;

  constructor(
    private firebaseService: FirebaseService,
    public authGuardService: AuthGuardService,
    private sidenavService: SidenavService) { }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
