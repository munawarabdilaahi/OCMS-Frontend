import { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
export function TeacherForm({ mode, defaultValues, initialData, onSubmit }) {
    const navigate = useNavigate();
    const [formData] = useState(() => (mode === 'edit' && (initialData || defaultValues)) || {
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
    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'add') {
            navigate('/teachers');
        }
        else if (mode === 'edit') {
            if (typeof onSubmit === 'function') {
                onSubmit(formData);
            }
            else {
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
            <Input id="id" placeholder="e.g. EMP100" disabled/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Dr. John Doe" disabled/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Official Email</Label>
            <Input id="email" type="email" placeholder="john.doe@ocms.edu" disabled/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+1 (555) 000-0000" disabled/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Department"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Position"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lecturer">Lecturer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input id="qualification" placeholder="e.g. PhD in Computer Science" disabled/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employmentDate">Employment Date</Label>
            <Input id="employmentDate" type="date" disabled/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Status"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6 gap-4">
        <Button variant="outline" type="button" onClick={() => navigate('/teachers')}>
          Cancel
        </Button>
        <Button type="submit" disabled>
          <Save className="mr-2 h-4 w-4"/> {mode === 'add' ? 'Save Teacher' : 'Update Teacher'}
        </Button>
      </div>
    </form>);
}
