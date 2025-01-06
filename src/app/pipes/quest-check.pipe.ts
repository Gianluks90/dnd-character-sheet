import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'questsCheck'
})
export class QuestsCheckPipe implements PipeTransform {
  transform(quests: any[], title: string): boolean {
    return this.checkQuest(quests, title);
  }

  private checkQuest(quest: any, title: string): boolean {
    return quest.some((q) => q.title.includes(title));
  }
}