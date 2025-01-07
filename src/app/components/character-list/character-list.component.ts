import { Component, OnInit, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CharacterService } from 'src/app/services/character.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { DeleteCharacterDialogComponent } from './delete-character-dialog/delete-character-dialog.component';
import { AddCharacterDialogComponent } from './add-character-dialog/add-character-dialog.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DescriptionTooltipService } from '../utilities/description-tooltip/description-tooltip.service';
import { AdventurerUser } from 'src/app/models/adventurerUser';

@Component({
    selector: 'app-character-list',
    templateUrl: './character-list.component.html',
    styleUrls: ['./character-list.component.scss'],
    standalone: false
})
export class CharacterListComponent {

  public user: AdventurerUser | null;
  public characters: any[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private characterService: CharacterService,
    private sidenavService: SidenavService,
    private dialog: MatDialog,
    public tooltip: DescriptionTooltipService) {
    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (this.user) {
        this.characterService.getCharactersByUserId(this.user.id).then(result => {
          this.characters = result;
        });
      }
    });
  }

  public menuIcon = 'menu';

  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }

  public deleteCharacter(id: string) {
    this.dialog.open(DeleteCharacterDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      data: {
        id: id
      }
    }).afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {
        // window.location.reload();
      }
    });
  }

  public createCharacter() {
    this.dialog.open(AddCharacterDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
    }).afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {
        // window.location.reload();
      }
    });
  }

  public reload() {
    window.location.reload();
  }
}
