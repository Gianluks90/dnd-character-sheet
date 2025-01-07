import { Component, effect } from '@angular/core';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MenuService } from 'src/app/services/menu.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
    standalone: false
})
export class HomePageComponent {
  public user: AdventurerUser = new AdventurerUser();
  public favChar: any | null = null;
  public favCamp: any | null = null;

  constructor(
    private menuService: MenuService,
    private sidenavService: SidenavService,
    private firebaseService: FirebaseService,
    private charService: CharacterService,
    private campService: CampaignService) {

    effect(async () => {
      this.user = this.firebaseService.userSignal();
      if (this.user) {
        this.favChar = this.user.favoriteCharacter !== '' ?
          await this.charService.getCharacterById(this.user.favoriteCharacter) : null;
        this.favCamp = this.user.favoriteCampaign !== '' ?
          await this.campService.getCampaignById(this.user.favoriteCampaign) : null;
      }
    });


  }

  public menuIcon = 'menu';
  public showDisclaimer = false;



  ngOnInit(): void {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'close';
    }
    localStorage.getItem('disclaimer') === 'true' ? this.showDisclaimer = true : this.showDisclaimer = false;
  }

  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }

  public toggleDisclaimer() {
    this.showDisclaimer = !this.showDisclaimer;
    localStorage.setItem('disclaimer', this.showDisclaimer.toString());
  }
}
