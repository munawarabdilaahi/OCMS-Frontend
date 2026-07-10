import { useNavigate, useParams } from '@/lib/router';
import { ArrowLeft, Mail, Phone, Building2, BookOpen, BadgeCheck, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTeacherById } from './teachers-data';
export default function TeacherProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const teacher = getTeacherById(id);
    if (!teacher) {
        return (<div className="p-6 space-y-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4"/> Back
        </Button>
        <p className="text-muted-foreground">Teacher not found.</p>
      </div>);
    }
    return (<div className="p-6 space-y-4">
      <Button variant="outline" onClick={() => navigate('/teachers')}>
        <ArrowLeft className="mr-2 h-4 w-4"/> Back to teachers
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl">{teacher.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">{teacher.position}</p>
          </div>
          <Badge variant={teacher.status === 'Active' ? 'default' : 'secondary'}>
            {teacher.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <BadgeCheck className="h-4 w-4 text-muted-foreground"/>
              <span className="font-medium">ID:</span> {teacher.id}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground"/>
              <span>{teacher.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground"/>
              <span>{teacher.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground"/>
              <span>{teacher.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground"/>
              <span>Employed: {teacher.employmentDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground"/>
              <span>{teacher.qualification}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Courses</h3>
            {teacher.courses && teacher.courses.length > 0 ? (<ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {teacher.courses.map((course) => (<li key={course}>{course}</li>))}
              </ul>) : (<p className="text-sm text-muted-foreground">No courses assigned.</p>)}
          </div>
        </CardContent>
      </Card>
    </div>);
}
