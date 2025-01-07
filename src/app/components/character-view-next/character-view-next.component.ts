import { Component, effect, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { CharacterService } from 'src/app/services/character.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { CharRestDialogComponent } from '../character-view/char-rest-dialog/char-rest-dialog.component';
import { DiceRollerComponent } from '../utilities/dice-roller/dice-roller.component';
import { CharacterViewNextService } from './character-view-next.service';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';

interface PrideFlag {
  name: string;
  label: string;
  colors: string[];
}

@Component({
    selector: 'app-character-view-next',
    templateUrl: './character-view-next.component.html',
    styleUrl: './character-view-next.component.scss',
    standalone: false
})
export class CharacterViewNextComponent {
  public user: AdventurerUser | null;
  public character: any;
  public characterIdData: string = '';
  public editMode: boolean = false;
  public prideFlag: PrideFlag | null = null;
  public isMobile: boolean = false;
  public inCampaign: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private charService: CharacterService,
    private charViewNextService: CharacterViewNextService,
    private sidenavService: SidenavService,
    private matDialog: MatDialog,
    private http: HttpClient,
    public breakpointObserver: BreakpointObserver
  ) {
    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (!this.user) return;
      this.charService.getCharacterSignalById(this.characterIdData !== '' ? this.characterIdData : window.location.href.split('/').pop());
    });

    effect(() => {
      this.character = this.charService.character();
      if (!this.character) return;
      this.editMode = this.charViewNextService.verifyEditMode(this.user, this.character);

      const resultCA: any = this.charViewNextService.calcCA(this.character);
      this.character.CA = resultCA.CA;
      this.character.CAShield = resultCA.CAShield;

      const resultBonuses: any = this.charViewNextService.calcBonuses(this.character);
      this.character.parametriVitali = {
        massimoPuntiFerita: this.character.parametriVitali.massimoPuntiFerita += resultBonuses.parametriVitali.massimoPuntiFerita,
        velocità: this.character.parametriVitali.velocità += resultBonuses.parametriVitali.velocità,
      }

      this.http.get('./assets/settings/inclusivityFlags.json').subscribe((data: any[]) => {
        this.prideFlag = data.find((flag) => flag.name === this.character.status.prideFlag) || null as PrideFlag;
      });

      console.log(this.character);

    });

    if (window.location.href.includes('campaign-view/')) {
      this.inCampaign = true;
    }
    breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isMobile = result.matches;
    });

    if (this.characterId === '' && !window.location.href.includes('campaign-view')) {
      this.characterId = window.location.href.split('/').pop();
    }
  }

  @Input() public set characterId(id: string) {
    this.characterIdData = id;
    console.log(this.characterIdData);

  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  public openDiceRoller() {
    this.matDialog.open(DiceRollerComponent, {
      width: window.innerWidth < 768 ? '90%' : '500px',
      autoFocus: false,
      disableClose: true,
      data: {
        char: this.character,
        formula: null
      }
    });
  }

  public openRestDialog() {
    this.matDialog.open(CharRestDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '500px',
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe((result) => {
      if (result && result.status !== 'success') return;
      this.charService.longRest(this.character.id);
    });
  }
}
