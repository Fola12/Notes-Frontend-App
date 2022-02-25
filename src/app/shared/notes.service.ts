import { Injectable } from '@angular/core';
import { Note } from './note.module';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  notes: any = new Array<Note>();

  private SERVER_URL = "http://localhost:3000/Notes";

  getNotes = JSON.parse(localStorage.getItem("Notes"));

  constructor(private http: HttpClient) {}


  get() {
  return this.http.get(this.SERVER_URL)
  }



  getId(id: number){
    return this.http.get(`${this.SERVER_URL}/${id}`);
  }



  create(note: Note){
    return this.http.post(this.SERVER_URL, note);
  }


  updates(id, data): Observable<any> {
    return this.http.put(`${this.SERVER_URL}/${id}`, data);
  }

  deletes(id): Observable<any> {
    return this.http.delete(`${this.SERVER_URL}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.SERVER_URL);
  }

}
