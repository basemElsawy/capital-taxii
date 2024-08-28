import { Component, inject, OnInit } from '@angular/core';
import { ClientsService } from './services/clients.service';
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
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  nationalities: any[] = [];
  addUserForm!: FormGroup;
  public readonly imgUrl = environment.image;

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.getAllClients();
  }

  getAllClients(): void {
    this.clientsService.getAllClients().subscribe({
      next: (res: any) => {
        this.clients = res;
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

  getAllNationalities() {
    this.clientsService.getAllNationalities().subscribe({
      next: (res: any) => {
        this.nationalities = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
