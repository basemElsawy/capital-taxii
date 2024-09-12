import { Component, inject, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../classes/password-match.validators';
import { environment } from '../../../environments/environment.development';
import { IDrivers } from '../Drivers/IDrivers';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../Core/interfaces/user.model';
import { RatingModule } from 'primeng/rating';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule,
    CalendarModule,
    TranslateModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  nationalities: any[] = [];
  addUserForm!: FormGroup;
  public readonly imgUrl = environment.image;
  dateRangeForm!: FormGroup;
  lang!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: NgbModal,
    private translation: TranslationService,
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.initialiseAddUserForm();
    // this.dateFormInitializer();

    this.getAllAddedUsers();
    this.languageSetter();
  }
  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  dateFormInitializer() {
    this.dateRangeForm = new FormGroup({
      fromDateRange: new FormControl('', Validators.required),
      toDateRange: new FormControl('', Validators.required),
    });
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

  // sendDateRange() {
  //   let requestBody = {
  //     id: this.singleCredit.userId,
  //     ...this.dateRangeForm.value,
  //   };
  // }
}
