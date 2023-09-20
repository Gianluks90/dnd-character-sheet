import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormModel } from 'src/assets/models/formModel';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  public form: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private fb: FormBuilder, ) {
    this.form.next(this.fb.group(FormModel.create(this.fb)));
    this.createForm();
  }

  public createForm(): any {
    return this.form.value;
  }
}
