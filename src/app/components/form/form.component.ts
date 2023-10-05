import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormModel } from 'src/app/models/formModel';
import { CharacterService } from 'src/app/services/character.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormService } from 'src/app/services/form.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  public form: FormGroup = this.fb.group(FormModel.create(this.fb))

  constructor(public firebaseService: FirebaseService, private fb:FormBuilder, private formService: FormService,
              private menuService:MenuService) {}

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    this.formService.initForm(characterId!);
    this.menuService.hiddenButton = [''];
  }


}
