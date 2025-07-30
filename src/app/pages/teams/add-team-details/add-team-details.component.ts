import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { TeamServiceService } from '../team-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-team-details',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './add-team-details.component.html',
  styleUrls: ['./add-team-details.component.css']
})
export class AddTeamDetailsComponent implements OnInit {
  regionList: any[] = [];
  teamForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddTeamDetailsComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teamService: TeamServiceService
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      empId: ['', Validators.required],
      band: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      region: ['', Validators.required],
      designation: ['', Validators.required],
      emailPrid: [''],
      emailAz: [''],
      imageUrl: ['https://img.freepik.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4195.jpg?semt=ais_hybrid&w=740'],
      market: [''],
      date_of_joining: [''],
      role: ['Employee'], // default
      skills: this.fb.array([]),
      created_by: ['']
    });
  }

  ngOnInit(): void {
    this.teamForm.patchValue({
      created_by: localStorage.getItem('User_email') || 'unknown'
    });

    this.teamService.getRegions().subscribe({
      next: (res) => this.regionList = res,
      error: (err) => console.error('Error loading regions:', err)
    });

    if (this.data && this.data.empId) {
      this.teamForm.patchValue(this.data);
      if (this.data.skills?.length > 0) {
        this.data.skills.forEach((skill: any) => {
          this.addSkill(skill.name, skill.level);
        });
      } else {
        this.addSkill();
      }
    } else {
      this.addSkill(); 
    }
  }

  

  get skillForms(): FormArray {
    return this.teamForm.get('skills') as FormArray;
  }

  addSkill(name: string = '', level: number = 1): void {
    const skill = this.fb.group({
      name: [name, Validators.required],
      level: [level, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
    this.skillForms.push(skill);
  }

  removeSkill(index: number): void {
    if (this.skillForms.length > 1) {
      this.skillForms.removeAt(index);
    }
  }

  

  onCancel(): void {
    this.dialogRef.close();
  }

 
//   save(): void {
//     const updatedData = {
//        ...this.teamForm.value, updatedAt: new Date() };
    
//      const empId = this.teamForm.get('empId')?.value;

//   const teamMember = {
//     ...this.teamForm.value,
//     date_of_joining: new Date(this.teamForm.value.date_of_joining).toISOString().slice(0, 10),
//     skills: this.teamForm.value.skills  // Ensure this line exists!
//   };

//   if (this.data && this.data.empId) {
//     // UPDATE case
//     this.teamService.updateTeam(this.data.id, teamMember).subscribe({
//       next: () => {
//         alert('Team member updated successfully');
//         //this.dialogRef.close({ updated: true });
//         this.dialogRef.close({ updated: true, updatedTeam: teamMember });
//       },
//       error: (err) => {
//          if (err.message && err.message.includes("already exists")) {
//     console.warn("Duplicate entry detected.");
//   } else {
//     console.error("Something went wrong, please contact adminstrator", err);
//   }
//       }
//     });
//   } else {
//     // ADD case
//     this.teamService.addTeamMember(teamMember).subscribe({
//       next: () => {
//         alert('Team member added successfully');
//         this.dialogRef.close({ added: true });
//       },
//       error: (err) => {
//         console.error('Failed to add:', err);
//         alert('Failed to add team member');
//       }
//     });
//   }
// }

save(): void {
  const empId = this.teamForm.get('empId')?.value;

  const teamMember = {
    ...this.teamForm.value,
    date_of_joining: new Date(this.teamForm.value.date_of_joining).toISOString().slice(0, 10),
    skills: this.teamForm.value.skills
  };

  // Handle UPDATE case
  if (this.data && this.data.empId) {
    this.teamService.updateTeam(this.data.id, teamMember).subscribe({
      next: () => {
        alert('Team member updated successfully');
        this.dialogRef.close({ updated: true, updatedTeam: teamMember });
      },
      error: (err) => {
        const message = err?.error?.message || err?.message || '';

        if (message.includes('already exists') || message.includes('Duplicate entry')) {
          this.teamForm.get('empId')?.setErrors({ duplicate: true });
          alert('Employee ID already exists.');
        } else {
          console.error('Update failed:', err);
          alert('Something went wrong, please contact the administrator.');
        }
      }
    });
  }

  // Handle ADD case
 else {
  this.teamService.addTeamMember(teamMember).subscribe({
    next: () => {
      alert('Team member added successfully.');
      this.dialogRef.close({ added: true });
    },
    error: (err) => {
      const errorText = err?.error?.error; // safely extract the error string

      if (typeof errorText === 'string' && errorText.includes('already exists')) {
        this.teamForm.get('empId')?.setErrors({ duplicate: true });
        alert('Employee ID already exists.');
      } else {
        console.error('Failed to add team member:', err);
        alert('Failed to add team member. Please try again or contact support.');
      }
    }
  });
}



}


  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.teamForm.patchValue({ imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  
}
