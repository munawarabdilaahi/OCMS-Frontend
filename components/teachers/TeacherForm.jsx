import { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { addTeacher, updateTeacher } from '@/features/teachers/teachers-data';
export function TeacherForm({ mode, defaultValues, initialData, onSubmit }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(() => (mode === 'edit' && (initialData || defaultValues)) || {
        id: '',
        fullName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        qualification: '',
        employmentDate: '',
        status: 'Active',
    });
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };
    const handleSelectChange = (id, value) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'add') {
            addTeacher({ ...formData, id: `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}` });
            navigate('/teachers');
        }
        else if (mode === 'edit') {
            if (typeof onSubmit === 'function') {
                onSubmit(formData);
            }
            else {
                updateTeacher(formData);
                navigate('/teachers');
            }
        }
    };
    return (<form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'add' ? 'Professional Details' : 'Update Professional Details'}</CardTitle>
          <CardDescription>
            {mode === 'add'
            ? 'Enter the official employment information for the teacher.'
            : 'Modify the teacher\'s information and employment status.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="id">Employee ID</Label>
            <Input id="id" placeholder="e.g. EMP100" value={formData.id} onChange={handleChange} required disabled={mode === 'edit'}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Dr. John Doe" value={formData.fullName} onChange={handleChange} required/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Official Email</Label>
            <Input id="email" type="email" placeholder="john.doe@ocms.edu" value={formData.email} onChange={handleChange} required/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select value={formData.position} onValueChange={(value) => handleSelectChange('position', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Position"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professor">Professor</SelectItem>
                <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                <SelectItem value="Senior Lecturer">Senior Lecturer</SelectItem>
                <SelectItem value="Lecturer">Lecturer</SelectItem>
                <SelectItem value="Teaching Assistant">Teaching Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input id="qualification" placeholder="e.g. PhD in Computer Science" value={formData.qualification} onChange={handleChange}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employmentDate">Employment Date</Label>
            <Input id="employmentDate" type="date" value={formData.employmentDate} onChange={handleChange}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6 gap-4">
        <Button variant="outline" type="button" onClick={() => navigate('/teachers')}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4"/> {mode === 'add' ? 'Save Teacher' : 'Update Teacher'}
        </Button>
      </div>
    </form>);
}
