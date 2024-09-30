import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

import { RatingModule } from 'primeng/rating';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { RolesService } from './services/roles.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-roles',
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
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  permissions: any;
  addRolesForm!: FormGroup;
  lang!: string;
  selectedPermissions: any[] = [];
  choosedRoles: any;
  updateRolesForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private modalService: NgbModal,
    private translation: TranslationService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.initialiseAddRoleForm();
    // this.dateFormInitializer();
    this.getAllPermissions(); // Assuming this is needed
    this.getAllRoles(); // Assuming this is needed
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

  initialiseAddRoleForm() {
    this.addRolesForm = this.fb.group({
      name: [null, Validators.required],
      nameAr: [null, Validators.required],
      permissions: [null, Validators.required],
    });
    this.updateRolesForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      nameAr: [null, Validators.required],
      permissions: [null, Validators.required],
    });
  }

  getAllRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res;
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

  addRole() {
    let rolesBody = this.addRolesForm.value;
    this.rolesService.addRole(rolesBody).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        this.getAllRoles();
        this.addRolesForm.reset();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllPermissions() {
    this.rolesService.getallPermissions().subscribe((res: any) => {
      this.permissions = res;
    });
  }
  setRoleDataInUpdateForm(selectedRole: any) {
    const selectedPermissions = selectedRole.permissions.map(
      (permission: any) => +permission.id
    );
    console.log(selectedPermissions);
    this.updateRolesForm.patchValue({
      id: selectedRole.id,
      name: selectedRole.name,
      nameAr: selectedRole.nameAr,
      permissions: selectedPermissions,
    });
    this.selectedPermissions = selectedPermissions;
  }
  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  openUpdateModal(content: any, selectedRole: any) {
    this.choosedRoles = selectedRole;
    this.setRoleDataInUpdateForm(selectedRole);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  updateRole() {
    let body = this.updateRolesForm.value;
    this.rolesService.updateRole(body).subscribe({
      next: (res: any) => {
        this.getAllRoles();
        this.modalService.dismissAll();
        this.updateRolesForm.reset();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
