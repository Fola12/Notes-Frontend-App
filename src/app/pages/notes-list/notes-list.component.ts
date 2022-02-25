import {
  animate,
  animation,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      //entry animation
      transition('void => *', [
        //inital state
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          //expand out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }),
        //animake the spacing
        animate(
          '50ms',
          style({
            height: '*',
            'margin-bottom': '*',
            paddingTop: '*',
            paddingBottom: '*',
            paddingLeft: '*',
            paddingRight: '*',
          })
        ),
        animate(200),
      ]),

      transition('* => void', [
        //first scale up
        animate(
          50,
          style({
            transform: 'scale(1.05)',
          })
        ),
        //scale down back to normal size while fading out
        animate(
          50,
          style({
            transform: 'scale(1)',
            opacity: 0.75,
          })
        ),
        //scale down and fade out compeletely
        animate(
          '120ms ease-out',
          style({
            transform: 'scale(0.68)',
            opacity: 0,
          })
        ),
        //Animate spacing: which includes height and margin and padding
        animate(
          '160ms ease-out',
          style({
            height: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            'margin-bottom': '0',
          })
        ),
      ]),
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({
              opacity: 0,
              height: 0,
            }),
            stagger(80, [animate('0.s ease')]),
          ],
          {
            optional: true,
          }
        ),
      ]),
    ]),
  ],
})
export class NotesListComponent implements OnInit {
  notes: any = new Array<Note>();

  filterNotes: any = new Array<Note>();

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
      this.getNotes();
  }



  getNotes() {
    this.notesService.get()
      .subscribe(
        note => {
          this.notes = note;
          this.filterNotes = note;
          console.log(note);
        },
        error => {
          console.log(error);
        });
  }




  deleteProduct(id) {
    console.log(this.notes);

    this.notesService.deletes(id)
      .subscribe(
        response => {
        },
        error => {
          console.log(error);
        });
  }


  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<any>();

    //split the query into indiviual words.
    let terms: string[] = query.split(' '); // split on spaces

    //remove duplicate search terms
    terms = this.removeDuplicates(terms);

    //compile all relevant results to the allresults array
    terms.forEach((term) => {
      let results: Note[] = this.relevantNotes(term);

      //append to the all results array
      allResults = [...allResults, ...results];
    });

    //allresults will include duplicate notes
    //cause a particular note can be the result of many search terms
    //remove duplicates
    let uniqueResults = this.removeDuplicates(allResults);
    console.log(uniqueResults);

    this.filterNotes = uniqueResults;
  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    //loop throught the array and add items to the sets

    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter((note) => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    });

    return relevantNotes;
  }

  //sort notes by relevancy
  sortResults(searchResults: Note[]){
    //calculates the relevancy based on the no of times it appears in the search result

    let noteCoutObj: Object = {};
  }
}
