import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Flashcard} from "../../models/flashcard.model";
import {NgIf} from "@angular/common";
import {UserIn} from "../../models/userIn.model";
import {Stats} from "../../models/stats.model";
import {StatsService} from "../services/stats.service";

@Component({
  selector: 'app-flashcard-item',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './flashcard-item.component.html',
  styleUrl: './flashcard-item.component.css'
})
export class FlashcardItemComponent implements OnInit {
  @Input() card!: Flashcard;
  @Input() user!: UserIn;
  @Output() edit = new EventEmitter<Flashcard>();
  @Output() delete = new EventEmitter<number>();
  @Input() editAllowed: boolean = true;
  @Input() stats: boolean = false;

  stat!: Stats;

  editCard() {
    this.edit.emit(this.card);
  }

  deleteCard() {
    this.delete.emit(this.card.id);
  }


  constructor(private statsService: StatsService) {
  }

  ngOnInit(): void {
    if (this.stats) {
      try {
        this.statsService.getStatsByIds(this.user.id, this.card.id).subscribe(stats => this.stat = stats, () => this.stats = false);
      } catch (error) {
        this.stats = false;
      }
    }
  }

  reset() {
    this.stat.shown = 0;
    this.stat.correct = 0;
    this.statsService.updateStats(this.user.id, this.card.id, this.stat).subscribe();
  }
}
