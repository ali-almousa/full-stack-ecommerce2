import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/common/users';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: Users[];

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(): void {
    this.usersService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  deleteUser(id: number): void {
    this.usersService.deleteUser(id).subscribe(
      data => {
        this.getUsers();
      }
    )
  }

}
