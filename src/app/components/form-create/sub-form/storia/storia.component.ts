import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-storia',
    templateUrl: './storia.component.html',
    styleUrls: ['./storia.component.scss'],
    standalone: false
})
export class StoriaComponent {
  public group: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form as FormGroup;
      }
    });
  }
}
