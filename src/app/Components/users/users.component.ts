import { Component, inject, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { CommonModule, DatePipe } from '@angular/common';
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
import { MultiSelectModule } from 'primeng/multiselect';
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
    MultiSelectModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DatePipe],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  nationalities: any[] = [];
  addUserForm!: FormGroup;
  updateUserForm!: FormGroup;
  public readonly imgUrl = environment.image;
  dateRangeForm!: FormGroup;
  lang!: string;
  roles: any;
  selectedRoles: any;
  userId: any;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: NgbModal,
    private translation: TranslationService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.initialiseAddUserForm();
    // this.dateFormInitializer();
    this.getAllRoles();
    this.getAllAddedUsers();
    this.getAllNationalities();
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
        userName: [null, Validators.required],
        fullName: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required],
        birthDate: [null, Validators.required],
        genderId: [null, Validators.required],
        nationalityId: [null, Validators.required],
        roles: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        picture: [null, Validators.required],
        isActive: [true, Validators.required],
      },
      { validators: passwordMatchValidator() }
    );
    this.updateUserForm = this.fb.group(
      {
        id: [null],
        userName: [null, Validators.required],
        fullName: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required],
        birthDate: [null, Validators.required],
        genderId: [null, Validators.required],
        nationalityId: [null, Validators.required],
        roles: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        picture: [null, Validators.required],
        isActive: [true, Validators.required],
      },
      { validators: passwordMatchValidator() }
    );
  }
  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  uploadPhoto(event: any) {
    this.userService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.addUserForm.controls['picture'].setValue(res);
        let cleanedBase64Image = this.userService.processImage(
          this.addUserForm.controls['picture'].value
        );

        this.addUserForm.controls['picture'].setValue(cleanedBase64Image);
      })
      .finally(() => {});
  }
  uploadPhotoOnUpdate(event: any) {
    this.userService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.updateUserForm.controls['picture'].setValue(res);
        let cleanedBase64Image = this.userService.processImage(
          this.updateUserForm.controls['picture'].value
        );

        this.updateUserForm.controls['picture'].setValue(cleanedBase64Image);
      })
      .finally(() => {});
  }
  // openUpdateModal(content: any, selectedRole: any) {
  //   this.choosedRoles = selectedRole;
  //   this.setRoleDataInUpdateForm(selectedRole);
  //   this.modalService.open(content, {
  //     size: 'xl',
  //     backdrop: 'static',
  //     centered: true,
  //     scrollable: true,
  //   });
  // }
  openUpdateModal(content: any, selectedUser: any) {
    this.userId = selectedUser.id;
    this.setDataInUpdateForm(selectedUser);
    // this.userService
    //   .updateRole(this.selectedRoles, selectedUser.id)
    //   .subscribe(() => {});
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  setDataInUpdateForm(selecteduser: any) {
    this.userService.getUserById(selecteduser.id).subscribe((user: any) => {
      const selectedRoles = user.roles.map((role: any) => role.name);

      this.updateUserForm.patchValue({
        id: user.user.id,
        userName: user.user.userName,
        fullName: user.user.fullName,
        email: user.user.email,
        password: user.user.password,
        confirmPassword: user.user.confirmPassword,
        birthDate: this.datePipe.transform(user.user.birthdate, 'yyyy-MM-dd'),
        genderId: user.user.genderId,
        nationalityId: user.user.nationalityId,
        phoneNumber: user.user.phoneNumber,
        roles: selectedRoles,
        isActive: user.user.isActive,
      });

      this.selectedRoles = selectedRoles;
    });
  }
  updateUser() {
    let updateUserBody = this.updateUserForm.value;

    let body = {
      ...updateUserBody,
      RolesDto: {
        roles: updateUserBody.roles.map((roleName: string) => {
          return { name: roleName };
        }),
      },
    };
    delete body.roles;

    this.userService.updateUser(body).subscribe({
      next: (res: any) => {
        this.getAllAddedUsers();
        this.modalService.dismissAll();
        this.updateUserForm.reset();
        this.userId = 0;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllRoles(): void {
    this.userService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
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

    let body = {
      ...addUserBody,
      RolesDto: {
        roles: addUserBody.roles.map((roleName: string) => {
          return { name: roleName }; // Transform roles to the required format
        }),
      },
    };
    delete body.roles;

    this.userService.addUser(body).subscribe({
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

  deleteUser(userId: number) {
    this.userService.deleteUserById(userId).subscribe({
      next: () => {
        this.getAllAddedUsers();
        this.toastr.success('User Deleted Successfully');
      },
      error: (error: any) => {
        this.toastr.error(error?.MesgAr || 'An error occurred');
      },
    });
  }
}
