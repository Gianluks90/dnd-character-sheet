import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusStringPipe } from 'src/app/pipes/bonus-string.pipe';
import { CapitalizeStringPipe } from 'src/app/pipes/capitalize-string.pipe';
import { ComposeCharInfoStringPipe } from 'src/app/pipes/compose-char-info-string.pipe';
import { ComposeClassStringPipe } from 'src/app/pipes/compose-class-string.pipe';



@NgModule({
  declarations: [
    BonusStringPipe,
    ComposeClassStringPipe,
    ComposeCharInfoStringPipe,
    CapitalizeStringPipe,
  ],
  exports: [
    BonusStringPipe,
    ComposeClassStringPipe,
    ComposeCharInfoStringPipe,
    CapitalizeStringPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedPipesModule { }
