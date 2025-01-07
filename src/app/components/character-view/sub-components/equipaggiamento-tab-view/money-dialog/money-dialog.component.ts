import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-money-dialog',
    templateUrl: './money-dialog.component.html',
    styleUrls: ['./money-dialog.component.scss'],
    standalone: false
})
export class MoneyDialogComponent {

  constructor(
    private formService: FormService, @Inject(MAT_DIALOG_DATA) public data: { char: any },
    private dialogRef: MatDialogRef<MoneyDialogComponent>) { }
}
