import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { DataService } from '../data.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css'],
  providers: [DataService]
})
export class UserItemComponent implements OnInit {
  UserItemList: Item[]=[];

  constructor(private dataService: DataService) { }

  getItems(){
    this.dataService.getUserItems()
      .subscribe( items => {
        this.UserItemList = items;
      })
  }

  addItem(form){
    let newItem: Item = {
      username: form.value.username,
      fullname: form.value.fullname,
      birthdate: form.value.birthdate,
      email: form.value.email,
      password: form.value.password
    }
    this.dataService.addUserItem(newItem)
      .subscribe(item =>{
        console.log(item);
        this.getItems();
      })
  }

  deleteItem(id){
    this.dataService.deleteUseritem(id)
      .subscribe( data => {
        console.log(data);
          if(data.n ==1){
            for ( var i=0; i< this.UserItemList.length; i++){
              if(id == this.UserItemList[i]._id){
                this.UserItemList.splice(i, 1);
              }
            }
          }
      })
  }

  ngOnInit(): void {
    this.getItems();
  }

}
