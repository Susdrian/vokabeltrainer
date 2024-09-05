import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {Deck} from "../../models/deck.model";
import {AuthService} from "../../auth/auth.service";
import {Flashcard} from "../../models/flashcard.model";
import {JsonPipe, NgForOf} from "@angular/common";
import {DeckService} from "../services/deck.service";
import {FlashcardService} from "../services/flashcard.service";
import {FlashcardItemComponent} from "../flashcard-item/flashcard-item.component";
import {AccessService} from "../services/access.service";
import {UserService} from "../services/user.service";
import {Access} from "../../models/access.model";
import {StatsService} from "../services/stats.service";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-newdeck',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgForOf,
    JsonPipe,
    FlashcardItemComponent
  ],
  templateUrl: './newdeck.component.html',
  styleUrl: './newdeck.component.css'
})
export class NewdeckComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    try {
      const user = await this.authService.getCurrentUserValue();
      this.deck.owner = user.id;
    } catch (error) {
    }
  }


  deck: Deck = {
    id: 0,
    description: "",
    language: "",
    owner: -1,
    editable: true,
  };
  shared = "";
  newCard: Flashcard = {
    front: "",
    back: "",
    id: 0,
    deckid: 0
  }
  cards: Flashcard[] = [];
  tempCardId = 0;
  private file: File | null = null;


  constructor(private router: Router, private authService: AuthService, private deckService: DeckService, private cardService: FlashcardService, private accessService: AccessService, private userService: UserService, private statsService: StatsService) {
  }


  create() {
    this.deckService.createDeck(this.deck).pipe(catchError(() => {
      this.deck.description = "";
      this.deck.language = "";
      return of(null)
    })).subscribe(d => {
      if (d) {
        this.cards.forEach(c => {
          c.deckid = d.id;
        })
        this.cardService.bulkCreate(this.cards).subscribe(() => {

          this.deckService.getCardsByDeckId(d.id).subscribe(cs => {
            cs.forEach(e => {
                this.statsService.createStats({shown: 0, correct: 0, cardid: e.id, userid: d.owner}).subscribe();
              }
            );
            let shares = new Set(this.shared.split(';'));
            shares.forEach(s => {
              s = s.trim();
              if (s != "") {
                this.userService.getUserByName(s).pipe(catchError(() => {
                  console.error("User " + s + " does not exist.");
                  return of(null);
                })).subscribe(user => {
                  if (user) {
                    let access: Access = {userid: user.id, deckid: d.id}
                    this.accessService.createAccess(access).subscribe();
                    cs.forEach(c => this.statsService.createStats({
                      shown: 0,
                      correct: 0,
                      cardid: c.id,
                      userid: user.id
                    }).subscribe());
                  }
                })
              }
            });
            this.router.navigate(['/home']);
          });
        })
      }
    });
  }

  addCard() {
    this.newCard.id = this.tempCardId++;
    this.cards.push(structuredClone(this.newCard));
    this.newCard.back = "";
    this.newCard.front = "";
  }

  edit($event: Flashcard) {
    this.newCard.back = $event.back;
    this.newCard.front = $event.front;
    this.cards = this.cards.filter(c => c.id !== $event.id);
  }

  delete($event: number) {
    this.cards = this.cards.filter(c => c.id !== $event);
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      this.file = target.files[0];
    } else {
      this.file = null;
    }
  }

  upload(): void {
    if (this.file && this.file.name.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        this.processCsv(text);
      };
      reader.onerror = error => console.error('Error reading file:', error);
      reader.readAsText(this.file);
    } else {
      alert('Please select a .csv file.');
    }
  }

  private processCsv(csvText: string): void {
    const lines = csvText.split('\n');
    lines.forEach((line) => {
      const columns = line.split(/[;,\t\r ]+/);
      if (columns.length > 1) {
        this.cards.push({front: columns[0], back: columns[1], deckid: 0, id: this.tempCardId++});
      }
    });
  }
}
