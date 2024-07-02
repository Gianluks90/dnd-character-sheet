import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CharacterBottomSheetComponent } from '../character-bottom-sheet/character-bottom-sheet.component';
import { Router } from '@angular/router';
import { CharacterService } from 'src/app/services/character.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { getAuth } from 'firebase/auth';
import { DescriptionTooltipService } from 'src/app/components/utilities/description-tooltip/description-tooltip.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-campaign-char-list',
  templateUrl: './campaign-char-list.component.html',
  styleUrl: './campaign-char-list.component.scss'
})
export class CampaignCharListComponent {

  // public charIdsData: string[] = [];
  public charData: any[] = [];
  public playersNumber: number = 0;
  public isMobile: boolean = false;
  public partecipantId: string = '';
  public denaroParty: any = {
    rame: 0,
    argento: 0,
    electrum: 0,
    oro: 0,
    platino: 0
  }
  public ispirazioneParty: number = 0;
  public detailsOpen: boolean = false;
  public totalCA: number = 0;

  @Input() set characters(characters: any) {
    if (characters.length === 0) return;
    this.partecipantId = getAuth().currentUser?.uid;
    this.charData = characters;
    this.playersNumber = characters.playersNumber;
    this.userFirst();
    this.calcPassiveSkills();
    this.calcCA();
    this.calcMoney();
    this.calcInspiration();
    this.calcPF();
  }

