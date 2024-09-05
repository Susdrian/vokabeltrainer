import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {RouterLink} from "@angular/router";
import {UserIn} from "../../models/userIn.model";
import {DatePipe, JsonPipe, NgForOf} from "@angular/common";
import {Deck} from "../../models/deck.model";
import {UserService} from "../services/user.service";
import {Flashcard} from "../../models/flashcard.model";
import {DeckService} from "../services/deck.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    JsonPipe,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public user!: UserIn | undefined;
  public deckCards = new Map<number, Flashcard[]>
  public decks: Deck[] = []

  constructor(private authService: AuthService, private userService: UserService, private deckService: DeckService) {
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getCurrentUserValue();
    this.userService.getUserDecks(this.user.id).subscribe(decks => {
      this.decks = decks;
      this.decks.forEach(d => {
        this.deckService.getCardsByDeckId(d.id).subscribe(fcs => this.deckCards.set(d.id, fcs));
      });
    });
  }

  logout() {
    this.user!.lastlogin = new Date(Date.now());
    this.userService.updateUser(this.user!.id, this.user!).subscribe(() => {
      console.log(this.user);
      this.authService.logout();
    })
  }

  vocabAmount(deck: Deck): number {
    const cards: Flashcard[] | undefined = this.deckCards.get(deck.id);
    if (cards != undefined) {
      return cards.length;
    }
    return 0;
  }
}
