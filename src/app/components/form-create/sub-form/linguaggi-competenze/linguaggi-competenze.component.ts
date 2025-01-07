import { Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';

@Component({
    selector: 'app-linguaggi-competenze',
    templateUrl: './linguaggi-competenze.component.html',
    styleUrls: ['./linguaggi-competenze.component.scss'],
    standalone: false
})
export class LinguaggiCompetenzeComponent {
  public group: FormGroup | null = null;
  public arrayDiLinguaggi: FormArray | null = null;
  public arrayDiArmi: FormArray | null = null;
  public arrayDiArmature: FormArray | null = null;
  public arrayDiStrumenti: FormArray | null = null;
  public arrayDiAltreCompetenze: FormArray | null = null;
  public linguaggi: string[] = [];
  public armi: string[] = [];
  public armature: string[] = [];
  public strumenti: string[] = [];
  public altreCompetenze: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('altreCompetenze') as FormGroup;
        this.arrayDiLinguaggi = this.group.get('linguaggi') as FormArray;
        this.arrayDiArmi = this.group.get('armi') as FormArray;
        this.arrayDiArmature = this.group.get('armature') as FormArray;
        this.arrayDiStrumenti = this.group.get('strumenti') as FormArray;
        this.arrayDiAltreCompetenze = this.group.get('altro') as FormArray;
        if (this.arrayDiLinguaggi.value && this.arrayDiLinguaggi.value.length > 0) {
          this.linguaggi = this.arrayDiLinguaggi.value;
        }
        if (this.arrayDiArmi.value && this.arrayDiArmi.value.length > 0) {
          this.armi = this.arrayDiArmi.value;
        }
        if (this.arrayDiArmature.value && this.arrayDiArmature.value.length > 0) {
          this.armature = this.arrayDiArmature.value;
        }
        if (this.arrayDiStrumenti.value && this.arrayDiStrumenti.value.length > 0) {
          this.strumenti = this.arrayDiStrumenti.value;
        }
        if (this.arrayDiAltreCompetenze.value && this.arrayDiAltreCompetenze.value.length > 0) {
          this.altreCompetenze = this.arrayDiAltreCompetenze.value;
        }
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
      this.linguaggi.push(value);
      this.arrayDiLinguaggi?.patchValue(this.linguaggi);
    }
    event.chipInput!.clear();
  }

  public setArmi(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.armi.push(value);
      this.arrayDiArmi?.patchValue(this.armi);
    }

    event.chipInput!.clear();
  }

  public setArmature(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.armature.push(value);
      this.arrayDiArmature?.patchValue(this.armature);
    }

    event.chipInput!.clear();
  }
  public setStrumenti(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.strumenti.push(value);
      this.arrayDiStrumenti?.patchValue(this.strumenti);
    }

    event.chipInput!.clear();
  }

  public setAltro(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.altreCompetenze.push(value);
      this.arrayDiAltreCompetenze?.patchValue(this.altreCompetenze);
    }

    event.chipInput!.clear();
  }

  public removeLinguaggi(linguaggio: string) {
    const index = this.linguaggi.indexOf(linguaggio);

    if (index >= 0) {
      this.linguaggi.splice(index, 1);
      this.arrayDiLinguaggi?.patchValue(this.linguaggi);
    }
  }

  public removeArmi(arma: string) {
    const index = this.armi.indexOf(arma);

    if (index >= 0) {
      this.armi.splice(index, 1);
      this.arrayDiArmi?.patchValue(this.armi);
    }
  }

  public removeArmature(armatura: string) {
    const index = this.armature.indexOf(armatura);

    if (index >= 0) {
      this.armature.splice(index, 1);
      this.arrayDiArmature?.patchValue(this.armature);
    }
  }

  public removeStrumenti(strumento: string) {
    const index = this.strumenti.indexOf(strumento);

    if (index >= 0) {
      this.strumenti.splice(index, 1);
      this.arrayDiStrumenti?.patchValue(this.strumenti);
    }
  }

  public removeAltro(altro: string) {
    const index = this.altreCompetenze.indexOf(altro);

    if (index >= 0) {
      this.altreCompetenze.splice(index, 1);
      this.arrayDiAltreCompetenze?.patchValue(this.altreCompetenze);
    }
  }

  public editLinguaggi(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'linguaggio');
      return;
    }

    const index = this.linguaggi.indexOf(input);
    if (index >= 0) {
      this.linguaggi[index] = value;
      this.arrayDiLinguaggi?.patchValue(this.linguaggi);
    }
  }

  public editArmi(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'arma');
      return;
    }

    const index = this.armi.indexOf(input);
    if (index >= 0) {
      this.armi[index] = value;
      this.arrayDiArmi?.patchValue(this.armi);
    }
  }

  public editArmature(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'armatura');
      return;
    }

    const index = this.armature.indexOf(input);
    if (index >= 0) {
      this.armature[index] = value;
      this.arrayDiArmature?.patchValue(this.armature);
    }
  }

  public editStrumenti(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'strumento');
      return;
    }

    const index = this.strumenti.indexOf(input);
    if (index >= 0) {
      this.strumenti[index] = value;
      this.arrayDiStrumenti?.patchValue(this.strumenti);
    }
  }

  public editAltro(event:MatChipEditedEvent, input:any){
    const value = event.value.trim();

    if (!value) {
      this.remove(input, 'altro');
      return;
    }

    const index = this.altreCompetenze.indexOf(input);
    if (index >= 0) {
      this.altreCompetenze[index] = value;
      this.arrayDiAltreCompetenze?.patchValue(this.altreCompetenze);
    }
  }
}
