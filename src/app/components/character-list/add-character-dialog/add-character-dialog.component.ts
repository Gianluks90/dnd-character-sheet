import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormModel } from 'src/app/models/formModel';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-add-character-dialog',
    templateUrl: './add-character-dialog.component.html',
    styleUrls: ['./add-character-dialog.component.scss'],
    standalone: false
})
export class AddCharacterDialogComponent {

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    public dialogRef: MatDialogRef<AddCharacterDialogComponent>,
    public formService: FormService) { }

  public form: FormGroup = this.fb.group(FormModel.create(this.fb))
  public charForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]]
  });

  public confirm() {
    this.form.get('informazioniBase')?.get('nomePersonaggio')?.setValue(this.charForm.value.name);
    this.characterService.createCharacter(this.form).then(() => {
    }).then(() => {
      this.dialogRef.close('confirm');
    })
  }

  public uploadFile(file:any){
    const fileToParse = file.target.files[0]
    const fileReader = new FileReader();
    fileReader.onload = () => {
        const fileContent = fileReader.result as string;
        const jsonData = JSON.parse(fileContent);
        this.formService.initJsonForm(jsonData);
        this.characterService.createCharacter(this.formService.formSubject.value).then(() => {
        }).then(() => {
          this.dialogRef.close('confirm');
        })
    };
    fileReader.readAsText(fileToParse)
  }
}
