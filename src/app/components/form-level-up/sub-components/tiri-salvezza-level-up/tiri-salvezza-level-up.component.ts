import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-tiri-salvezza-level-up',
    templateUrl: './tiri-salvezza-level-up.component.html',
    styleUrls: ['./tiri-salvezza-level-up.component.scss'],
    standalone: false
})
export class TiriSalvezzaLevelUpComponent {

  public group: FormGroup | null = null;

  constructor(public formService: FormService) { }

  ngOnInit(): void {
    this.formService.formLevelUpSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('tiriSalvezza') as FormGroup;
      }
    });
  }
}
