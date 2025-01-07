import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-caratteristiche',
    templateUrl: './caratteristiche.component.html',
    styleUrls: ['./caratteristiche.component.scss'],
    standalone: false
})
export class CaratteristicheComponent {
  public group: FormGroup | null = null;

  public modForza: number = 0;
  public modDestrezza: number = 0;
  public modCostituzione: number = 0;
  public modIntelligenza: number = 0;
  public modSaggezza: number = 0;
  public modCarisma: number = 0;

  constructor(public formService: FormService) { }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('caratteristiche') as FormGroup;
        this.applyModifier();

        this.group.valueChanges.subscribe(() => {
          this.applyModifier();
        });
      }
    });
  }

  public applyModifier(): void {
    this.modForza = Math.floor((this.group!.get('forza')?.value - 10) / 2);
    this.modDestrezza = Math.floor((this.group!.get('destrezza')?.value - 10) / 2);
    this.modCostituzione = Math.floor((this.group!.get('costituzione')?.value - 10) / 2);
    this.modIntelligenza = Math.floor((this.group!.get('intelligenza')?.value - 10) / 2);
    this.modSaggezza = Math.floor((this.group!.get('saggezza')?.value - 10) / 2);
    this.modCarisma = Math.floor((this.group!.get('carisma')?.value - 10) / 2);
  }
}
