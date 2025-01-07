import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
    standalone: false
})
export class SnackbarComponent {
  constructor(
    public snackbar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: {message: string, icon: string, color:string} ) { }

  public close() {
    this.snackbar.dismiss();
  }

}
