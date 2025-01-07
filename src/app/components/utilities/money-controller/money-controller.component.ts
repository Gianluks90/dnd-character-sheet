import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditMoneyControllerDialogComponent } from './edit-money-controller-dialog/edit-money-controller-dialog.component';
import { DescriptionTooltipService } from '../description-tooltip/description-tooltip.service';

@Component({
    selector: 'app-money-controller',
    templateUrl: './money-controller.component.html',
    styleUrl: './money-controller.component.scss',
    standalone: false
})
export class MoneyControllerComponent {
  constructor(private fb: FormBuilder, private matDialog: MatDialog, public tooltip: DescriptionTooltipService) {}

  public denaroData: any;
  public charId: string = '';
  @Input() set char(char: any) {
    this.denaroData = char.denaro;
    this.charId = char.id;
  }

  public openEditMoneyDialog(): void {
    this.matDialog.open(EditMoneyControllerDialogComponent, {
      width: innerWidth < 768 ? '80%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: {
        charId: this.charId,
        denaro: this.denaroData
      }
    })
  }
}
