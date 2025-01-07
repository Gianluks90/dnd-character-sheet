import { Platform } from '@angular/cdk/platform';
import { Component, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { AdventureService } from 'src/app/services/adventure.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { NewAdventureDialogComponent } from './new-adventure-dialog/new-adventure-dialog.component';

@Component({
    selector: 'app-adventures-page',
    templateUrl: './adventures-page.component.html',
    styleUrl: './adventures-page.component.scss',
    standalone: false
})
export class AdventuresPageComponent {

  public user: AdventurerUser | null;
  public adventures: any[] = [];
 
  constructor(
    public firebaseService: FirebaseService,
    public sidenavService: SidenavService,
    private adventureService: AdventureService,
    private dialog: MatDialog) {
    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (this.user) {
        this.adventureService.getAdventuresByUserId().then((adventures) => {
          this.adventures = adventures;
          this.adventures.sort((a, b) => {
            if (a.status.lastUpdate > b.status.lastUpdate) {
              return -1;
            } else if (a.status.lastUpdate < b.status.lastUpdate) {
              return 1;
            } else {
              return 0;
            }
          });
          
        });
      }
    });
  }

  public newAdventure(): void {
    this.dialog.open(NewAdventureDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false
    }).afterClosed().subscribe((result) => {
      if (result && result.status === 'success') {
        this.adventureService.addAdventure(result.adventure).then(() => {
          window.location.reload();
        });
      }
    });
  }

}
