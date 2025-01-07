import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MatChipInputEvent, MatChipEditedEvent } from '@angular/material/chips';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-competenze-linguaggi-level-up',
    templateUrl: './competenze-linguaggi-level-up.component.html',
    styleUrls: ['./competenze-linguaggi-level-up.component.scss'],
    standalone: false
})
export class CompetenzeLinguaggiLevelUpComponent {
  public group: FormGroup | null = null;
  public linguaggiArray: FormArray | null = null;
  public armiArray: FormArray | null = null;
  public armatureArray: FormArray | null = null;
  public strunentiArray: FormArray | null = null;
  public altroArray: FormArray | null = null;
  public linguaggiData: string[] = [];
  public armiData: string[] = [];
  public armatureData: string[] = [];
  public strumentiData: string[] = [];
  public altreCompetenzeData: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formLevelUpSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('altreCompetenze') as FormGroup;
        this.linguaggiArray = this.group.get('linguaggi') as FormArray;
        this.armiArray = this.group.get('armi') as FormArray;
        this.armatureArray = this.group.get('armature') as FormArray;
        this.strunentiArray = this.group.get('strumenti') as FormArray;
        this.altroArray = this.group.get('altro') as FormArray;

        this.linguaggiData = this.linguaggiArray.value && this.linguaggiArray.value.length > 0 ? this.linguaggiArray.value : [];
        this.armiData = this.armiArray.value && this.armiArray.value.length > 0 ? this.armiArray.value : [];
        this.armatureData = this.armatureArray.value && this.armatureArray.value.length > 0 ? this.armatureArray.value : [];
        this.strumentiData = this.strunentiArray.value && this.strunentiArray.value.length > 0 ? this.strunentiArray.value : [];
        this.altreCompetenzeData = this.altroArray.value && this.altroArray.value.length > 0 ? this.altroArray.value : [];

        // if (this.arrayDiLinguaggi.value.length > 0) {
        //   this.linguaggi = this.arrayDiLinguaggi.value;
        // }
        // if (this.arrayDiArmi.value.length > 0) {
        //   this.armi = this.arrayDiArmi.value;
        // }
        // if (this.arrayDiArmature.value.length > 0) {
        //   this.armature = this.arrayDiArmature.value;
        // }
        // if (this.arrayDiStrumenti.value.length > 0) {
        //   this.strumenti = this.arrayDiStrumenti.value;
        // }
        // if (this.arrayDiAltreCompetenze.value.length > 0) {
        //   this.altreCompetenze = this.arrayDiAltreCompetenze.value;
        // } else {
        //   this.altreCompetenze = [];
        // }
      }
    });
  }

  add(event: MatChipInputEvent, type: string): void {
    switch (type) {
      case 'linguaggio':
        this.setLinguaggi(event);
        break;
      case 'arma':
        this.setArmi(event);
        break;
      case 'armatura':
        this.setArmature(event);
        break;
      case 'strumento':
        this.setStrumenti(event);
        break;
      case 'altro':
        this.setAltro(event);
        break;

      default:
        break;
    }
  }

  remove(input: any, type: string): void {
    switch (type) {
      case 'linguaggio':
        this.removeLinguaggi(input);
        break;
      case 'arma':
        this.removeArmi(input);
        break;
      case 'armatura':
        this.removeArmature(input);
        break;
      case 'strumento':
        this.removeStrumenti(input);
        break;
      case 'altro':
        this.removeAltro(input);
        break;

      default:
        break;
    }
  }

  edit(input: any, event: MatChipEditedEvent, type: string) {
    switch (type) {
      case 'linguaggio':
        this.editLinguaggi(event, input)
        break;
        case 'arma':
          this.editArmi(event, input)
          break;
          case 'armatura':
        this.editArmature(event, input)
        break;
        case 'strumento':
          this.editStrumenti(event, input)
          break;
          case 'altro':
        this.editAltro(event, input)
        break;

      default:
        break;
    }

  }

  public setLinguaggi(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.linguaggiData.push(value);
      this.linguaggiArray?.patchValue(this.linguaggiData);
    }
    event.chipInput!.clear();
  }

  public setArmi(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.armiData.push(value);
      this.armiArray?.patchValue(this.armiData);
    }

    event.chipInput!.clear();
  }

  public setArmature(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.armatureData.push(value);
      this.armatureArray?.patchValue(this.armatureData);
    }

    event.chipInput!.clear();
  }
  public setStrumenti(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.strumentiData.push(value);
      this.strunentiArray?.patchValue(this.strumentiData);
    }

    event.chipInput!.clear();
  }

  public setAltro(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.altreCompetenzeData.push(value);
      this.altroArray?.patchValue(this.altreCompetenzeData);
    }

    event.chipInput!.clear();
  }

  public removeLinguaggi(linguaggio: string) {
    const index = this.linguaggiData.indexOf(linguaggio);

    if (index >= 0) {
      this.linguaggiData.splice(index, 1);
      this.linguaggiArray?.patchValue(this.linguaggiData);
    }
  }

  public removeArmi(arma: string) {
    const index = this.armiData.indexOf(arma);

    if (index >= 0) {
      this.armiData.splice(index, 1);
      this.armiArray?.patchValue(this.armiData);
    }
  }

  public removeArmature(armatura: string) {
    const index = this.armatureData.indexOf(armatura);

    if (index >= 0) {
      this.armatureData.splice(index, 1);
      this.armatureArray?.patchValue(this.armatureData);
    }
  }

  public removeStrumenti(strumento: string) {
    const index = this.strumentiData.indexOf(strumento);

    if (index >= 0) {
      this.strumentiData.splice(index, 1);
      this.strunentiArray?.patchValue(this.strumentiData);
    }
  }

  public removeAltro(altro: string) {
    const index = this.altreCompetenzeData.indexOf(altro);

    if (index >= 0) {
      this.altreCompetenzeData.splice(index, 1);
      this.altroArray?.patchValue(this.altreCompetenzeData);
    }
  }

  public editLinguaggi(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'linguaggio');
      return;
    }

    const index = this.linguaggiData.indexOf(input);
    if (index >= 0) {
      this.linguaggiData[index] = value;
      this.linguaggiArray?.patchValue(this.linguaggiData);
    }
  }

  public editArmi(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'arma');
      return;
    }

    const index = this.armiData.indexOf(input);
    if (index >= 0) {
      this.armiData[index] = value;
      this.armiArray?.patchValue(this.armiData);
    }
  }

  public editArmature(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'armatura');
      return;
    }

    const index = this.armatureData.indexOf(input);
    if (index >= 0) {
      this.armatureData[index] = value;
      this.armatureArray?.patchValue(this.armatureData);
    }
  }

  public editStrumenti(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'strumento');
      return;
    }

    const index = this.strumentiData.indexOf(input);
    if (index >= 0) {
      this.strumentiData[index] = value;
      this.strunentiArray?.patchValue(this.strumentiData);
    }
  }

  public editAltro(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'altro');
      return;
    }

    const index = this.altreCompetenzeData.indexOf(input);
    if (index >= 0) {
      this.altreCompetenzeData[index] = value;
      this.altroArray?.patchValue(this.altreCompetenzeData);
    }
  }
}
