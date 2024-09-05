import {Component, HostListener} from '@angular/core';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {Deck} from '../../models/deck.model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {DeckService} from '../services/deck.service';
import {UserService} from '../services/user.service';
import {StatsService} from '../services/stats.service';
import {Flashcard} from '../../models/flashcard.model';
import {UserIn} from '../../models/userIn.model';
import {AccessService} from "../services/access.service";

@Component({
  selector: 'app-learn-mode',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgClass,
    RouterLink
  ],
  templateUrl: './learn-mode.component.html',
  styleUrl: './learn-mode.component.css'
})
export class LearnModeComponent {
  deck: Deck = {
    id: 0,
    description: '',
    language: '',
    owner: 0,
    editable: true,
  };
  front: boolean = true;
  back: boolean = false;
  finished: boolean = false;
  cards: Flashcard[] = [];
  owner!: UserIn;
  currUser!: UserIn;
  count: number = 0;
  wrongFlashcard: Flashcard[] = [];
  wrongs: boolean = false;
  richtig: number = 0;
  falsch: number = 0;
  isFlipped = false;
  private isProcessing= false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private deckService: DeckService,
    private userService: UserService,
    private statsService: StatsService,
    private accessService: AccessService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.currUser = await this.authService.getCurrentUserValue();

    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.deckService.getDeckById(id).subscribe(d => {
        this.userService.getUserById(d.owner).subscribe(u => {
          this.owner = u;
          this.deck = d;
          this.accessService.approveAccess({userid: this.currUser.id, deckid: d.id}).subscribe(b => {
            if (!b) {
              this.router.navigate(['/home']);
            }
          });
          if (this.deck && this.deck.id) {
            this.loadDeckCards();
          }
        });
      });
    });
  }

  loadDeckCards(): void {
    this.deckService.getCardsByDeckId(this.deck.id).subscribe(cards => {
      this.cards = cards.map(card => ({...card}));
    });
  }

  show() {
    this.isFlipped = !this.isFlipped;
    this.front = !this.front;
    this.back = !this.back;
  }

  async right() {
    this.isFlipped = false;
    await this.delay(175);
    this.statsService.getStatsByIds(this.currUser.id, this.cards[this.count].id).subscribe(stats => {
      stats.correct++
      stats.shown++
      this.statsService.updateStats(this.currUser.id, stats.cardid, stats).subscribe()
    });
    this.count++;
    this.richtig++;
    this.back = false;
    this.front = true;
    if (this.count >= this.cards.length) {
      this.finished = true;
      this.front = false;
      if (this.wrongFlashcard.length > 0) {
        this.wrongs = true;
      }
    }
  }

  async wrong() {
    this.isFlipped = false;
    await this.delay(175);
    this.wrongFlashcard.push(this.cards[this.count]);
    this.statsService.getStatsByIds(this.currUser.id, this.cards[this.count].id).subscribe(stats => {
      stats.shown++
      this.statsService.updateStats(this.currUser.id, stats.cardid, stats).subscribe()
    });
    this.count++;
    this.falsch++;
    this.back = false;
    this.front = true;
    if (this.count >= this.cards.length) {
      this.finished = true;
      this.front = false;
      if (this.wrongFlashcard.length > 0) {
        this.wrongs = true;
      }
    }
      blur()
  }

  async fertig() {
    await this.router.navigate(['/editdeck/' + this.deck.id]);
  }

  wrongFlashcardsagain() {
    this.cards = this.wrongFlashcard
    this.wrongFlashcard = [];
    this.finished = false;
    this.wrongs = false;
    this.front = true;
    this.back = false;
    this.count = 0;
    this.richtig = 0;
    this.falsch = 0;
  }

  get progressWidth(): string {
    if (this.cards.length === 0) return '0%';
    return `${(this.count / this.cards.length) * 100}%`;
  }

  delay(timeout:number) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  getCardHeight() {
    let text = this.cards?.[this.count]?.front || '';
    const text2 = this.cards?.[this.count]?.back || '';
    if (text2.length > text.length) {
      text = text2;
    }
    return Math.max(100, text.length * 6.9)
  }

  getCardWidth() {
    let text = this.cards?.[this.count]?.front || '';
    const text2 = this.cards?.[this.count]?.back || '';
    if (text2.length > text.length) {
      text = text2;
    }
    return Math.min(100, text.length * 1.5)
  }

  @HostListener('window:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.finished && !this.isProcessing) {
      this.isProcessing = true;

      if (event.key === " ") {
        this.show();
        this.isProcessing = false;
      }
      if (event.key === 'ArrowLeft') {
        await this.right();
        this.isProcessing = false;
      }
      if (event.key === 'ArrowRight') {
        await this.wrong();
        this.isProcessing = false;
      }
    }
  }

  @HostListener('click', ['$event.target'])
  onBlurButtonClick(target: HTMLElement) {
    target.blur();
  }
}
