import { Component, Inject, effect } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';

@Component({
    selector: 'app-exchange-dialog',
    templateUrl: './exchange-dialog.component.html',
    styleUrl: './exchange-dialog.component.scss',
    standalone: false
})
export class ExchangeDialogComponent {

  public form = this.fb.group({
    items: [],
    receiver: [null, Validators.required],
    exchangeMoney: [false as boolean],
    MP: [0, Validators.min(0)],
    MO: [0, Validators.min(0)],
    ME: [0, Validators.min(0)],
    MA: [0, Validators.min(0)],
    MR: [0, Validators.min(0)],
  });
  public validItems: Item[] = [];
  public characters: any[] = [];

  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: { selectedChar: any, characters: any[] }, 
    private charService: CharacterService,
    private campaignService: CampaignService) {
    this.characters = this.data.characters;
    this.form = this.fb.group({
      items: [[], [Validators.required, this.arrayNotEmptyValidator()]],
      receiver: [null, Validators.required],
      exchangeMoney: [false as boolean],
      MP: [0, Validators.min(0)],
      MO: [0, Validators.min(0)],
      ME: [0, Validators.min(0)],
      MA: [0, Validators.min(0)],
      MR: [0, Validators.min(0)],
    });
    this.form.get('receiver')?.valueChanges.subscribe((value: any) => {
      if (value === 'deposito') {
        this.form.get('exchangeMoney')?.setValue(false);
        this.form.get('exchangeMoney')?.disable();
      } else {
        this.form.get('exchangeMoney')?.enable();
      }
    });
    this.validItems = this.data.selectedChar.equipaggiamento.filter((item: any) => !item.weared && item.quantity > 0);
  }

  // Validatore personalizzato per verificare che l'array non sia vuoto
  private arrayNotEmptyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      return Array.isArray(value) && value.length > 0 ? null : { arrayNotEmpty: { valid: false } };
    };
  }

  public exchange() {
    const receiver = this.form.get('receiver')?.value as any;
    if (!receiver) return;
    const items = this.form.value.items;
    if (!Array.isArray(items)) return;
    if (receiver !== 'deposito') {
      items.forEach((item: any) => {
        if (!item.previousOwner || item.previousOwner.id === '') {
          item.previousOwner = {
            id: this.data.selectedChar.id,
            name: this.data.selectedChar.informazioniBase.nomePersonaggio,
            imgUrl: this.data.selectedChar.informazioniBase.urlImmaginePersonaggio
          };
        }
        // Controlla se il receiver ha già l'item
        const receiverItem = receiver.equipaggiamento?.find((i: any) => i.id === item.id);
        if (receiverItem) {
          // Incrementa la quantità se l'item esiste già
          receiverItem.quantity += 1;
        } else {
          // Aggiungi l'item se non esiste
          receiver.equipaggiamento.push({ ...item, quantity: 1 });
        }
  
        // Trova l'item nel personaggio selezionato e decrementa la quantità
        const selectedCharItem = this.data.selectedChar.equipaggiamento?.find((i: any) => i.id === item.id);
        if (selectedCharItem) {
          selectedCharItem.quantity -= 1;
        }
      });
      const requests = [];

      if (this.form.get('exchangeMoney')?.value) {
        receiver.denaro.MP += this.form.get('MP')?.value;
        receiver.denaro.MO += this.form.get('MO')?.value;
        receiver.denaro.ME += this.form.get('ME')?.value;
        receiver.denaro.MA += this.form.get('MA')?.value;
        receiver.denaro.MR += this.form.get('MR')?.value;

        this.data.selectedChar.denaro.MP -= this.form.get('MP')?.value;
        this.data.selectedChar.denaro.MO -= this.form.get('MO')?.value;
        this.data.selectedChar.denaro.ME -= this.form.get('ME')?.value;
        this.data.selectedChar.denaro.MA -= this.form.get('MA')?.value;
        this.data.selectedChar.denaro.MR -= this.form.get('MR')?.value;

        requests.push(this.charService.updateMoney(receiver.id, receiver.denaro));
        requests.push(this.charService.updateMoney(this.data.selectedChar.id, this.data.selectedChar.denaro));
      }
  
      // Aggiorna l'inventario per entrambi i personaggi
      requests.push(this.charService.updateInventory(receiver.id, receiver.equipaggiamento));
      requests.push(this.charService.updateInventory(this.data.selectedChar.id, this.data.selectedChar.equipaggiamento));
  
      Promise.all(requests).then(() => {
        this.resetForm();
      });
    } else {
      const requests = [];
      items.forEach((item: any) => {
        item.previousOwner = {
          id: this.data.selectedChar.id,
          name: this.data.selectedChar.informazioniBase.nomePersonaggio,
          imgUrl: this.data.selectedChar.informazioniBase.urlImmaginePersonaggio
        };
        requests.push(this.campaignService.addCommonItem(window.location.href.split('/').pop(), item));
        const selectedCharItem = this.data.selectedChar.equipaggiamento?.find((i: any) => i.id === item.id);
        if (selectedCharItem) {
          selectedCharItem.quantity = 0;
        }
      });
      requests.push(this.charService.updateInventory(this.data.selectedChar.id, this.data.selectedChar.equipaggiamento));
      

      Promise.all(requests).then(() => {
        this.resetForm();
      });
    }
  }

  public resetForm() {
    this.form.reset();
  }
}
