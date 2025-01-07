import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.scss'],
    standalone: false
})
export class BackgroundComponent {
  public groupInfo: FormGroup | null = null;
  public group: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.groupInfo = form.get('informazioniBase') as FormGroup;
        this.group = form.get('trattiBackground') as FormGroup;
      }
    });
  }

  public updateBackground() {
    const background = this.groupInfo?.get('background')?.value;
    const dettaglio = this.groupInfo?.get('dettaglioBackground')?.value;
    this.group?.patchValue({
      background: background,
      dettaglioBackground: dettaglio
    });
    this.groupInfo?.patchValue({
      background: background,
      dettaglioBackground: dettaglio
    });
  }
}
