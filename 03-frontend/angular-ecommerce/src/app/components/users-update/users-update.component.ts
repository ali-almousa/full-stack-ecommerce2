import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from 'src/app/common/users';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-update',
  templateUrl: './users-update.component.html',
  styleUrls: ['./users-update.component.css']
})
export class UsersUpdateComponent implements OnInit {

  id: number;
  user: Users = new Users();

  constructor(private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router) { }


  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];

    this.usersService.getUserById(this.id).subscribe(data => {
      console.log(data);
      this.user = data;
    }, error => console.log(error));
  }

  onSubmit(){
    this.usersService.updateUser(this.id, this.user).subscribe( data =>{
      this.goToUserList();
    }
    , error => console.log(error));
  }
  goToUserList() {
    this.router.navigate(['/admin/users']);
  }

}
