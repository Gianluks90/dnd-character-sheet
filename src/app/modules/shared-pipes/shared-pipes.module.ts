import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusStringPipe } from 'src/app/pipes/bonus-string.pipe';
import { CapitalizeStringPipe } from 'src/app/pipes/capitalize-string.pipe';
import { ComposeCharInfoStringPipe } from 'src/app/pipes/compose-char-info-string.pipe';
import { ComposeClassStringPipe } from 'src/app/pipes/compose-class-string.pipe';
import { QuestsCheckPipe } from 'src/app/pipes/quest-check.pipe';

@NgModule({
  declarations: [
    BonusStringPipe,
    ComposeClassStringPipe,
    ComposeCharInfoStringPipe,
    CapitalizeStringPipe,
    // QuestCheckPipe
    QuestsCheckPipe
  ],
  exports: [
    BonusStringPipe,
    ComposeClassStringPipe,
    ComposeCharInfoStringPipe,
    CapitalizeStringPipe,
    // QuestCheckPipe
    QuestsCheckPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedPipesModule { }
