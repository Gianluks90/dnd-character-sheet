import { Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Item } from 'src/app/models/item';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-equipaggiamento',
    templateUrl: './equipaggiamento.component.html',
    styleUrls: ['./equipaggiamento.component.scss'],
    standalone: false
})
export class EquipaggiamentoComponent {
  public equipaggiamentoGroup: Item[] = [];
  public denaroGroup: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.equipaggiamentoGroup = form.get('equipaggiamento').value;
        this.denaroGroup = form.get('denaro') as FormGroup;
      }
    });
  }
}
