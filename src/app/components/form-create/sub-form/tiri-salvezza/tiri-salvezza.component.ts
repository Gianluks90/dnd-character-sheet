import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-tiri-salvezza',
    templateUrl: './tiri-salvezza.component.html',
    styleUrls: ['./tiri-salvezza.component.scss'],
    standalone: false
})
export class TiriSalvezzaComponent {

  public group: FormGroup | null = null;
  public caratteristiche: FormGroup | null = null;

  public modForza: number = 0;
  public modDestrezza: number = 0;
  public modCostituzione: number = 0;
  public modIntelligenza: number = 0;
  public modSaggezza: number = 0;
  public modCarisma: number = 0;

  public tiroForza: number = 0;
  public tiroDestrezza: number = 0;
  public tiroCostituzione: number = 0;
  public tiroIntelligenza: number = 0;
  public tiroSaggezza: number = 0;
  public tiroCarisma: number = 0;

  constructor(public formService: FormService) { }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('tiriSalvezza') as FormGroup;
        this.caratteristiche = form.get('caratteristiche') as FormGroup;
        this.applyModifier();

        this.group.valueChanges.subscribe(() => {
          this.applyModifier();
        });
      }
    });
  }

  public applyModifier(): void {

    this.modForza = Math.floor((this.caratteristiche!.get('forza')?.value - 10) / 2);
    this.tiroForza = this.group?.value.forza ? this.modForza + this.group?.value.bonusCompetenza : this.modForza;

    this.modDestrezza = Math.floor((this.caratteristiche!.get('destrezza')?.value - 10) / 2);
    this.tiroDestrezza = this.group?.value.destrezza ? this.modDestrezza + this.group?.value.bonusCompetenza : this.modDestrezza;

    this.modCostituzione = Math.floor((this.caratteristiche!.get('costituzione')?.value - 10) / 2);
    this.tiroCostituzione = this.group?.value.costituzione ? this.modCostituzione + this.group?.value.bonusCompetenza : this.modCostituzione;

    this.modIntelligenza = Math.floor((this.caratteristiche!.get('intelligenza')?.value - 10) / 2);
    this.tiroIntelligenza = this.group?.value.intelligenza ? this.modIntelligenza + this.group?.value.bonusCompetenza : this.modIntelligenza;

    this.modSaggezza = Math.floor((this.caratteristiche!.get('saggezza')?.value - 10) / 2);
    this.tiroSaggezza = this.group?.value.saggezza ? this.modSaggezza + this.group?.value.bonusCompetenza : this.modSaggezza;

    this.modCarisma = Math.floor((this.caratteristiche!.get('carisma')?.value - 10) / 2);
    this.tiroCarisma = this.group?.value.carisma ? this.modCarisma + this.group?.value.bonusCompetenza : this.modCarisma;

  }
}
