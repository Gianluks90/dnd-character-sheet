import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MoneyDialogComponent } from './money-dialog/money-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { NotificationService } from 'src/app/services/notification.service';
import { FormService } from 'src/app/services/form.service';
import { FormGroup } from '@angular/forms';
import { CharacterService } from 'src/app/services/character.service';
import { Item } from 'src/app/models/item';

@Component({
    selector: 'app-equipaggiamento-tab-view',
    templateUrl: './equipaggiamento-tab-view.component.html',
    styleUrls: ['./equipaggiamento-tab-view.component.scss'],
    standalone: false
})
export class EquipaggiamentoTabViewComponent {

  public characterData: any;
  public equipaggiamentoData: Item[] = [];
  public pesoTrasportabile = 0;
  public ingombroTotale = 0;
  public messaggioIngombro = '';
  public denaroData: any = {};
  public idData: string = '';

  public denaroForm: FormGroup | null = null;

  constructor(private dialog: MatDialog, private platform: Platform, private notification: NotificationService, private formService: FormService, private charService: CharacterService) { }

  @Input() set character(character: any) {
    this.characterData = character;
    this.equipaggiamentoData = character.equipaggiamento;
    this.pesoTrasportabile = character.caratteristiche.forza * 7.5;
    this.setPeso();
    this.messaggioIngombro = (this.ingombroTotale > (character.caratteristiche.forza * 2.5)) && (this.ingombroTotale < (character.caratteristiche.forza * 5))  ? 'Ingombrato (-3m velocità)' : this.ingombroTotale > (character.caratteristiche.forza * 5) ? 'Pesantemente ingombrato (-6m velocità, svantaggio alle prove di caratteristica, tiri per colpire usando Forza, Destrezza o Costituzione)' : '';
    this.denaroData = character.denaro;
    this.idData = character.id;
  }

  // @Input() set equipaggiamento(value: Item[]) {
  //   this.equipaggiamentoData = value;
  // }

  // @Input() set denaro(value: any) {
  //   this.denaroData = value;
  // }

  // @Input() set characterId(id: string) {
  //   this.idData = id;
  // }

  // ngOnInit(): void {
  //   this.formService.formSubject.subscribe((form: any) => {
  //     console.log('FORM', form);
      
  //     if (form) {
  //       console.log('FORM', form);
        
  //       this.denaroForm = form.get('denaro') as FormGroup;
  //     }
  //   });
  // }

  public openMoneyDialog() {
    // const characterId = window.location.href.split('/').pop();
    this.dialog.open(MoneyDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      disableClose: true,
      autoFocus: false,
      data: {
        char: this.characterData,
      }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        // console.log('RESULT', result);
        // this.denaroData = result.newValue;
        // this.charService.updateMoney(this.idData, this.denaroData).then(() => {
          // this.notification.openSnackBar('Denaro aggiornato.', 'toll', 3000, '');
        // });
      }
    });
  }

  public setPeso() {
    this.ingombroTotale = 0;
    this.equipaggiamentoData.forEach((item: Item) => {
      if (item.weight > 0 && !item.weared) {
        this.ingombroTotale += (item.weight * item.quantity);
      }
    });
  }
}
