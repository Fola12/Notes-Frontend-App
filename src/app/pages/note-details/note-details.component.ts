import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss'],
})
export class NoteDetailsComponent implements OnInit {
  note: any = new Note();
  noteId: number;
  new: boolean;
  message;
  submitted = false;

  constructor(
    private notesService: NotesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.updateNote();
  }

  updateNote() {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        console.log(params.id);
        this.notesService.getId(params.id).subscribe(
          (product) => {
            this.note = product;
          },
          (error) => {
            console.log(error);
          }
        );
        this.noteId = params.id;
        this.new = false;
      } else {
        this.new = true;
      }
    });
  }

  addNotes(data): void {
    this.notesService.create(data).subscribe(
      (response) => {
        console.log(response);
        this.submitted = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubmit(form: NgForm) {
    const data = {
      title: form.value.title,
      body: form.value.body,
    };
    if (this.new) {
      this.addNotes(form.value);
    } else {
      this.notesService.updates(this.noteId, data).subscribe(
        (response) => {
          console.log(response);
          this.message = 'The product was updated!';
        },
        (error) => {
          console.log(error);
        }
      );
    }
    this.router.navigateByUrl('/');
  }



  cancel() {
    this.router.navigateByUrl('/');
  }
}