  public isOwnerData: boolean = false;
  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  constructor(
    private breakpointObserver: BreakpointObserver, 
    public tooltip: DescriptionTooltipService, 
    private charService: CharacterService,
    private notificationService: NotificationService) {
    this.breakpointObserver.observe('(max-width: 600px)').subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit() {
    const storedState = localStorage.getItem('detailsOpen');
    this.detailsOpen = storedState === 'true';
  }

  detailsToggle(detailElement: HTMLDetailsElement) {
    this.detailsOpen = detailElement.open;
    localStorage.setItem('detailsOpen', this.detailsOpen.toString());
  }

  @Output() public selectCharEmitter = new EventEmitter<string>();
  public navigateToChar(charId: string): void {
    if (!this.isOwnerData) {
      window.open(`https://adventurer-studio.web.app/#/view/${charId}`, '_blank');
    } else {
      this.selectCharEmitter.emit(charId);
    }
  }

  private calcPassiveSkills(): void {
    this.charData.forEach(char => {
      const intelligenza = Math.floor((char.caratteristiche.intelligenza - 10) / 2);
      const saggezza = Math.floor((char.caratteristiche.saggezza - 10) / 2);

      char.percezionePassiva = 10 + saggezza + (char.competenzaAbilita.percezione ? char.tiriSalvezza.bonusCompetenza : 0);
      char.intuizionePassiva = 10 + saggezza + (char.competenzaAbilita.intuizione ? char.tiriSalvezza.bonusCompetenza : 0);
      char.indagarePassiva = 10 + intelligenza + (char.competenzaAbilita.indagare ? char.tiriSalvezza.bonusCompetenza : 0);

      char.percezionePassiva += char.competenzaAbilita.maestriaPercezione ? char.tiriSalvezza.bonusCompetenza : 0;
      char.intuizionePassiva += char.competenzaAbilita.maestriaIntuizione ? char.tiriSalvezza.bonusCompetenza : 0;
      char.indagarePassiva += char.competenzaAbilita.maestriaIndagare ? char.tiriSalvezza.bonusCompetenza : 0;
    });
  }

  private calcCA(): void {
    this.charData.forEach(char => {
      const bonuses = char.privilegiTratti.flatMap((privilegioTratto: any) => privilegioTratto.bonuses).filter((bonus: any) => bonus !== undefined);
      char.CA = 10 + Math.floor((char.caratteristiche.destrezza - 10) / 2);
      char.equipaggiamento.forEach(item => {
        if (item.category.includes('Armatura') && item.weared) {
          char.CA = item.CA + (item.plusDexterity ? Math.floor((char.caratteristiche.destrezza - 10) / 2) : 0);
        }
        if (item.category.includes('scudo') && item.weared) {
          char.shieldCA = '+' + item.CA;
        }
      })
      bonuses.forEach((bonus: any) => {
        if (bonus.element === 'CA') {
          char.CA += bonus.value;
        }
      });
    });
  }

  public calcTotalCA(char: any): string {
    const bonuses = char.privilegiTratti.flatMap((privilegioTratto: any) => privilegioTratto.bonuses).filter((bonus: any) => bonus !== undefined);
    let bonusCA = char.shieldCA ? parseInt(char.shieldCA.replace('+', '')) : 0;
    bonuses.forEach((bonus: any) => {
      if (bonus.element === 'CA') {
        bonusCA += bonus.value;
      }
    });
    return (parseInt(char.CA) + bonusCA).toString();
  }

  public calcMoney(): void {
    this.denaroParty = {
      rame: 0,
      argento: 0,
      electrum: 0,
      oro: 0,
      platino: 0
    }

    this.charData.forEach(char => {
      this.denaroParty.rame += char.denaro.MR;
      this.denaroParty.argento += char.denaro.MA;
      this.denaroParty.electrum += char.denaro.ME;
      this.denaroParty.oro += char.denaro.MO;
      this.denaroParty.platino += char.denaro.MP;
    });
  }

  public calcInspiration(): void {
    this.ispirazioneParty = this.charData.reduce((acc, char) => acc + (!char.ispirazione ? 1 : 0), 0);
  }

  // char.parametriVitali.puntiFeritaAttuali}}/{{char.parametriVitali.massimoPuntiFerita
  public calcPF(): void {
    this.charData.forEach(char => {
      const bonuses = char.privilegiTratti.flatMap((privilegioTratto: any) => privilegioTratto.bonuses).filter((bonus: any) => bonus !== undefined);
      bonuses.forEach((bonus: any) => {
        if (bonus.element === 'punti ferita') {
          char.parametriVitali.massimoPuntiFerita += bonus.value;
        }
      });
      // char.parametriVitali.pfMax = char.parametriVitali.massimoPuntiFerita;
      // char.privilegiTratti.forEach(privilegioTratto => {
      //   if (!privilegioTratto.bonuses) return;
      //   privilegioTratto.bonuses.forEach(bonus => {
      //     if (bonus.element === 'punti ferita') {
      //       char.parametriVitali.pfMax += bonus.value;
      //     }
      //   });
      // });
      if (char.parametriVitali.puntiFeritaAttuali > char.parametriVitali.massimoPuntiFerita) {
        char.parametriVitali.puntiFeritaAttuali = char.parametriVitali.massimoPuntiFerita;
      }
    });
  }

  public userFirst(): void {
    const index = this.charData.findIndex(item => item.status.userId === this.partecipantId);
    if (index !== -1) {
      const elemento = this.charData.splice(index, 1)[0];
      this.charData.unshift(elemento);
    }
  }

  public calcModifier(value: number): string {
    return Math.floor((value - 10) / 2) >= 0 ? '+' + Math.floor((value - 10) / 2) : Math.floor((value - 10) / 2).toString();
  }

  public ispirazioneToggle(char: any) {
    this.charService.updateInspiration(char.id, !char.ispirazione).then(() => {
      if (char.ispirazione) {
        this.notificationService.newLog(char.campaignId, {
          message: `${char.informazioniBase.nomePersonaggioEsteso !== '' ? char.informazioniBase.nomePersonaggioEsteso : char.informazioniBase.nomePersonaggio} ha trovato l'ispirazione!`,
          type: 'text-image',
          imageUrl: char.informazioniBase.urlImmaginePersonaggio
        });
      }
    });

  }
}

// public usaIspirazione(): void {
//   const resource = this.ispirazione;
//   if (!resource.used[0]) {
//     resource.used[0] = true;
//   } else {
//     resource.used[0] = false;
//   }
//   this.charService.updateInspiration(this.characterData.id, resource.used[0]).then(() => {
//     this.notification.openSnackBar('Ispirazione aggiornata.', 'check', 1000, 'limegreen');
//   });
// }