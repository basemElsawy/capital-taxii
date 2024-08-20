import { Component, inject, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../classes/password-match.validators';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  nationalities: any[] = [];
  addUserForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.initialiseAddUserForm();

    this.getAllAddedUsers();
  }

  initialiseAddUserForm() {
    this.addUserForm = this.fb.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required],
        birthDate: [null, Validators.required],
        genderId: [null, Validators.required],
        nationalityId: [null, Validators.required],
      },
      { validators: passwordMatchValidator() }
    );
  }

  getAllAddedUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  checkboxEvent(ev: any) {}

  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });
    this.getAllNationalities();
  }

  addUser() {
    let addUserBody = this.addUserForm.value;
    this.userService.addUser(addUserBody).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        this.getAllAddedUsers();
        this.addUserForm.reset();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getAllNationalities() {
    this.userService.getAllNationalities().subscribe({
      next: (res: any) => {
        this.nationalities = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
