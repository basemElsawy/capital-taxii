import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { RatingModule } from 'primeng/rating';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { PermissionsService } from './services/permissions.service';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterPipe } from '../../shared-ui/pipes/search-filter.pipe';
@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule,
    CalendarModule,
    TranslateModule,
    FormsModule,
    SearchFilterPipe,
  ],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
  permissions: any[] = [];
  addPermissionForm!: FormGroup;
  lang!: string;
  searchInput: string = '';
  constructor(
    private fb: FormBuilder,
    private permissionsService: PermissionsService,
    private modalService: NgbModal,
    private translation: TranslationService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.initialiseAddUserForm();
    // this.dateFormInitializer();

    this.getAllPermissions();
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

  initialiseAddUserForm() {
    this.addPermissionForm = this.fb.group({
      nameEN: [null, Validators.required],
      nameAR: [null, Validators.required],
      url: [null, Validators.required],
    });
  }

  getAllPermissions(): void {
    this.permissionsService.getPermissions().subscribe({
      next: (res: any) => {
        this.permissions = res;
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

  addPermission() {
    const PermissionBody = this.addPermissionForm.value;
    console.log(PermissionBody);
    this.permissionsService.addPermission(PermissionBody).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        this.getAllPermissions();
        this.addPermissionForm.reset();
        this.toastr.success('Permission added successfully!', 'Success'); // Success message
      },
      error: (error: any) => {
        // Custom error message
        const customErrorMessage =
          this.lang === 'En'
            ? 'Failed to add permission. Please check your input.'
            : 'فشل إضافة الصلاحية. يرجى التحقق من مدخلاتك.';

        // Check for specific error messages
        const errorMessage =
          error?.MesgEn?.non_field_errors?.[0] ||
          error?.MesgAr ||
          customErrorMessage;
        this.toastr.error(errorMessage, 'Error'); // Show error toast
        console.log(error);
      },
    });
  }

  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
}
