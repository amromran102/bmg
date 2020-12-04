import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: Http) { }

  getUserItems(){
    return this.http.get('http://localhost:3000/api/users')
      .map(res => res.json());
  }

  addUserItem(newItem){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/user', newItem, {headers: headers})
      .map(res => res.json());
  }

  deleteUseritem(id){
    return this.http.delete('http://localhost:3000/api/user/'+id)
      .map(res => res.json());
  }
}
