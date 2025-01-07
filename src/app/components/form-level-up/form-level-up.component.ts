import { Platform } from '@angular/cdk/platform';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { FormLevelUpModel } from 'src/app/models/formLevelUpModel';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { CompleteLevelUpDialogComponent } from './complete-level-up-dialog/complete-level-up-dialog.component';

@Component({
    selector: 'app-form-level-up',
    templateUrl: './form-level-up.component.html',
    styleUrls: ['./form-level-up.component.scss'],
    standalone: false
})
export class FormLevelUpComponent {

  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private notification: NotificationService,
    public sidenavService: SidenavService,
    private dialog: MatDialog,
    private platform: Platform,
    private router: Router) { }

  public form: FormGroup = this.fb.group(FormLevelUpModel.create(this.fb))

  @ViewChild('stepper') stepper!: MatStepper;

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    this.formService.initLevelUpForm(characterId!);
  }

  completeForm() {
    const characterId = window.location.href.split('/').pop();
   
    this.dialog.open(CompleteLevelUpDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      data: {
        id: characterId,
        form: this.formService.formLevelUpSubject.value
      }
    }).afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {

        this.router.navigate(['/characters']).then(() => {
          // this.notification.openSnackBar('Livello Aumentato', 'arrow_upward', 4000);
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
}
