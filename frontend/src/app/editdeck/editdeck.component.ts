import {Component, OnInit} from '@angular/core';
import {NewdeckComponent} from "../newdeck/newdeck.component";
import {Deck} from "../../models/deck.model";
import {DeckService} from "../services/deck.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Flashcard} from "../../models/flashcard.model";
import {AuthService} from "../../auth/auth.service";
import {FlashcardService} from "../services/flashcard.service";
import {AccessService} from "../services/access.service";
import {UserService} from "../services/user.service";
import {StatsService} from "../services/stats.service";
import {Access} from "../../models/access.model";
import {FlashcardItemComponent} from "../flashcard-item/flashcard-item.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {UserIn} from "../../models/userIn.model";
import {concatMap, forkJoin, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {FlashcardStat} from "./flashcardStat";

@Component({
  selector: 'app-editdeck',
  standalone: true,
  imports: [
    NewdeckComponent,
    FlashcardItemComponent,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './editdeck.component.html',
  styleUrl: './editdeck.component.css'
})
export class EditdeckComponent implements OnInit {
  deck: Deck = {
    id: 0,
    description: "",
    language: "",
    owner: 0,
    editable: true,
  };


  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private deckService: DeckService, private cardService: FlashcardService, private accessService: AccessService, private userService: UserService, private statsService: StatsService) {
  }

  async ngOnInit(): Promise<void> {
    this.currUser = await this.authService.getCurrentUserValue();

    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.deckService.getDeckById(id).subscribe(d => {
          this.userService.getUserById(d.owner).subscribe(u => {
            this.owner = u
            if (!d.editable && !(d.owner == this.currUser.id)) {
              this.editAllowed = false;
            }
            this.deck = d;
            this.isowner = this.deck.owner == this.currUser.id;
            this.accessService.approveAccess({userid: this.currUser.id, deckid: d.id}).subscribe(b => {
              if (!b) {
                this.router.navigate(['/home']);
              }
            });
            if (this.deck && this.deck.id) {
              this.loadDeckCards();
              this.loadAccess()
            }
          })
        },
        () => this.router.navigate(['/home'])
      )
    })
  }

  shared = "";
  newCard: Flashcard = {
    front: "",
    back: "",
    id: 0,
    deckid: 0
  }
  cards: Flashcard[] = [];
  cardsStat: FlashcardStat[] = [];
  cardsBefore: Flashcard[] = [];
  tempCardId = 0;
  private file: File | null = null;
  editAllowed: boolean = true;
  owner!: UserIn;
  currUser!: UserIn;
  isowner = true;
  accessBefore: Access[] = [];
  learnTest = false;

  loadDeckCards(): void {
    this.deckService.getCardsByDeckId(this.deck.id).subscribe(cards => {
      this.cards = cards.map(card => ({...card}));
      this.cardsStat = cards.map(card => ({...card, stat: true}));
      this.cardsBefore = cards.map(card => ({...card}));
      this.learnTest = this.cards.length == 0;
      if (cards.length > 0) {
        this.tempCardId = Math.max(...cards.map(card => card.id)) + 1;
      }
    });
  }

  create() {
    this.deckService.updateDeck(this.deck.id, this.deck).pipe(catchError(() => {
      this.deck.description = "";
      this.deck.language = "";
      return of(null)
    })).subscribe(d => {
      if (d) {
        this.cards.forEach(c => {
          c.deckid = d.id;
        })
        const beforeIds = new Set(this.cardsBefore.map(card => card.id));
        const currentIds = new Set(this.cards.map(card => card.id));

        const newCards = this.cards.filter(card => !beforeIds.has(card.id));
        const deletedCardIds = [...beforeIds].filter(id => !currentIds.has(id));

        deletedCardIds.forEach(id => {
          this.cardService.delete(id).subscribe();
        });


        const updatedCards = this.cards.filter(card => beforeIds.has(card.id));
        updatedCards.forEach(uc => {
          this.cardService.update(uc).subscribe();
        });

        if (newCards.length > 0) {
          this.cardService.bulkCreate(newCards).subscribe(() => {

            this.deckService.getCardsByDeckId(d.id).subscribe(cs => {
              cs = cs.filter(card => !beforeIds.has(card.id));
              cs.forEach(e => {
                this.statsService.createStats({shown: 0, correct: 0, cardid: e.id, userid: d.owner}).subscribe();
              });
            });
          });
        }

        const shares = new Set(this.shared.split(';').map(s => s.trim()).filter(s => s !== ""));
        const tasks = Array.from(shares).map(s => {
          return this.userService.getUserByName(s).pipe(
            concatMap(user => {
              let access: Access = {userid: user.id, deckid: this.deck.id};
              if (!this.accessBefore.some(item => item.userid === access.userid && item.deckid === access.deckid)) {
                const createAccess$ = this.accessService.createAccess(access);
                this.deckService.getCardsByDeckId(d.id).subscribe(() => {
                  this.cards.forEach(e => {
                      this.statsService.createStats({
                        shown: 0,
                        correct: 0,
                        cardid: e.id,
                        userid: access.userid
                      }).subscribe();
                    }
                  );
                });
                return forkJoin([createAccess$]);
              } else {
                this.accessBefore = this.accessBefore.filter(a => !(a.userid === access.userid && a.deckid === access.deckid));
                return of(null);
              }
            }),
            catchError(() => {
              console.error("User " + s + " does not exist.");
              return of(null);
            })
          );
        });

        forkJoin(tasks).subscribe({
          complete: () => {
            this.accessBefore.forEach(a => {
              this.accessService.deleteAccess(a).subscribe();
              this.cardsBefore.forEach(c => {
                this.statsService.deleteStats(a.userid, c.id).subscribe();
              })
            });
            this.router.navigate(['/home']);
          }
        });
      }
    })
  }


  addCard() {
    this.newCard.id = this.tempCardId;
    const copy = structuredClone(this.newCard);
    this.cards.push(copy);
    const copyStat: FlashcardStat = {front: copy.front, back: copy.back, id: copy.id, deckid: copy.deckid, stat: false};
    this.cardsStat.push(copyStat);
    this.newCard.back = "";
    this.newCard.front = "";
    this.tempCardId = Math.max(...this.cards.map(card => card.id)) + 1;
  }

  edit($event: Flashcard) {
    this.tempCardId = $event.id;
    this.newCard.back = $event.back;
    this.newCard.front = $event.front;
    this.cards = this.cards.filter(c => c.id !== $event.id);
    this.cardsStat = this.cardsStat.filter(c => c.id !== $event.id);
  }

  delete($event: number) {
    this.cards = this.cards.filter(c => c.id !== $event);
    this.cardsStat = this.cardsStat.filter(c => c.id !== $event);
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files
    ) {
      this.file = target.files[0];
    } else {
      this.file = null;
      console.error('No file selected or file input is not found');
    }
  }

  upload(): void {
    if (this.file && this.file.name.endsWith(".csv")
    ) {
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
    const lines = csvText.replace(/\r\n/g, '\n').split('\n');
    lines.forEach((line) => {
      const columns = line.split(/[;,\t\r ]+/);
      if (columns.length > 1) {
        this.cards.push({front: columns[0], back: columns[1], deckid: 0, id: this.tempCardId++});
        this.cardsStat.push({front: columns[0], back: columns[1], deckid: 0, id: this.tempCardId, stat: false})
      }
    });
  }


  delDeck() {
    this.deckService.deleteDeck(this.deck.id).subscribe(() => this.router.navigate(['/home'])
    )
  }


  loadAccess() {
    this.accessService.getAccessFromDeckId(this.deck.id).subscribe(acc => {
      acc = acc.filter(a => a.userid != this.deck.owner)
      this.accessBefore = [...acc];
      acc.forEach(a => this.userService.getUserById(a.userid).subscribe(user => this.shared += user.username + ";"))
    })
  }

  resetVisibility = true;

  resetStats() {
    const updateOperations = this.cardsBefore.map(cardBef => {
      return this.statsService.updateStats(this.currUser.id, cardBef.id, {
        userid: this.currUser.id,
        cardid: cardBef.id,
        shown: 0,
        correct: 0
      });
    });

    forkJoin(updateOperations).subscribe({
      complete: () => {
        this.resetVisibility = false;
        setTimeout(() => {
          this.resetVisibility = true;
        }, 0);
      }
    });
    if (this.cardsBefore.length == 0) {
      this.resetVisibility = false;
      setTimeout(() => {
        this.resetVisibility = true;
      }, 0);
    }
  }
}
