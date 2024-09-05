import {Component, HostListener} from '@angular/core';
import {Stats} from "../../models/stats.model";
import {Deck} from "../../models/deck.model";
import {Flashcard} from "../../models/flashcard.model";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {DeckService} from "../services/deck.service";
import {AccessService} from "../services/access.service";
import {UserService} from "../services/user.service";
import {StatsService} from "../services/stats.service";
import {NgClass, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UserIn} from "../../models/userIn.model";

@Component({
  selector: 'app-test-mode',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './test-mode.component.html',
  styleUrl: './test-mode.component.css'
})
export class TestModeComponent {
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
  eingabe: string = '';
  checked: boolean = false;
  ergebnis: boolean = false;
  stat: Stats = {
    shown: 0,
    correct: 0,
    userid: 0,
    cardid: 0
  };

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

  right() {
    this.statsService.getStatsByIds(this.currUser.id, this.cards[this.count].id).subscribe(stats => {
      stats.correct++
      stats.shown++
      this.stat.correct = stats.correct;
      this.stat.shown = stats.shown;
      this.statsService.updateStats(this.currUser.id, stats.cardid, stats).subscribe()
    });
    this.richtig++;
  }

  wrong() {
    this.wrongFlashcard.push(this.cards[this.count]);
    this.statsService.getStatsByIds(this.currUser.id, this.cards[this.count].id).subscribe(stats => {
      stats.shown++
      this.stat.correct = stats.correct;
      this.stat.shown = stats.shown;
      this.statsService.updateStats(this.currUser.id, stats.cardid, stats).subscribe()
    });
    this.falsch++;
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
    this.checked = false;
  }

  get progressWidth(): string {
    if (this.cards.length === 0) return '0%';
    return `${(this.count / this.cards.length) * 100}%`;
  }

  check() {
    if (this.cards[this.count].back === this.eingabe) {
      this.checked = true
      this.ergebnis = true;
      this.front = false
      this.back = true
      this.right()
    } else {
      this.checked = true
      this.ergebnis = false;
      this.front = false
      this.back = true
      this.wrong()
    }
  }

  weiter() {
    this.count++;
    if (this.count >= this.cards.length) {
      this.finished = true;
      this.front = false;
      this.back = false;
      if (this.wrongFlashcard.length > 0) {
        this.wrongs = true;
      }
    } else {
      this.front = true;
      this.back = false;
      this.checked = false;
      this.eingabe = ''
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Enter" && this.checked)
      this.weiter()
  }
}
