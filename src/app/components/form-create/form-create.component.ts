import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormModel } from 'src/app/models/formModel';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { CompleteCharacterDialogComponent } from './complete-character-dialog/complete-character-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { Router } from '@angular/router';


@Component({
    selector: 'app-form',
    templateUrl: './form-create.component.html',
    styleUrls: ['./form-create.component.scss'],
    standalone: false
})
export class FormCreateComponent implements OnInit {

  public form: FormGroup = this.fb.group(FormModel.create(this.fb));


  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private notification: NotificationService,
    private sidenavService: SidenavService,
    private dialog: MatDialog,
    private platform: Platform,
    private router: Router) { }

    public menuIcon = 'menu';

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    this.formService.initForm(characterId!);
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.form = form;
      }
    });
  }

  public saveForm() {
    if (this.form.value.status.statusCode < 2) {
      const characterId = window.location.href.split('/').pop();
      this.formService.saveDraft(characterId, this.formService.formSubject.value);
      // this.notification.openSnackBar('Bozza salvata con successo', 'check', 3000, 'limegreen');
    } else {
      // this.notification.openSnackBar('Non puoi salvare un Form Completo', 'warning', 3000, 'red');
    }
  }

  public completeForm() {
    this.saveForm();
      const characterId = window.location.href.split('/').pop();
      this.dialog.open(CompleteCharacterDialogComponent, {
        width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
        autoFocus: false,
        data: {
          id: characterId,
          form: this.form.value
        }
      }).afterClosed().subscribe((result: string) => {
        if ( result === 'confirm') {
          this.router.navigate(['/characters']).then(() => {
            // this.notification.openSnackBar('Scheda Personaggio Completata', 'check', 4000, 'limegreen');
          });
        }
      });
  }

  public previousStep() {
    this.stepper.previous();
  }

  public nextStep() {
    this.stepper.next();
  }

  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }

  public parseExport(){
    const jsonFile = JSON.stringify(this.formService.formSubject.value.value);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonFile);
    const exportButton = document.getElementById('export-button');
    exportButton.setAttribute("href", dataStr );
    exportButton.setAttribute("download", "personaggio.json");
  }
}
